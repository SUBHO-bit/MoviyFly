import * as React from 'react';
import { motion } from 'motion/react';
import { Star, Play, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CardVariant } from '../../types';
import { cardReveal, hoverLift } from '../../lib/animations';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: CardVariant;
  isAnimated?: boolean;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  rating?: number;
  tags?: string[];
  duration?: string;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      isAnimated = true,
      imageUrl,
      title,
      subtitle,
      rating,
      tags,
      duration,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    // Styling base dictionary
    const baseCardClass = 'rounded-md overflow-hidden relative border border-white/5 transition-colors duration-300';
    
    const cardVariants: Record<CardVariant, string> = {
      default: 'bg-card text-text-primary',
      elevated: 'bg-card-elevated text-text-primary shadow-large',
      glass: 'glass-panel text-text-primary',
      interactive: 'bg-card text-text-primary cursor-pointer hover:bg-card-elevated hover:border-primary/30 hover:shadow-card-glow',
      movie: 'aspect-[2/3] bg-card text-text-primary cursor-pointer border border-white/5 group relative overflow-hidden',
      landscape: 'aspect-[16/9] bg-card text-text-primary cursor-pointer border border-white/5 group relative overflow-hidden',
      hero: 'w-full min-h-[380px] md:min-h-[480px] bg-card text-text-primary relative overflow-hidden rounded-lg border border-white/8'
    };

    const containerVariants = isAnimated ? cardReveal : undefined;

    // Standard card renderer with content
    const renderContent = () => {
      if (variant === 'movie') {
        return (
          <>
            {/* Background Image with optimized scale */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Movie poster'}
                className="w-full h-full object-cover transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface to-secondary flex items-center justify-center text-text-muted text-caption">
                No Image
              </div>
            )}

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {rating !== undefined && (
                <div className="absolute top-3 right-3 glass-panel px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning fill-warning" />
                  <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-small font-bold text-white line-clamp-1">{title}</h4>
                {subtitle && <p className="text-[11px] text-text-secondary mt-0.5">{subtitle}</p>}
                
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[9px] bg-white/10 text-text-secondary px-1.5 py-0.5 rounded-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button className="flex-1 h-8 bg-primary hover:bg-primary-hover text-white rounded-sm text-[11px] font-bold flex items-center justify-center gap-1 shadow-purple-glow">
                    <Play className="h-3 w-3 fill-white" /> Play
                  </button>
                  <button className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-sm flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      }

      if (variant === 'landscape') {
        return (
          <>
            {/* Landscape Poster with scale */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Episode landscape'}
                className="w-full h-full object-cover transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface to-secondary flex items-center justify-center text-text-muted text-caption">
                No Image
              </div>
            )}

            {/* Floating duration badge */}
            {duration && (
              <div className="absolute bottom-3 right-3 glass-panel px-2 py-0.5 rounded-sm">
                <span className="text-[10px] font-semibold text-white">{duration}</span>
              </div>
            )}

            {/* Hover visual overlay with centering Play icon */}
            <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/90 text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-purple-glow">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-3 pt-6 pointer-events-none">
              <h4 className="text-small font-semibold text-white line-clamp-1">{title}</h4>
              {subtitle && <p className="text-[11px] text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
          </>
        );
      }

      if (variant === 'hero') {
        return (
          <>
            {/* Background image & overlay */}
            {imageUrl && (
              <div className="absolute inset-0">
                <img
                  src={imageUrl}
                  alt={title || 'Featured movie banner'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
              </div>
            )}

            {/* Left aligned content overlay */}
            <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 flex flex-col justify-center p-6 md:p-12 z-10">
              {tags && tags.length > 0 && (
                <div className="flex gap-2 mb-3 animate-fade-in">
                  {tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-primary/20 border border-primary/30 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-h1 md:text-display font-extrabold text-white tracking-tight leading-none mb-4">
                {title}
              </h1>
              
              {subtitle && (
                <p className="text-small md:text-body text-text-secondary line-clamp-3 mb-6 max-w-lg leading-relaxed">
                  {subtitle}
                </p>
              )}

              {children && <div className="mt-2">{children}</div>}
            </div>
          </>
        );
      }

      return children;
    };

    const isInteractive = variant === 'interactive' || variant === 'movie' || variant === 'landscape';

    return (
      <motion.div
        ref={ref as any}
        variants={containerVariants}
        initial={isAnimated ? 'hidden' : undefined}
        animate={isAnimated ? 'visible' : undefined}
        whileHover={isInteractive ? { y: -4, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
        className={cn(
          baseCardClass,
          cardVariants[variant],
          className
        )}
        onClick={onClick}
        {...(props as any)}
      >
        {renderContent()}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
