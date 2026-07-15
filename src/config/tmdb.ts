export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  BACKDROP_SIZE: 'original',
  POSTER_SIZE: 'original',
  PROFILE_SIZE: 'h632',
};

export const getBackdropUrl = (path: string | null | undefined): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZE}${cleanPath}`;
};

export const getPosterUrl = (path: string | null | undefined): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZE}${cleanPath}`;
};
