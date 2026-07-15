import { TMDBMovieDetails } from '../../types/movie';
import { TMDBTVDetails } from '../../types/tv';
import { MediaItem } from '../../types/media';
import { getPosterUrl, getBackdropUrl } from '../../config/tmdb';

export const MovieAdapter = {
  toMediaItem(
    movie: TMDBMovieDetails,
    logoUrl: string | null = null,
    trailerKey: string | null = null
  ): MediaItem {
    const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
    const mins = movie.runtime ? movie.runtime % 60 : 0;
    const formattedRuntime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
      id: `movie-${movie.id}`,
      mediaType: 'movie',
      title: movie.title || movie.original_title || 'Untitled Movie',
      originalTitle: movie.original_title,
      poster: getPosterUrl(movie.poster_path),
      backdrop: getBackdropUrl(movie.backdrop_path),
      logo: logoUrl,
      overview: movie.overview || 'No description available.',
      tagline: movie.tagline || null,
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
      runtime: movie.runtime ? formattedRuntime : 'N/A',
      genres: movie.genres || [],
      language: movie.original_language?.toUpperCase() || 'EN',
      releaseDate: movie.release_date || 'N/A',
      status: movie.status || 'Released',
      trailer: trailerKey,
      cast: [],
      similar: [],
      recommendations: [],
      ageRating: (movie as any).ageRating || (movie.adult ? 'R' : 'PG-13'),
    };
  },
};

export const TVAdapter = {
  toMediaItem(
    tvShow: TMDBTVDetails,
    logoUrl: string | null = null,
    trailerKey: string | null = null
  ): MediaItem {
    const seasonsLabel = tvShow.number_of_seasons > 1
      ? `${tvShow.number_of_seasons} Seasons`
      : `${tvShow.number_of_seasons || 1} Season`;

    return {
      id: `tv-${tvShow.id}`,
      mediaType: 'tv',
      title: tvShow.name || tvShow.original_name || 'Untitled Show',
      originalTitle: tvShow.original_name,
      poster: getPosterUrl(tvShow.poster_path),
      backdrop: getBackdropUrl(tvShow.backdrop_path),
      logo: logoUrl,
      overview: tvShow.overview || 'No description available.',
      tagline: tvShow.status === 'Ended' || tvShow.last_air_date ? `TV Series (${seasonsLabel}, ${tvShow.number_of_episodes || 0} Episodes)` : 'TV Series',
      rating: tvShow.vote_average ? tvShow.vote_average.toFixed(1) : '0.0',
      runtime: seasonsLabel,
      genres: tvShow.genres || [],
      language: tvShow.original_language?.toUpperCase() || 'EN',
      releaseDate: tvShow.first_air_date || 'N/A',
      status: tvShow.status || 'Active',
      trailer: trailerKey,
      cast: [],
      similar: [],
      recommendations: [],
      seasonCount: tvShow.number_of_seasons,
      episodeCount: tvShow.number_of_episodes,
      network: tvShow.production_companies?.[0]?.name,
      ageRating: 'TV-14',
      
      // Extended fields
      created_by: tvShow.created_by,
      production_companies: tvShow.production_companies,
      last_air_date: tvShow.last_air_date,
      type: tvShow.type,
    };
  },
};
