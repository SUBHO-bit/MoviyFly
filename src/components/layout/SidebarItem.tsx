import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  collapsed = false,
  badge,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Clone Lucide icon to force thin stroke (1.5) and 20px (h-5 w-5) sizing
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn(
          'h-5 w-5 transition-all duration-250 shrink-0',
          active 
            ? 'text-white drop-shadow-[0_0_8px_rgba(140,92,255,0.6)]' 
            : 'text-text-muted group-hover:text-white group-hover:scale-105'
        ),
        strokeWidth: 1.5,
      })
    : icon;

  return (
    <div
      className="relative px-3 py-0.5 w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center h-11 px-3.5 rounded-[18px] text-sm font-medium transition-all duration-250 relative cursor-pointer outline-none group border',
          active
            ? 'text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)]'
            : 'text-text-secondary border-transparent hover:text-white hover:bg-white/[0.04]'
        )}
        style={{
          backgroundColor: active ? 'rgba(139,92,246,0.18)' : undefined,
          border: active ? '1px solid rgba(255,255,255,0.08)' : undefined,
          backdropFilter: active ? 'blur(18px)' : undefined,
          WebkitBackdropFilter: active ? 'blur(18px)' : undefined,
        }}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
      >
        {/* Left Indicator: Sleek indicator with smooth transition */}
        {active && (
          <motion.div
            layoutId="activeLeftIndicator"
            className="absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-r bg-[#8C5CFF]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        {/* Inner Content Wrapper with subtle 2px translate-x on hover for inactive items */}
        <motion.div
          animate={{ x: isHovered && !active ? 2 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center gap-3.5 w-full h-full"
        >
          {/* Monochrome Icon */}
          <span className="flex items-center justify-center shrink-0">
            {renderedIcon}
          </span>

          {/* Label (hidden when collapsed) */}
          {!collapsed && (
            <span className="truncate flex-grow text-left text-sm font-medium">
              {label}
            </span>
          )}

          {/* Badge (hidden when collapsed) */}
          {!collapsed && badge !== undefined && (
            <span
              className={cn(
                'shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider',
                active ? 'bg-[#7C3AED]/20 text-white' : 'bg-white/[0.04] text-text-muted'
              )}
            >
              {badge}
            </span>
          )}
        </motion.div>
      </button>

      {/* Collapsed Tooltip Fade */}
      <AnimatePresence>
        {collapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-[78px] top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-[#18181C] border border-white/[0.06] text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span>{label}</span>
              {badge !== undefined && (
                <span className="text-[9px] bg-[#7C3AED]/20 text-[#7C3AED] px-1 py-0.2 rounded font-bold uppercase">
                  {badge}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
