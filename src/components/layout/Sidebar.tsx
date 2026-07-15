import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Flame,
  Clapperboard,
  Tv,
  Theater,
  Heart,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { SidebarFooter } from './SidebarFooter';

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activeItem = 'home',
  onItemSelect,
}) => {
  const handleItemClick = (id: string) => {
    if (onItemSelect) {
      onItemSelect(id);
    }
    // Close mobile menu on select
    setMobileOpen(false);
  };

  const mainItems = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'search', label: 'Search', icon: <Search /> },
    { id: 'trending', label: 'Trending', icon: <Flame />, badge: 'Hot' },
    { id: 'movies', label: 'Movies', icon: <Clapperboard /> },
    { id: 'tvshows', label: 'TV Shows', icon: <Tv /> },
    { id: 'genres', label: 'Genres', icon: <Theater /> },
    { id: 'watchlist', label: 'Watchlist', icon: <Heart />, badge: 3 },
  ];

  const sidebarContent = (isMobile: boolean = false) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <div className="h-full flex flex-col justify-between bg-transparent">
        {/* Header Area */}
        <SidebarHeader
          collapsed={isCollapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Scrollable Navigation Area - Vertically Centered */}
        <div className="flex-grow overflow-y-auto py-6 custom-scroll-area flex flex-col justify-center px-1">
          <div className="flex flex-col gap-1.5">
            {mainItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.id}
                collapsed={isCollapsed}
                badge={item.badge}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer with User Card */}
        <SidebarFooter
          collapsed={isCollapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>
    );
  };

  return (
    <>
      {/* 2. Mobile Responsive Slide-out Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 md:hidden"
            />

            {/* Slide drawer container with matching glass theme */}
            <motion.aside
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
              className="fixed left-3 top-3 bottom-3 w-[272px] h-[calc(100vh-24px)] bg-[#0C0C12]/30 backdrop-blur-[28px] backdrop-saturate-[180%] border border-white/[0.08] rounded-[28px] z-[60] md:hidden shadow-2xl overflow-hidden flex flex-col"
              style={{
                WebkitBackdropFilter: 'blur(28px) saturate(180%)'
              }}
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
