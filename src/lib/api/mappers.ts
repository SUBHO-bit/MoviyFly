import { MovieData } from '../../components/movie/MovieCard';
import { TMDBMovie } from '../../types/movie';
import { TMDBTVShow } from '../../types/tv';
import { getPosterUrl, getBackdropUrl } from '../../config/tmdb';

// Static genre maps for blazing fast and synchronous card rendering
const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Action',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'Politics',
  37: 'Western',
};

export const setDynamicMovieGenres = (genresList: { id: number; name: string }[]) => {
  genresList.forEach((g) => {
    MOVIE_GENRES[g.id] = g.name;
  });
};

export const setDynamicTVGenres = (genresList: { id: number; name: string }[]) => {
  genresList.forEach((g) => {
    TV_GENRES[g.id] = g.name;
  });
};

export const getMovieGenreNames = (genreIds: number[] = []): string[] => {
  return genreIds.map((id) => MOVIE_GENRES[id] || 'Other').filter((name) => name !== 'Other');
};

export const getTVGenreNames = (genreIds: number[] = []): string[] => {
  return genreIds.map((id) => TV_GENRES[id] || 'Other').filter((name) => name !== 'Other');
};

export const mapTMDBMovieToMovieData = (movie: TMDBMovie): MovieData => {
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  return {
    id: `movie-${movie.id}`,
    title: movie.title || movie.original_title || 'Untitled Movie',
    overview: movie.overview || 'No overview available.',
    genres: getMovieGenreNames(movie.genre_ids),
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
    year: releaseYear,
    runtime: '2h 15m', // default standard fallback runtime for lists
    language: movie.original_language?.toUpperCase() || 'EN',
    ageRating: movie.adult ? 'R' : 'PG-13',
    poster: getPosterUrl(movie.poster_path),
    backdrop: getBackdropUrl(movie.backdrop_path),
    popularity: movie.popularity,
    voteCount: movie.vote_count,
  };
};

export const mapTMDBTVToMovieData = (tv: TMDBTVShow): MovieData => {
  const airYear = tv.first_air_date ? tv.first_air_date.split('-')[0] : 'N/A';
  return {
    id: `tv-${tv.id}`,
    title: tv.name || tv.original_name || 'Untitled Show',
    overview: tv.overview || 'No overview available.',
    genres: getTVGenreNames(tv.genre_ids),
    rating: tv.vote_average ? tv.vote_average.toFixed(1) : '0.0',
    year: airYear,
    runtime: 'TV Show', // standard tag for lists
    language: tv.original_language?.toUpperCase() || 'EN',
    ageRating: 'TV-14',
    poster: getPosterUrl(tv.poster_path),
    backdrop: getBackdropUrl(tv.backdrop_path),
    popularity: tv.popularity,
    voteCount: tv.vote_count,
  };
};
