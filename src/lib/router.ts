import * as React from 'react';

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}

export function usePath(): string {
  const [path, setPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return path;
}

export function getMovieIdFromPath(path: string): string | null {
  if (path.startsWith('/movie/')) {
    const id = path.substring(7);
    return id || null;
  }
  return null;
}

export function getTVIdFromPath(path: string): string | null {
  if (path.startsWith('/tv/')) {
    const id = path.substring(4);
    return id || null;
  }
  return null;
}

export function getMovieIdFromWatchPath(path: string): string | null {
  if (path.startsWith('/watch/movie/')) {
    const id = path.substring(13);
    return id || null;
  }
  return null;
}

export function getTVIdFromWatchPath(path: string): string | null {
  if (path.startsWith('/watch/tv/')) {
    const id = path.substring(10);
    return id || null;
  }
  return null;
}

