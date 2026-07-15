/**
 * MoviyFly Design System Constants
 */

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const SHADOWS = {
  soft: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
  large: '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
  purpleGlow: '0 0 20px 2px rgba(139, 92, 246, 0.25)',
  cardGlow: '0 0 15px rgba(139, 92, 246, 0.1)',
  heroGlow: '0 -20px 50px -10px rgba(139, 92, 246, 0.15) inset',
} as const;

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1440px',
} as const;
