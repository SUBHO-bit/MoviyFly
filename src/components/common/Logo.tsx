import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface LogoProps {
  variant?: 'full' | 'icon' | 'monogram' | 'showcase';
  color?: 'purple' | 'white' | 'dynamic' | 'glass';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  height?: number | string;
  width?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  color = 'purple',
  className,
  size = 'md',
  height,
  width,
}) => {
  // Size mapper
  const sizeClasses = {
    sm: variant === 'full' ? 'h-6 w-auto' : 'h-6 w-6',
    md: variant === 'full' ? 'h-9 w-auto' : 'h-9 w-9',
    lg: variant === 'full' ? 'h-12 w-auto' : 'h-12 w-12',
    xl: variant === 'full' ? 'h-20 w-auto' : 'h-20 w-20',
    custom: '',
  };

  const currentSizeClass = sizeClasses[size];

  // Colors & Gradients Definitions
  const purpleGradientId = 'moviyfly-purple-gradient';
  const glassGradientId = 'moviyfly-glass-gradient';
  const glowFilterId = 'moviyfly-glow-filter';

  const renderDefinitions = () => (
    <defs>
      {/* Premium Purple Linear Gradient */}
      <linearGradient id={purpleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>

      {/* Luxury Cinematic Glass Gradient */}
      <linearGradient id={glassGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
        <stop offset="40%" stopColor="#F3E8FF" stopOpacity={0.95} />
        <stop offset="70%" stopColor="#E9D5FF" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#C084FC" stopOpacity={0.65} />
      </linearGradient>

      {/* Soft Ambient Cinematic Glow */}
      <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );

  const fillStyle = color === 'purple' 
    ? `url(#${purpleGradientId})` 
    : color === 'glass'
    ? `url(#${glassGradientId})`
    : '#FFFFFF';

  // Compact Iconic Version: Symmetrical Futuristic Geometric Butterfly
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(currentSizeClass, className)}
        style={{
          height: height || undefined,
          width: width || undefined,
          filter: color === 'purple' ? `url(#${glowFilterId})` : 'none',
        }}
      >
        {renderDefinitions()}
        
        {/* Ambient Back Glow (for Purple and Glass variants) */}
        {color !== 'white' && (
          <circle cx="50" cy="50" r="32" fill="#8B5CF6" fillOpacity="0.12" filter="blur(14px)" />
        )}

        {/* Beautiful Hand-Crafted Origami-Style Butterfly Wing Structure */}
        {/* Left Wings */}
        <path
          d="M48 50 L22 28 C20 26 16 28 17 32 L26 56 C28 60 34 62 38 60 L48 50 Z"
          fill={fillStyle}
          fillOpacity={color === 'glass' ? 0.35 : 1}
          stroke={color === 'glass' ? 'rgba(255,255,255,0.4)' : 'none'}
          strokeWidth={color === 'glass' ? 1.5 : 0}
        />
        <path
          d="M47 53 L30 68 C28 70 29 74 33 73 L44 67 C46 66 47 64 47 62 L47 53 Z"
          fill={fillStyle}
          fillOpacity={color === 'glass' ? 0.2 : 0.7}
          stroke={color === 'glass' ? 'rgba(255,255,255,0.3)' : 'none'}
          strokeWidth={color === 'glass' ? 1 : 0}
        />

        {/* Right Wings */}
        <path
          d="M52 50 L78 28 C80 26 84 28 83 32 L74 56 C72 60 66 62 62 60 L52 50 Z"
          fill={fillStyle}
          fillOpacity={color === 'glass' ? 0.35 : 1}
          stroke={color === 'glass' ? 'rgba(255,255,255,0.4)' : 'none'}
          strokeWidth={color === 'glass' ? 1.5 : 0}
        />
        <path
          d="M53 53 L70 68 C72 70 71 74 67 73 L56 67 C54 66 53 64 53 62 L53 53 Z"
          fill={fillStyle}
          fillOpacity={color === 'glass' ? 0.2 : 0.7}
          stroke={color === 'glass' ? 'rgba(255,255,255,0.3)' : 'none'}
          strokeWidth={color === 'glass' ? 1 : 0}
        />

        {/* Central Core/Body */}
        <rect
          x="48"
          y="28"
          width="4"
          height="44"
          rx="2"
          fill={color === 'purple' ? '#FFFFFF' : fillStyle}
          className={cn(color === 'purple' && 'shadow-lg')}
        />
        <circle cx="50" cy="24" r="2.5" fill={color === 'purple' ? '#FFFFFF' : fillStyle} />

        {/* Minimalist Antennae */}
        <path
          d="M49 22 Q44 14 38 16"
          stroke={color === 'purple' ? '#C084FC' : fillStyle}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M51 22 Q56 14 62 16"
          stroke={color === 'purple' ? '#C084FC' : fillStyle}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Monogram Variant: Intersecting Futuristic "M" and "F" letters that form a butterfly silhouette
  if (variant === 'monogram') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(currentSizeClass, className)}
        style={{
          height: height || undefined,
          width: width || undefined,
          filter: color === 'purple' ? `url(#${glowFilterId})` : 'none',
        }}
      >
        {renderDefinitions()}

        {/* Left Side: Geometric M block */}
        <path
          d="M18 72 V28 C18 25.5 20 24 22.5 25.5 L46 44 V46 L24 64 C22 65.5 18 74 18 72 Z"
          fill={fillStyle}
        />
        <path
          d="M48 45 L28 29 C26.5 28 24.5 29.5 24.5 31.5 V52 L44 68 C46.5 70 48 68.5 48 66 V45 Z"
          fill={fillStyle}
          fillOpacity={0.8}
        />

        {/* Right Side: Geometric F letters forming right wings */}
        <path
          d="M52 45 V68 C52 70.5 54 72 56.5 70.5 L78 52 V31.5 C78 29.5 76 28 74.5 29 L52 45 Z"
          fill={fillStyle}
        />
        
        {/* Horizontal wing slices of F */}
        <path
          d="M56 38 H82 C84 38 84 34 82 34 H56 C54 34 54 38 56 38 Z"
          fill={color === 'purple' ? '#FFFFFF' : fillStyle}
        />
        <path
          d="M56 48 H76 C78 48 78 44 76 44 H56 C54 44 54 48 56 48 Z"
          fill={color === 'purple' ? '#FFFFFF' : fillStyle}
        />

        {/* Central divider stream */}
        <line x1="50" y1="22" x2="50" y2="78" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" opacity="0.3" />
      </svg>
    );
  }

  // Showcase Variant: An amazing complete visual guide of the brand identity, logo variants, color specs, and PNG transparent mockups
  if (variant === 'showcase') {
    return (
      <div className={cn("w-full bg-[#13131A] border border-white/[0.06] rounded-[24px] p-8 space-y-12 shadow-2xl relative overflow-hidden", className)}>
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-primary font-bold tracking-widest uppercase mb-1.5 block">Official Brand Identity</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">MoviyFly Design System</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-xl">
            <span>SPEC: v2.5.0</span>
            <span className="text-white/20">|</span>
            <span>TYPE: VECTOR STYLE</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Full Logo Variations */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest border-l-2 border-primary pl-3">1. Wordmark Typography</h3>
            
            {/* Full Purple Gradient Logo */}
            <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative group hover:border-primary/20 transition-colors">
              <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">Primary (AMOLED Purple Gradient)</span>
              <Logo variant="full" color="purple" size="lg" />
              <div className="mt-4 text-[11px] font-mono text-primary/80 font-medium">Gradient: #8B5CF6 → #A855F7</div>
            </div>

            {/* Full White Monochrome Logo */}
            <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative group hover:border-white/10 transition-colors">
              <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">Monochrome (Cinema White)</span>
              <Logo variant="full" color="white" size="lg" />
              <div className="mt-4 text-[11px] font-mono text-white/50 font-medium">Solid: #FFFFFF (100% Contrast)</div>
            </div>

            {/* Glassmorphic Glowing Logo */}
            <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative group hover:border-purple-500/20 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/5 to-transparent pointer-events-none" />
              <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">Luxury Glassmorphic Glow</span>
              <Logo variant="full" color="glass" size="lg" />
              <div className="mt-4 text-[11px] font-mono text-purple-300/60 font-medium">Glassmorphism: High Reflection</div>
            </div>
          </div>

          {/* Section 2: Icon & Monogram Variations */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest border-l-2 border-primary pl-3">2. Monograms & Icons</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Purple Icon */}
              <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative">
                <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">Butterfly Icon (Purple)</span>
                <Logo variant="icon" color="purple" size="lg" />
              </div>

              {/* White Icon */}
              <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative">
                <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">Butterfly Icon (White)</span>
                <Logo variant="icon" color="white" size="lg" />
              </div>

              {/* Purple Monogram */}
              <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative">
                <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">MF Monogram (Purple)</span>
                <Logo variant="monogram" color="purple" size="lg" />
              </div>

              {/* Glass Monogram */}
              <div className="bg-[#0B0B10] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-sm pointer-events-none" />
                <span className="absolute top-3 left-3 text-[10px] font-mono text-text-muted">MF Monogram (Glass)</span>
                <Logo variant="monogram" color="glass" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Specs Table */}
        <div className="border-t border-white/[0.08] pt-8 space-y-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">3. Specifications & Architecture</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-text-muted font-mono block mb-1">BRAND FONTS</span>
              <span className="text-xs font-semibold text-white">Space Grotesk / Inter</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-text-muted font-mono block mb-1">KERNING STYLE</span>
              <span className="text-xs font-semibold text-white">Tight, -0.05em</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-text-muted font-mono block mb-1">GRADIENT VECTOR</span>
              <span className="text-xs font-semibold text-white">Linear, angle 135deg</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-text-muted font-mono block mb-1">ACCESSIBILITY STATUS</span>
              <span className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                AAA Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Wordmark Version: MOVIYFLY with hand-crafted customized geometric typography
  return (
    <svg
      viewBox="0 0 230 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(currentSizeClass, className)}
      style={{
        height: height || undefined,
        width: width || undefined,
        filter: 'none', // Text itself remains completely clean with no glow
      }}
    >
      {renderDefinitions()}

      {/* Hand-Crafted Letters with custom geometry & ultra-tight kerning */}
      <g fill={fillStyle} className="transition-all duration-300">
        
        {/* Letter 'M' (x: 0) */}
        <path d="M0 45 V5 H7 L14.5 24 L22 5 H29 V45 H23.5 V15 L16 35 H13 L5.5 15 V45 H0 Z" />

        {/* Letter 'O' (x: 35) */}
        <path d="M51 45.8 C39 45.8 32.5 37.5 32.5 25 C32.5 12.5 39 4.2 51 4.2 C63 4.2 69.5 12.5 69.5 25 C69.5 37.5 63 45.8 51 45.8 Z M51 10.2 C43 10.2 38.5 15.5 38.5 25 C38.5 34.5 43 39.8 51 39.8 C59 39.8 63.5 34.5 63.5 25 C63.5 15.5 59 10.2 51 10.2 Z" />

        {/* Letter 'V' (x: 75) */}
        <path d="M72.5 5 H79 L88.5 32 L98 5 H104.5 L91.5 45 H85.5 L72.5 5 Z" />

        {/* Letter 'I' (x: 110) */}
        <path d="M109.5 5 H115.5 V45 H109.5 V5 Z" />

        {/* Letter 'Y' (x: 122) */}
        <path d="M120 5 H126.5 L133 24 L139.5 5 H146 L136 29 V45 H130 V29 L120 5 Z" />

        {/* Letter 'F' (x: 153) */}
        <path d="M152 5 H174 V10.5 H158 V22 H171 V27.5 H158 V45 H152 V5 Z" />

        {/* Letter 'L' (x: 181) */}
        <path d="M179.5 5 H185.5 V39.5 H199.5 V45 H179.5 V5 Z" />

        {/* Letter 'Y' (x: 204) - Cleaned of butterfly wings, completely standard geometric form */}
        <path d="M204 5 H210.5 L217 24 L223.5 5 H230 L220 29 V45 H214 V29 L204 5 Z" />
      </g>
    </svg>
  );
};
