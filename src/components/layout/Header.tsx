import * as React from 'react';
import { Menu, Play, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Breadcrumb } from './Breadcrumb';
import { SearchBar } from './SearchBar';
import { NotificationButton } from './NotificationButton';
import { ProfileMenu } from './ProfileMenu';
import { navigate } from '../../lib/router';
import { Logo } from '../common/Logo';

export interface HeaderProps {
  pageTitle: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMobileMenuToggle: () => void;
  isScrolled?: boolean;
  collapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  searchValue,
  onSearchChange,
  onMobileMenuToggle,
  isScrolled = false,
  collapsed = false,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const isHome = pageTitle === 'home' || pageTitle === 'movies' || pageTitle === 'tvshows' || pageTitle === 'movie-details' || pageTitle === 'tv-details';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const getHighlightedTab = (title: string) => {
    if (title === 'home') return 'home';
    if (title === 'movies' || title === 'movie-details' || title === 'watch-movie') return 'movies';
    if (title === 'tvshows' || title === 'tv-details' || title === 'watch-tv') return 'tvshows';
    if (title === 'watchlist') return 'watchlist';
    return '';
  };

  return (
    <header
      className={cn(
        "h-[72px] absolute top-0 left-0 right-0 z-40 select-none shrink-0 transition-all duration-300 ease-in-out px-4 md:px-8 flex flex-col justify-center"
      )}
      style={
        isHome && !isScrolled
          ? {
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderBottom: 'none',
              boxShadow: 'none',
            }
          : {
              background: 'rgba(8, 8, 12, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
            }
      }
    >
      <div className="h-full flex items-center justify-between gap-5">
        
        {/* Left Area: Logo and Top Navigation Menu */}
        <div className="flex items-center gap-8 shrink-0">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-white/20"
            aria-label="Toggle mobile menu drawer"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Desktop Logo & Brand */}
          <div 
            onClick={() => navigate('/home')}
            className="hidden md:flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <Logo variant="icon" color="purple" className="h-9 w-9 transition-transform duration-350 group-hover:scale-105" />
            <Logo variant="full" color="white" className="h-5 w-auto" />
          </div>

          {/* Desktop Top Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 select-none shrink-0">
            {[
              { id: 'home', label: 'Home', path: '/home' },
              { id: 'movies', label: 'Movies', path: '/movies' },
              { id: 'tvshows', label: 'TV Shows', path: '/tvshows' },
              { id: 'watchlist', label: 'Watchlist', path: '/watchlist' },
            ].map((item) => {
              const highlighted = getHighlightedTab(pageTitle);
              const isActive = highlighted === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative text-[13px] font-semibold tracking-wide transition-colors duration-300 py-2 px-1 cursor-pointer outline-none focus:text-white",
                    isActive ? "text-[#8B5CF6]" : "text-[#B3B3B8] hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="topNavActiveIndicator"
                      className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full shadow-[0_0_8px_#8B5CF6]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Centered Branding Logo */}
          <div className="flex md:hidden items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <Logo variant="icon" color="purple" className="h-7 w-7" />
            <Logo variant="full" color="white" className="h-4 w-auto" />
          </div>
        </div>

        {/* Right Area: Actions or Mobile Search Button */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0 ml-auto">
          {/* Mobile Search Trigger Icon button */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden h-10 w-10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.04] rounded-[10px] transition-colors cursor-pointer outline-none"
            aria-label="Open search drawer"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Desktop/Tablet Action Area */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* 1. Notification Button */}
            <NotificationButton />

            {/* 2. Collapsible Search with glassmorphism style */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <AnimatePresence initial={false} mode="wait">
                {!isSearchExpanded ? (
                  <motion.button
                    key="search-trigger"
                    onClick={() => setIsSearchExpanded(true)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.22 }}
                    className="h-11 w-11 flex items-center justify-center text-[#B3B3B8] hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/[0.09] rounded-full transition-all cursor-pointer outline-none shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    aria-label="Open search bar"
                  >
                    <Search className="h-5 w-5" strokeWidth={1.5} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-expanded"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 520, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-visible flex items-center max-w-[calc(100vw-350px)]"
                  >
                    <SearchBar
                      value={searchValue}
                      onChange={onSearchChange}
                      variant="glass"
                      autoFocus={true}
                      onClear={() => onSearchChange('')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Profile Dropdown Menu */}
            <ProfileMenu />
          </div>
        </div>
      </div>

      {/* Full-screen Responsive Search Overlay for Mobile Viewports */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0B0B0F] z-50 p-4 flex flex-col md:hidden"
          >
            {/* Header of mobile search overlay */}
            <div className="flex items-center justify-between h-14 border-b border-white/[0.06] mb-4">
              <span className="text-sm font-semibold text-white">Search Movies</span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                aria-label="Close search overlay"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Input bar inside overlay */}
            <div className="w-full">
              <SearchBar
                value={searchValue}
                onChange={(val) => {
                  onSearchChange(val);
                }}
                onClear={() => onSearchChange('')}
              />
            </div>

            <div className="flex-grow mt-6 flex flex-col items-center justify-center text-center p-6 text-text-muted">
              <Search className="h-8 w-8 text-white/10 mb-3" strokeWidth={1.5} />
              <p className="text-xs font-medium text-text-secondary">Type to search across MoviyFly</p>
              <p className="text-[10px] text-text-muted max-w-[200px] mt-1 leading-normal">
                Search results will automatically render in the central main dashboard view.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
