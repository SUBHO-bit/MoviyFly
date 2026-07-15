import { movieService } from './movie.service';
import { tvService } from './tv.service';
import { MovieData } from '../components/movie/MovieCard';

// Curated high-fidelity list of modern, premium, and upcoming Hollywood & Indian blockbusters
const PRIORITY_KEYWORDS = [
  'Mission: Impossible',
  'Superman',
  'Fantastic Four',
  'F1',
  'How To Train Your Dragon',
  'Thunderbolts',
  'Avatar',
  'Dune',
  'John Wick',
  'War 2',
  'Coolie',
  'King',
  'Jawan',
  'Pathaan',
  'Pushpa',
  'Animal',
  'RRR',
  'KGF',
  'K.G.F',
  'Kalki 2898 AD',
  'Stree 2',
  'Chhaava',
  'Sikandar'
];

// Memory cache to keep return page navigations instant
const heroPoolCache: Record<string, MovieData[]> = {};

export const heroService = {
  /**
   * Builds a high-fidelity, highly curated rotating hero banner pool of 20-30 blockbuster titles.
   * Target Weight: 40% Trending, 30% Popular, 20% Now Playing, 10% Upcoming.
   * Strictly filters out low quality, low votes, and low popularity filler.
   */
  async getHeroMoviePool(isMoviesOnly: boolean = false): Promise<MovieData[]> {
    const cacheKey = isMoviesOnly ? 'movies_only' : 'mixed_hub';
    if (heroPoolCache[cacheKey] && heroPoolCache[cacheKey].length > 0) {
      return heroPoolCache[cacheKey];
    }

    try {
      // Warm genres
      await Promise.allSettled([
        movieService.fetchAndSetGenres(),
        isMoviesOnly ? Promise.resolve() : tvService.fetchAndSetTVGenres()
      ]);

      // 1. Parallel fetch of core lists
      const [
        trendingMovies,
        popularMovies,
        nowPlayingMovies,
        upcomingMovies,
        trendingTV,
        premiumTV
      ] = await Promise.all([
        movieService.getWeeklyTrendingMovies().catch(() => []),
        movieService.getPopularMovies().catch(() => []),
        movieService.getNowPlayingMovies().catch(() => []),
        movieService.getUpcomingMovies().catch(() => []),
        isMoviesOnly ? Promise.resolve([]) : tvService.getWeeklyTrendingTV().catch(() => []),
        isMoviesOnly ? Promise.resolve([]) : tvService.getPremiumPlatformTV().catch(() => [])
      ]);

      // 2. Parallel search for specific requested high-priority blockbusters
      // We search for a subset of top blockbusters to populate the pool with user's exact requests
      const searchPromises = PRIORITY_KEYWORDS.slice(0, 12).map(async (query) => {
        try {
          const results = await movieService.searchMovies(query);
          return results.slice(0, 1); // take the single best match
        } catch {
          return [];
        }
      });
      const searchedBlockbusterArrays = await Promise.all(searchPromises);
      const searchedBlockbusters = searchedBlockbusterArrays.flat();

      // 3. Compile all candidates
      let allCandidates: MovieData[] = [
        ...searchedBlockbusters,
        ...trendingMovies,
        ...popularMovies,
        ...nowPlayingMovies,
        ...upcomingMovies,
        ...trendingTV,
        ...premiumTV
      ];

      // Remove duplicates
      const seen = new Set<string>();
      allCandidates = allCandidates.filter(m => {
        if (!m || !m.id) return false;
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      // Filter logic:
      // - Must have backdrop image and overview
      // - Popularity above average of the set, OR in our priority blockbuster list
      // - voteCount > 300, OR in priority list, OR released in 2024+ (upcoming blockbusters)
      const isPriorityTitle = (title: string): boolean => {
        const lowerTitle = title.toLowerCase();
        return PRIORITY_KEYWORDS.some(kw => lowerTitle.includes(kw.toLowerCase()));
      };

      // Determine average popularity to filter out low popularity clutter
      const validPopularities = allCandidates.map(m => m.popularity || 0).filter(p => p > 0);
      const avgPopularity = validPopularities.length > 0 
        ? validPopularities.reduce((a, b) => a + b, 0) / validPopularities.length 
        : 15;

      const filteredCandidates = allCandidates.filter(m => {
        // Must have HD backdrop and overview
        if (!m.backdrop || m.backdrop.endsWith('null') || m.backdrop.includes('photo-1547483238-2cbf88bd1423')) return false;
        if (!m.overview || m.overview.trim().length < 20) return false;

        const title = m.title || '';
        const priority = isPriorityTitle(title);

        // Popularity check
        const pop = m.popularity || 0;
        if (!priority && pop < avgPopularity * 0.7) return false;

        // Vote count check
        const votes = m.voteCount || 0;
        const releaseYear = parseInt(String(m.year)) || 0;
        const isNewOrUpcoming = releaseYear >= 2024;
        if (!priority && votes <= 300 && !isNewOrUpcoming) return false;

        return true;
      });

      // Separate candidates back into pools by source to apply ratios
      const trendingPool: MovieData[] = [];
      const popularPool: MovieData[] = [];
      const nowPlayingPool: MovieData[] = [];
      const upcomingPool: MovieData[] = [];
      const priorityPool: MovieData[] = [];

      filteredCandidates.forEach(m => {
        const title = m.title || '';
        if (isPriorityTitle(title)) {
          priorityPool.push(m);
        } else if (trendingMovies.some(t => t.id === m.id) || trendingTV.some(t => t.id === m.id)) {
          trendingPool.push(m);
        } else if (popularMovies.some(p => p.id === m.id)) {
          popularPool.push(m);
        } else if (nowPlayingMovies.some(n => n.id === m.id)) {
          nowPlayingPool.push(m);
        } else if (upcomingMovies.some(u => u.id === m.id)) {
          upcomingPool.push(m);
        } else {
          trendingPool.push(m); // default
        }
      });

      // Shuffling helper
      const shuffle = <T,>(arr: T[]): T[] => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      };

      // Shuffle pools for fresh, dynamic selection
      const shuffledPriority = shuffle(priorityPool);
      const shuffledTrending = shuffle(trendingPool);
      const shuffledPopular = shuffle(popularPool);
      const shuffledNowPlaying = shuffle(nowPlayingPool);
      const shuffledUpcoming = shuffle(upcomingPool);

      // Target selection sizes for a robust rotating pool of 20-30 blockbusters:
      // Let's aim for a pool of 25 movies:
      // Priority (Boosted blockbusters): up to 8 movies
      // Trending (40% of rest): 8 movies
      // Popular (30% of rest): 6 movies
      // Now Playing (20% of rest): 4 movies
      // Upcoming (10% of rest): 2 movies
      const pool: MovieData[] = [];

      // Add high priority blockbusters first
      pool.push(...shuffledPriority.slice(0, 10));

      // Add other sources to fulfill exact ratios
      const addedIds = new Set<string>(pool.map(p => p.id));

      const addFromSource = (source: MovieData[], limit: number) => {
        let addedCount = 0;
        for (const m of source) {
          if (addedCount >= limit) break;
          if (!addedIds.has(m.id)) {
            pool.push(m);
            addedIds.add(m.id);
            addedCount++;
          }
        }
      };

      addFromSource(shuffledTrending, 10);
      addFromSource(shuffledPopular, 8);
      addFromSource(shuffledNowPlaying, 5);
      addFromSource(shuffledUpcoming, 3);

      // Fallback if we need to reach at least 20 titles
      if (pool.length < 20) {
        const remaining = shuffle(filteredCandidates).filter(m => !addedIds.has(m.id));
        for (const m of remaining) {
          if (pool.length >= 25) break;
          pool.push(m);
          addedIds.add(m.id);
        }
      }

      // Keep it strictly to modern blockbusters, max 30
      const finalPool = pool.slice(0, 30);

      // Save to cache
      heroPoolCache[cacheKey] = finalPool;
      return finalPool;

    } catch (e) {
      console.error('Failed to generate high-fidelity hero pool:', e);
      // Fallback to basic trending list on extreme connection error
      const trending = await movieService.getTrendingMovies().catch(() => []);
      return trending.slice(0, 10);
    }
  }
};
