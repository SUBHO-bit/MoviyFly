import * as React from 'react';
import { slugify } from './sitemap';

export function navigate(path: string, options?: { replace?: boolean }) {
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  if (currentPath === path) {
    return;
  }
  if (options?.replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}

export function getDetailsPath(id: string | number, title: string): string {
  const cleanId = String(id);
  const isTv = cleanId.startsWith('tv-');
  const prefix = isTv ? '/tv/' : '/movie/';
  const titleSlug = slugify(title);
  return `${prefix}${cleanId}-${titleSlug}`;
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

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export const Link: React.FC<LinkProps> = ({ to, children, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle new tab/window keys
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    navigate(to);
    if (onClick) {
      onClick(e);
    }
  };

  return React.createElement(
    'a',
    {
      ...props,
      href: to,
      onClick: handleClick,
    },
    children
  );
};

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

