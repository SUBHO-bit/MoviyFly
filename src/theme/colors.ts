/**
 * MoviyFly Global Color System (AMOLED Dark)
 */
export const colors = {
  background: '#09090B',
  surface: '#111116',
  card: '#17171F',
  elevatedCard: '#1D1D27',
  sidebar: '#13131A',
  primary: '#8B5CF6',
  primaryHover: '#9F67FF',
  secondary: '#27272F',
  border: 'rgba(255, 255, 255, 0.08)',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
  gradients: {
    hero: 'linear-gradient(180deg, rgba(9, 9, 11, 0) 0%, rgba(9, 9, 11, 0.8) 70%, #09090B 100%)',
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
    glow: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(9, 9, 11, 0) 70%)',
  }
} as const;
