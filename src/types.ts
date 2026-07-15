import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'elevated' | 'glass' | 'interactive' | 'movie' | 'landscape' | 'hero';

export type BadgeVariant = 'rating' | 'trending' | 'new' | 'featured' | 'genre' | 'status';

export interface IconProps {
  className?: string;
  size?: number | string;
}

export type SpacingValue = 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80 | 96;

export type BorderRadiusValue = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface BaseComponentProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}
