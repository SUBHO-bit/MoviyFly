export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  BACKDROP_SIZE: 'w1280', // Optimized from original
  POSTER_SIZE: 'w342',    // Optimized from original
  PROFILE_SIZE: 'w185',   // Optimized from h632
  STILL_SIZE: 'w500',     // Optimized from original/w500
  LOGO_SIZE: 'w500',     // Responsive logo size (never original)
};

export const getBackdropUrl = (path: string | null | undefined, size: string = TMDB_CONFIG.BACKDROP_SIZE): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

export const getPosterUrl = (path: string | null | undefined, size: string = TMDB_CONFIG.POSTER_SIZE): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

export const getProfileUrl = (path: string | null | undefined, size: string = TMDB_CONFIG.PROFILE_SIZE): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

export const getThumbnailUrl = (path: string | null | undefined, size: string = 'w185'): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

export const getStillUrl = (path: string | null | undefined, size: string = TMDB_CONFIG.STILL_SIZE): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

export const getLogoUrl = (path: string | null | undefined, size: string = TMDB_CONFIG.LOGO_SIZE): string => {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${cleanPath}`;
};
