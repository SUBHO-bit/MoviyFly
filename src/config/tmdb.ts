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
  if (path.startsWith('http')) return path.replace('/original/', '/w500/');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/null' || cleanPath === '/undefined') return '';
  const safeSize = (size === 'original' || !size) ? 'w500' : size;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${safeSize}${cleanPath}`;
};

export const getBackdropSrcSet = (path: string | null | undefined): string | undefined => {
  if (!path || path === 'null' || path === 'undefined') return undefined;
  if (path.startsWith('http')) {
    if (path.includes('image.tmdb.org/t/p/')) {
      const clean = path.replace(/https:\/\/image\.tmdb\.org\/t\/p\/[^\/]+/, '');
      return `${TMDB_CONFIG.IMAGE_BASE_URL}/w300${clean} 300w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w780${clean} 780w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w1280${clean} 1280w`;
    }
    return undefined;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/w300${cleanPath} 300w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w780${cleanPath} 780w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w1280${cleanPath} 1280w`;
};

export const getPosterSrcSet = (path: string | null | undefined): string | undefined => {
  if (!path || path === 'null' || path === 'undefined') return undefined;
  if (path.startsWith('http')) {
    if (path.includes('image.tmdb.org/t/p/')) {
      const clean = path.replace(/https:\/\/image\.tmdb\.org\/t\/p\/[^\/]+/, '');
      return `${TMDB_CONFIG.IMAGE_BASE_URL}/w185${clean} 185w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w342${clean} 342w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w500${clean} 500w`;
    }
    return undefined;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/w185${cleanPath} 185w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w342${cleanPath} 342w, ${TMDB_CONFIG.IMAGE_BASE_URL}/w500${cleanPath} 500w`;
};
