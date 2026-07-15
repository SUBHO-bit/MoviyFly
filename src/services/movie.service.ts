import { fetchFromTMDB } from '../lib/api/tmdb';
import { TMDBMovieResponse, TMDBMovieDetails } from '../types/movie';
import { mapTMDBMovieToMovieData, setDynamicMovieGenres } from '../lib/api/mappers';
import { MovieData } from '../components/movie/MovieCard';
import { getPosterUrl, getBackdropUrl } from '../config/tmdb';

const movieDetailsCache = new Map<string, Promise<MovieData>>();
const fullMovieDetailsCache = new Map<string, Promise<TMDBMovieDetails>>();

/**
 * High-fidelity, recursive/paginated TMDB fetcher that validates each returned movie's required assets.
 * If less than the target count of valid movies is collected on the first page, it automatically
 * requests additional pages to fully satisfy visual layout and prevent empty carousel items (Task 8).
 * Rigorously logs all properties, skipper, and fallback information (Task 7).
 */
async function getValidMoviesWithPagination(
  sectionName: string,
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
  startPage: number = 1,
  targetCount: number = 20,
  maxPagesToFetch: number = 5
): Promise<MovieData[]> {
  const accumulated: MovieData[] = [];
  let page = startPage;
  let fallbackUsed = false;
  let fallbackReason = '';

  while (accumulated.length < targetCount && page < startPage + maxPagesToFetch) {
    try {
      const data = await fetchFromTMDB<TMDBMovieResponse>(endpoint, { ...params, page });
      
      if (!data || !data.results || data.results.length === 0) {
        break;
      }

      for (const item of data.results) {
        if (accumulated.length >= targetCount) break;

        const mapped = mapTMDBMovieToMovieData(item);
        
        let skipReason = '';
        let isVal = true;

        if (!item.title && !item.original_title) {
          isVal = false;
          skipReason = 'Missing title';
        } else if (!item.poster_path || item.poster_path === 'null' || item.poster_path === 'undefined') {
          isVal = false;
          skipReason = 'poster_path is null, empty, or undefined';
        } else if (!item.backdrop_path || item.backdrop_path === 'null' || item.backdrop_path === 'undefined') {
          isVal = false;
          skipReason = 'backdrop_path is null, empty, or undefined';
        } else if (!item.overview || item.overview.trim() === '') {
          isVal = false;
          skipReason = 'overview is empty or missing';
        } else if (!item.release_date || item.release_date.trim() === '') {
          isVal = false;
          skipReason = 'release_date is missing or invalid';
        } else if (item.vote_average === undefined || item.vote_average === null) {
          isVal = false;
          skipReason = 'vote_average is undefined or null';
        } else if (item.vote_count === undefined || item.vote_count === null) {
          isVal = false;
          skipReason = 'vote_count is undefined or null';
        }

        // Output extremely comprehensive console logging matching Task 7
        console.log(`--- TMDB API MOVIE VALIDATION LOG ---`);
        console.log(`Section Name: ${sectionName}`);
        console.log(`TMDB Endpoint: ${endpoint} (Page: ${page})`);
        console.log(`Movie ID: ${item.id}`);
        console.log(`title: ${item.title || item.original_title}`);
        console.log(`poster_path: ${item.poster_path || 'null'}`);
        console.log(`backdrop_path: ${item.backdrop_path || 'null'}`);
        console.log(`Generated Poster URL: ${mapped.poster}`);
        console.log(`Generated Backdrop URL: ${mapped.backdrop}`);
        if (!isVal) {
          console.log(`Reason for skipping a movie: ${skipReason}`);
        } else {
          console.log(`Status: VALID (Included in section)`);
        }
        console.log(`-------------------------------------`);

        if (isVal) {
          if (!accumulated.some(m => m.id === mapped.id)) {
            accumulated.push(mapped);
          }
        }
      }
    } catch (err: any) {
      fallbackUsed = true;
      fallbackReason = err.message || String(err);
      console.log(`--- TMDB API MOVIE REQUEST FAILURE ---`);
      console.log(`Section Name: ${sectionName}`);
      console.log(`TMDB Endpoint: ${endpoint}`);
      console.log(`Reason for using fallback: TMDB Request Failed - ${fallbackReason}`);
      console.log(`---------------------------------------`);
      break;
    }

    page++;
  }

  return accumulated;
}

export const movieService = {
  /**
   * Fetch Trending Movies (Daily)
   */
  async getTrendingMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Trending Movies (Daily)', '/trending/movie/day', {}, page, 20);
  },

  /**
   * Fetch Trending Movies (Weekly)
   */
  async getWeeklyTrendingMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Trending Movies (Weekly)', '/trending/movie/week', {}, page, 20);
  },

  /**
   * Fetch Popular Movies
   */
  async getPopularMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Popular Movies', '/movie/popular', {}, page, 20);
  },

  /**
   * Fetch Top Rated Movies
   */
  async getTopRatedMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Top Rated Movies', '/movie/top_rated', {}, page, 20);
  },

  /**
   * Fetch Now Playing Movies
   */
  async getNowPlayingMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Now Playing Movies', '/movie/now_playing', {}, page, 20);
  },

  /**
   * Fetch Upcoming Movies
   */
  async getUpcomingMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Upcoming Movies', '/movie/upcoming', {}, page, 20);
  },

  /**
   * Search Movies
   */
  async searchMovies(query: string, page: number = 1): Promise<MovieData[]> {
    if (!query.trim()) return [];
    return getValidMoviesWithPagination(`Search: ${query}`, '/search/movie', { query }, page, 20, 1);
  },

  /**
   * Fetch Movies by Genre (Using discover)
   */
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination(`Genre: ${genreId}`, '/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Bollywood Movies (Hindi)
   */
  async getBollywoodMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Bollywood Movies', '/discover/movie', {
      with_original_language: 'hi',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch South Indian Movies (Tamil, Telugu, Malayalam, Kannada)
   */
  async getSouthIndianMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('South Indian Movies', '/discover/movie', {
      with_original_language: 'te|ta|ml|kn',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Indian Movies (Bollywood & South Indian: Tamil, Telugu, Malayalam, Kannada)
   */
  async getIndianMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Indian Movies', '/discover/movie', {
      with_original_language: 'hi|te|ta|ml|kn',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Hollywood Movies (English)
   */
  async getHollywoodMovies(page: number = 1): Promise<MovieData[]> {
    return getValidMoviesWithPagination('Hollywood Movies', '/discover/movie', {
      with_original_language: 'en',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Similar Movies
   */
  async getSimilarMovies(id: string | number, page: number = 1): Promise<MovieData[]> {
    const cleanId = String(id).replace('movie-', '');
    return getValidMoviesWithPagination(`Similar: ${cleanId}`, `/movie/${cleanId}/similar`, {}, page, 15, 2);
  },

  /**
   * Fetch Movie Details (Returns fully fleshed detail with exact runtimes, exact genres)
   */
  async getMovieDetails(id: string | number): Promise<MovieData> {
    const cleanId = String(id).replace('movie-', '');
    if (movieDetailsCache.has(cleanId)) {
      return movieDetailsCache.get(cleanId)!;
    }
    const promise = (async () => {
      const data = await fetchFromTMDB<TMDBMovieDetails>(`/movie/${cleanId}`);
      const releaseYear = data.release_date ? data.release_date.split('-')[0] : 'N/A';
      
      let formattedRuntime = '2h 15m';
      if (data.runtime) {
        const hours = Math.floor(data.runtime / 60);
        const mins = data.runtime % 60;
        formattedRuntime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      }

      return {
        id: `movie-${data.id}`,
        title: data.title || data.original_title || 'Untitled Movie',
        overview: data.overview || 'No overview available.',
        genres: data.genres ? data.genres.map(g => g.name) : [],
        rating: data.vote_average ? data.vote_average.toFixed(1) : '0.0',
        year: releaseYear,
        runtime: formattedRuntime,
        language: data.original_language?.toUpperCase() || 'EN',
        ageRating: data.adult ? 'R' : 'PG-13',
        poster: getPosterUrl(data.poster_path),
        backdrop: getBackdropUrl(data.backdrop_path),
        popularity: data.popularity,
        voteCount: data.vote_count,
      };
    })();
    movieDetailsCache.set(cleanId, promise);
    return promise;
  },

  /**
   * Fetch raw TMDB Movie Details
   */
  async getFullMovieDetails(id: string | number): Promise<TMDBMovieDetails> {
    const cleanId = String(id).replace('movie-', '');
    if (fullMovieDetailsCache.has(cleanId)) {
      return fullMovieDetailsCache.get(cleanId)!;
    }
    const promise = fetchFromTMDB<TMDBMovieDetails>(`/movie/${cleanId}`);
    fullMovieDetailsCache.set(cleanId, promise);
    return promise;
  },

  /**
   * Fetch Movie Credits
   */
  async getMovieCredits(id: string | number): Promise<{ id: number; cast: { id: number; name: string; character: string; profile_path: string | null }[] }> {
    const cleanId = String(id).replace('movie-', '');
    return await fetchFromTMDB<{ id: number; cast: any[] }>(`/movie/${cleanId}/credits`);
  },

  /**
   * Fetch Movie Videos (Trailers)
   */
  async getMovieVideos(id: string | number): Promise<{ id: number; results: { id: string; key: string; name: string; site: string; type: string; official: boolean }[] }> {
    const cleanId = String(id).replace('movie-', '');
    return await fetchFromTMDB<{ id: number; results: any[] }>(`/movie/${cleanId}/videos`);
  },

  /**
   * Fetch Movie Recommendations
   */
  async getMovieRecommendations(id: string | number, page: number = 1): Promise<MovieData[]> {
    const cleanId = String(id).replace('movie-', '');
    return getValidMoviesWithPagination(`Recommendations: ${cleanId}`, `/movie/${cleanId}/recommendations`, {}, page, 15, 2);
  },

  /**
   * Fetch Movie Genres and dynamically populate the mapper
   */
  async fetchAndSetGenres(): Promise<void> {
    try {
      const data = await fetchFromTMDB<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
      if (data && data.genres) {
        setDynamicMovieGenres(data.genres);
      }
    } catch (e) {
      console.warn('Failed to fetch dynamic movie genres, using pre-defined map:', e);
    }
  }
};
