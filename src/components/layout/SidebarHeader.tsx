import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { CollapseButton } from './CollapseButton';
import { Logo } from '../common/Logo';

export interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  className,
}) => {
  return (
    <div
      className={cn(
        'h-16 px-6 flex items-center justify-between shrink-0 select-none border-b border-white/[0.05]',
        className
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Simple flat logo icon with no glow */}
        <Logo variant="icon" color="purple" className="h-8 w-8 shrink-0" />

        {/* Brand name and version badge */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Logo variant="full" color="white" className="h-4 w-auto" />
            <span className="text-[9px] font-medium text-text-muted bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05]">
              v1.2
            </span>
          </motion.div>
        )}
      </div>

      {/* Collapse Trigger on desktop */}
      {!collapsed && (
        <CollapseButton
          collapsed={collapsed}
          onClick={onToggleCollapse}
          className="hidden md:flex shrink-0 ml-2"
        />
      )}
    </div>
  );
};
