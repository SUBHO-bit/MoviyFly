import * as React from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db, OperationType, FirestoreErrorInfo, handleFirestoreError } from '../firebase/firestore';
import { auth } from '../firebase/auth';
import { useAuth } from './AuthContext';
import { MovieData } from '../components/movie/MovieCard';

export { OperationType };
export type { FirestoreErrorInfo };

export interface WatchlistContextType {
  watchlist: Record<string, boolean>;
  watchlistItems: MovieData[];
  toggleWatchlist: (movie: MovieData) => Promise<void>;
  loading: boolean;
}

const WatchlistContext = React.createContext<WatchlistContextType | undefined>(undefined);

const mapToMovieData = (item: any): MovieData => {
  return {
    id: item.movieId,
    title: item.title,
    overview: '',
    genres: item.genres || [],
    rating: item.tmdbRating || 0,
    year: item.releaseDate || 'N/A',
    runtime: 'N/A',
    language: 'N/A',
    ageRating: 'PG-13',
    poster: item.posterPath || '',
    backdrop: item.backdropPath || '',
  };
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, openSignIn, isAuthenticated, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = React.useState<Record<string, boolean>>({});
  const [watchlistItems, setWatchlistItems] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Set up real-time subscription using onSnapshot
  React.useEffect(() => {
    // If authentication is still loading, wait before modifying state or subscribing
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setWatchlist({});
      setWatchlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const watchlistPath = `users/${currentUser.uid}/watchlist`;
    const watchlistRef = collection(db, 'users', currentUser.uid, 'watchlist');
    const q = query(watchlistRef, orderBy('addedAt', 'desc'));

    console.log('[WatchlistContext] Subscribing to watchlist in Firestore for UID:', currentUser.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: MovieData[] = [];
        const map: Record<string, boolean> = {};
        const seenIds = new Set<string>();

        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const movieItem = mapToMovieData(data);
            const idStr = String(movieItem.id);
            if (!seenIds.has(idStr)) {
              seenIds.add(idStr);
              items.push(movieItem);
              map[idStr] = true;
            }
          }
        });

        console.log('[WatchlistContext] Real-time watchlist update. Items count:', items.length);
        setWatchlistItems(items);
        setWatchlist(map);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, watchlistPath);
        setLoading(false);
      }
    );

    return () => {
      console.log('[WatchlistContext] Unsubscribing from watchlist listener.');
      unsubscribe();
    };
  }, [currentUser, authLoading]);

  const toggleWatchlist = React.useCallback(async (movie: MovieData) => {
    if (!isAuthenticated || !currentUser) {
      console.log('[WatchlistContext] Unauthenticated user attempted to use watchlist. Opening Sign In.');
      openSignIn();
      return;
    }

    let movieIdStr = String(movie.id);
    if (!movieIdStr.startsWith('movie-') && !movieIdStr.startsWith('tv-')) {
      const isTv = (movie as any).mediaType === 'tv' || (movie as any).isTv || (movie as any).seasonCount !== undefined || String(movie.runtime || '').includes('Season');
      movieIdStr = isTv ? `tv-${movieIdStr}` : `movie-${movieIdStr}`;
    }

    const rawId = movieIdStr.replace('movie-', '').replace('tv-', '');
    const isInWatchlist = !!(
      watchlist[movieIdStr] ||
      watchlist[rawId] ||
      watchlist[`movie-${rawId}`] ||
      watchlist[`tv-${rawId}`]
    );
    const pathForWrite = `users/${currentUser.uid}/watchlist/${movieIdStr}`;

    // 1. Optimistic updates for Instant UI responsiveness with duplicate protection
    setWatchlist((prev) => {
      const updated = { ...prev };
      if (isInWatchlist) {
        delete updated[movieIdStr];
        delete updated[rawId];
        delete updated[`movie-${rawId}`];
        delete updated[`tv-${rawId}`];
      } else {
        updated[movieIdStr] = true;
      }
      return updated;
    });

    setWatchlistItems((prev) => {
      if (isInWatchlist) {
        return prev.filter(item => {
          const itemStr = String(item.id);
          const itemRaw = itemStr.replace('movie-', '').replace('tv-', '');
          return itemStr !== movieIdStr && itemRaw !== rawId;
        });
      } else {
        if (prev.some(item => {
          const itemStr = String(item.id);
          const itemRaw = itemStr.replace('movie-', '').replace('tv-', '');
          return itemStr === movieIdStr || itemRaw === rawId;
        })) {
          return prev;
        }
        return [
          {
            ...movie,
            id: movieIdStr,
          },
          ...prev,
        ];
      }
    });

    try {
      const docRef = doc(db, 'users', currentUser.uid, 'watchlist', movieIdStr);

      if (isInWatchlist) {
        console.log('[WatchlistContext] Removing from Firestore:', movieIdStr);
        await deleteDoc(docRef);
      } else {
        console.log('[WatchlistContext] Adding to Firestore:', movieIdStr);
        const ratingNum = typeof movie.rating === 'number' 
          ? movie.rating 
          : parseFloat(String(movie.rating)) || 0;

        const watchlistItem = {
          movieId: movieIdStr,
          mediaType: movieIdStr.startsWith('tv-') ? 'tv' : 'movie',
          title: movie.title,
          posterPath: movie.poster || '',
          backdropPath: movie.backdrop || '',
          tmdbRating: ratingNum,
          releaseDate: String(movie.year || 'N/A'),
          genres: movie.genres || [],
          addedAt: new Date(), // Use client-side Date to ensure valid timestamp during optimistic onSnapshot local writes
        };

        await setDoc(docRef, watchlistItem);
      }
    } catch (error) {
      console.error('[WatchlistContext] Error syncing with Firestore:', error);
      
      // Revert optimistic state on error
      setWatchlist((prev) => {
        const reverted = { ...prev };
        if (isInWatchlist) {
          reverted[movieIdStr] = true;
        } else {
          delete reverted[movieIdStr];
        }
        return reverted;
      });

      setWatchlistItems((prev) => {
        if (isInWatchlist) {
          if (prev.some(item => String(item.id) === movieIdStr)) {
            return prev;
          }
          return [movie, ...prev];
        } else {
          return prev.filter(item => String(item.id) !== movieIdStr);
        }
      });

      handleFirestoreError(error, isInWatchlist ? OperationType.DELETE : OperationType.WRITE, pathForWrite);
    }
  }, [currentUser, isAuthenticated, openSignIn, watchlist]);

  const value: WatchlistContextType = {
    watchlist,
    watchlistItems,
    toggleWatchlist,
    loading,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = React.useContext(WatchlistContext);
  if (context === undefined) {
    const errorMsg = '[useWatchlist] useWatchlist must be used within a WatchlistProvider';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return context;
};
