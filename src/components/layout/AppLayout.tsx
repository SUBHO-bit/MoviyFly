import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainContent } from './MainContent';
const LandingPage = React.lazy(() => import('../landing/LandingPage').then(m => ({ default: m.LandingPage })));
import { usePath, navigate } from '../../lib/router';
import { updateClientSEO, generateWebSiteJsonLd } from '../../lib/seo';
import { generateWebSiteSchema, generateSearchActionSchema, injectSchema, clearSchema } from '../../lib/schema';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  
  const path = usePath();

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

  // Schema.org structured data injection for Homepage
  React.useEffect(() => {
    if (path === '/home') {
      const websiteSchema = generateWebSiteSchema();
      const searchActionSchema = generateSearchActionSchema();

      injectSchema(websiteSchema, 'moviyfly-website-schema');
      injectSchema(searchActionSchema, 'moviyfly-searchaction-schema');
    } else {
      clearSchema('moviyfly-website-schema');
      clearSchema('moviyfly-searchaction-schema');
    }

    return () => {
      clearSchema('moviyfly-website-schema');
      clearSchema('moviyfly-searchaction-schema');
    };
  }, [path]);

  // Synchronize general pages SEO metadata on route change
  React.useEffect(() => {
    if (path === '/') {
      // Landing page handles its own SEO metadata
      return;
    }

    if (activeItem === 'movie-details' || activeItem === 'tv-details' || activeItem === 'watch-movie' || activeItem === 'watch-tv') {
      // These details pages will manage their own highly detailed SEO metadata when details are loaded
      return;
    }

    let seoTitle = 'MoviyFly - Stream Movies, TV Shows, Anime & K-Dramas';
    let seoDesc = 'Discover trending movies, TV shows, anime and K-dramas on MoviyFly. Browse thousands of titles, explore new releases, and enjoy a modern entertainment discovery platform.';
    let currentUrl = 'https://moviyfly.vercel.app/';

    if (activeItem === 'home' || path === '/home') {
      seoTitle = 'Explore Movies, TV Shows & Anime Library | MoviyFly';
      seoDesc = 'Browse popular movies, trending TV shows, anime and K-dramas. Discover thousands of titles on MoviyFly.';
      currentUrl = 'https://moviyfly.vercel.app/home';
    } else if (activeItem === 'movies') {
      seoTitle = 'All Movies - MoviyFly Cinema';
      seoDesc = 'Explore our extensive collection of Hollywood, Bollywood, South Indian, and world cinema hits on MoviyFly.';
      currentUrl = 'https://moviyfly.vercel.app/movies';
    } else if (activeItem === 'tvshows') {
      seoTitle = 'TV Shows & Series - MoviyFly OTT';
      seoDesc = 'Binge watch premium TV shows, anime series, and Korean dramas in high quality on MoviyFly.';
      currentUrl = 'https://moviyfly.vercel.app/tvshows';
    } else if (activeItem === 'watchlist') {
      seoTitle = 'My Cinema Watchlist - MoviyFly';
      seoDesc = 'Access your personal curated watchlist of movies and TV shows you want to watch on MoviyFly.';
      currentUrl = 'https://moviyfly.vercel.app/watchlist';
    } else if (activeItem === 'search') {
      seoTitle = 'Search Movies & TV Shows - MoviyFly';
      seoDesc = 'Search the complete MoviyFly catalog for movies, TV series, actors, and directors.';
      currentUrl = 'https://moviyfly.vercel.app/search';
    } else if (activeItem === 'category') {
      const categorySlug = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
      const categoryName = categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Genres';
      seoTitle = `${categoryName} Movies - MoviyFly`;
      seoDesc = `Explore the best of ${categoryName} movies and TV series curated specially for you on MoviyFly.`;
      currentUrl = `https://moviyfly.vercel.app${path}`;
    }

    const websiteJsonLd = generateWebSiteJsonLd({
      name: "MoviyFly",
      alternateName: "MoviyFly Movies",
      url: "https://moviyfly.vercel.app/",
      description: seoDesc,
      inLanguage: "en"
    });

    updateClientSEO({
      title: seoTitle,
      description: seoDesc,
      type: 'website',
      url: currentUrl,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
      jsonLd: websiteJsonLd
    });
  }, [activeItem, path]);

  if (path === '/') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#0B0B10]" />}>
        <LandingPage />
      </React.Suspense>
    );
  }

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
          navigate(id === 'home' ? '/home' : `/${id}`);
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
    </div>
  );
};
