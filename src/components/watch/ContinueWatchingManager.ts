import { MovieData } from '../movie/MovieCard';

/**
 * Continue Watching Manager
 * Stores and retrieves watch progress and continue-watching media items from local storage.
 */

export interface TVShowProgress {
  showId: string;
  season: number;
  episode: number;
  updatedAt: number;
}

const TV_PROGRESS_STORAGE_KEY = 'moviyfly_tv_watch_progress';
const MEDIA_STORAGE_KEY = 'moviyfly_continue_watching';
const UPDATE_EVENT = 'moviyfly_continue_watching_updated';

export const ContinueWatchingManager = {
  /**
   * Retrieves all continue watching media items.
   */
  getContinueWatching(): MovieData[] {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse continue watching list:', e);
    }
    return [];
  },

  /**
   * Saves or updates a media item in Continue Watching.
   */
  saveMovie(movie: MovieData): void {
    if (!movie || !movie.id) return;
    try {
      const existing = this.getContinueWatching();
      const cleanId = String(movie.id).replace('movie-', '').replace('tv-', '');
      const existingIdx = existing.findIndex(
        (m) => m.id === movie.id || String(m.id).replace('movie-', '').replace('tv-', '') === cleanId
      );

      if (existingIdx >= 0) {
        existing[existingIdx] = { ...existing[existingIdx], ...movie };
      } else {
        existing.unshift(movie);
      }

      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(existing.slice(0, 25)));
      this.notifySubscribers();
    } catch (e) {
      console.error('Failed to save movie to continue watching:', e);
    }
  },

  /**
   * Removes an individual movie or TV show from Continue Watching.
   */
  removeMovie(id: string | number): void {
    if (!id) return;
    try {
      const existing = this.getContinueWatching();
      const targetIdStr = String(id);
      const cleanId = targetIdStr.replace('movie-', '').replace('tv-', '');

      const updated = existing.filter((m) => {
        const currentIdStr = String(m.id);
        const currentCleanId = currentIdStr.replace('movie-', '').replace('tv-', '');
        return currentIdStr !== targetIdStr && currentCleanId !== cleanId;
      });

      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));

      // Also clean up TV progress if applicable
      const allTvProgress = this.getAllProgress();
      if (allTvProgress[cleanId]) {
        delete allTvProgress[cleanId];
        localStorage.setItem(TV_PROGRESS_STORAGE_KEY, JSON.stringify(allTvProgress));
      }

      this.notifySubscribers();
    } catch (e) {
      console.error('Failed to remove item from continue watching:', e);
    }
  },

  /**
   * Removes all items from Continue Watching.
   */
  removeAll(): void {
    try {
      localStorage.removeItem(MEDIA_STORAGE_KEY);
      this.notifySubscribers();
    } catch (e) {
      console.error('Failed to clear continue watching:', e);
    }
  },

  /**
   * Dispatches a custom event to notify components in this tab, and storage event for other tabs.
   */
  notifySubscribers(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    }
  },

  /**
   * Subscribes to Continue Watching updates.
   */
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleUpdate = () => callback();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === MEDIA_STORAGE_KEY || e.key === TV_PROGRESS_STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  },

  /**
   * Saves the watch progress for a TV show.
   */
  saveProgress(showId: string, season: number, episode: number): void {
    if (!showId) return;

    try {
      const allProgress = this.getAllProgress();
      const cleanId = showId.replace('tv-', '');

      allProgress[cleanId] = {
        showId: cleanId,
        season,
        episode,
        updatedAt: Date.now(),
      };

      localStorage.setItem(TV_PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
    } catch (e) {
      console.error('Failed to save TV watch progress:', e);
    }
  },

  /**
   * Retrieves the watch progress for a specific TV show.
   */
  getProgress(showId: string): { season: number; episode: number } | null {
    if (!showId) return null;

    try {
      const allProgress = this.getAllProgress();
      const cleanId = showId.replace('tv-', '');
      const progress = allProgress[cleanId];

      if (progress) {
        return {
          season: progress.season,
          episode: progress.episode,
        };
      }
    } catch (e) {
      console.error('Failed to retrieve TV watch progress:', e);
    }

    return null;
  },

  /**
   * Gets all progress records.
   */
  getAllProgress(): Record<string, TVShowProgress> {
    try {
      const data = localStorage.getItem(TV_PROGRESS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse all TV watch progress:', e);
    }
    return {};
  },
};

