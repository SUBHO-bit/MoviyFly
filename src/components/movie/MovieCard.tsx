import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { MoviePoster } from './MoviePoster';
import { MovieMeta } from './MovieMeta';
import { Link, getDetailsPath } from '../../lib/router';

export interface MovieData {
  id: string;
  title: string;
  overview: string;
  genres: string[];
  rating: string | number;
  year: number | string;
  runtime: string;
  language: string;
  ageRating: string;
  poster: string; // 2:3 ratio artwork
  backdrop?: string;
  popularity?: number;
  voteCount?: number;
}

export interface MovieCardProps {
  movie: MovieData;
  isInWatchlist?: boolean;
  onPlay?: (movie: MovieData) => void;
  onMoreInfo?: (movie: MovieData) => void;
  onToggleWatchlist?: (movie: MovieData) => void;
  className?: string;
}

export const MovieCard = React.memo<MovieCardProps>(({
  movie,
  isInWatchlist = false,
  onPlay,
  onMoreInfo,
  onToggleWatchlist,
  className,
}) => {
  const linkPath = getDetailsPath(movie.id, movie.title);

  return (
    <Link
      to={linkPath}
      className={cn(
        'group bg-[#18181C] border border-white/[0.06] rounded-[24px] p-3.5 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/10 hover:shadow-xl cursor-pointer select-none h-[310px] sm:h-[360px] md:h-[390px]',
        className
      )}
      onClick={(e) => {
        // Prevent trigger if clicking action elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
          e.preventDefault();
          return;
        }
        onMoreInfo?.(movie);
      }}
    >
      {/* Visual Content: Poster overlay containing the IMDb badge, plus actions */}
      <MoviePoster
        title={movie.title}
        posterUrl={movie.poster}
        rating={movie.rating}
        isInWatchlist={isInWatchlist}
        onPlay={(e) => {
          e.stopPropagation();
          onPlay?.(movie);
        }}
        onWatchlistToggle={(e) => {
          e.stopPropagation();
          onToggleWatchlist?.(movie);
        }}
        onMoreInfo={(e) => {
          e.stopPropagation();
          onMoreInfo?.(movie);
        }}
      />

      {/* Narrative Info: Title, Rating details and genre sub-pills */}
      <MovieMeta
        title={movie.title}
        year={movie.year}
        runtime={movie.runtime}
        rating={movie.rating}
        genres={movie.genres}
      />
    </Link>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isInWatchlist === nextProps.isInWatchlist &&
    prevProps.className === nextProps.className
  );
});
