import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { usePath, navigate } from '../../lib/router';
import { CinematicSplash } from '../common/CinematicSplash';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [showIntro, setShowIntro] = React.useState(false);
  
  const path = usePath();

  // Check if intro has been seen in this session
  React.useEffect(() => {
    const introSeen = sessionStorage.getItem('moviyfly_intro_seen');
    if (!introSeen) {
      setShowIntro(true);
    }
  }, []);

  // Sync search input value with URL search query parameter on back/forward or direct load
  React.useEffect(() => {
    if (path.startsWith('/search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      setSearchValue(q);
    } else {
      setSearchValue('');
    }
  }, [path]);

  const activeItem = React.useMemo(() => {
    if (path.startsWith('/movie/')) {
      return 'movie-details';
    }
    if (path.startsWith('/tv/')) {
      return 'tv-details';
    }
    if (path.startsWith('/watch/movie/')) {
      return 'watch-movie';
    }
    if (path.startsWith('/watch/tv/')) {
      return 'watch-tv';
    }
    if (path.startsWith('/movies/')) {
      return 'category';
    }
    const cleanPath = path.replace('/', '') || 'home';
    return cleanPath;
  }, [path]);

  const [isScrolled, setIsScrolled] = React.useState(false);

  // Monitor scrolling inside custom-scroll-area using event capturing
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.scrollTop === 'number') {
        setIsScrolled(target.scrollTop > 15);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // Reset scrolled state on route changes
  React.useEffect(() => {
    setIsScrolled(false);
  }, [path]);

  return (
    <div className="flex h-screen w-screen bg-background text-text-primary overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-[#A855F7]/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        onItemSelect={(id) => {
          navigate(id === 'home' ? '/' : `/${id}`);
          setSearchValue(''); // reset search on tab change
        }}
      />

      {/* Main app body */}
      <div className="flex-grow flex flex-col h-full min-w-0 z-10 relative">
        <Header
          pageTitle={activeItem}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          isScrolled={isScrolled}
          collapsed={collapsed}
        />

        {/* Content body with dynamic name */}
        <MainContent pageTitle={activeItem} collapsed={collapsed} />
      </div>

      {/* Premium Cinematic Splash Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="moviyfly-cinematic-intro"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.08,
              filter: 'blur(15px)'
            }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[9999]"
          >
            <CinematicSplash onComplete={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
