import { handleMockRequest } from '../../api/server-mock-data.js';
import { slugify } from '../lib/sitemap.js';

export interface MediaDetails {
  id: string | number;
  type: 'movie' | 'tv';
  title: string;
  originalTitle?: string;
  overview: string;
  releaseDate?: string;
  firstAirDate?: string;
  year?: string;
  runtime?: number;
  formattedRuntime?: string;
  seasonsCount?: number;
  episodesCount?: number;
  genres: string[];
  rating: number;
  ratingFormatted: string;
  voteCount: number;
  posterUrl: string;
  backdropUrl: string;
  originalLanguage?: string;
  adult?: boolean;
  cast: Array<{ name: string; character: string; profileUrl?: string }>;
  director?: string;
  similar: Array<{ id: string | number; title: string; posterUrl: string; rating: string; year: string; type: 'movie' | 'tv' }>;
}

export interface RenderedPageResult {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  jsonLd: object[];
  bodyHtml: string;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function formatImageUrl(path: string | undefined | null, size: 'w500' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path.startsWith('/') ? '' : '/'}${path}`;
}

function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMinutesToRuntime(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return '2h 15m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function minutesToIsoDuration(minutes: number | undefined): string | undefined {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours > 0 ? `${hours}H` : ''}${mins}M`;
}

function getYear(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return dateStr.split('-')[0] || '';
}

/**
 * Server-side media details fetcher.
 * Uses live TMDB if access token is configured, otherwise high-fidelity mock data.
 */
export async function fetchServerMediaDetails(
  type: 'movie' | 'tv',
  rawId: string,
  token?: string
): Promise<MediaDetails | null> {
  const numericId = parseInt(rawId, 10);
  if (isNaN(numericId)) return null;

  const isMock = numericId >= 1000 && numericId <= 9000;
  let rawData: any = null;
  let creditsData: any = null;
  let similarData: any = null;

  // 1. Try live TMDB if token is available and not a mock ID
  if (token && !isMock) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const [resDetails, resCredits, resSimilar] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/${type}/${numericId}`, {
          headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/json' },
          signal: controller.signal
        }),
        fetch(`https://api.themoviedb.org/3/${type}/${numericId}/credits`, {
          headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/json' },
          signal: controller.signal
        }).catch(() => null),
        fetch(`https://api.themoviedb.org/3/${type}/${numericId}/similar`, {
          headers: { Authorization: `Bearer ${token.trim()}`, Accept: 'application/json' },
          signal: controller.signal
        }).catch(() => null)
      ]);

      clearTimeout(timeout);

      if (resDetails.ok) {
        rawData = await resDetails.json();
      }
      if (resCredits && resCredits.ok) {
        creditsData = await resCredits.json();
      }
      if (resSimilar && resSimilar.ok) {
        similarData = await resSimilar.json();
      }
    } catch (e) {
      console.warn(`[SEO Renderer] Live TMDB fetch for ${type}/${numericId} failed. Falling back to mock engine.`);
    }
  }

  // 2. Fallback to mock data engine if live fetch didn't return data
  if (!rawData) {
    try {
      rawData = handleMockRequest(`${type}/${numericId}`, {});
      creditsData = handleMockRequest(`${type}/${numericId}/credits`, {});
      similarData = handleMockRequest(`${type}/${numericId}/similar`, {});
    } catch (e) {
      console.error(`[SEO Renderer] Mock data fetch failed for ${type}/${numericId}:`, e);
    }
  }

  if (!rawData) return null;

  const title = rawData.title || rawData.name || (type === 'movie' ? 'Cinematic Movie' : 'Cinematic TV Show');
  const releaseDate = rawData.release_date || rawData.first_air_date || '';
  const year = getYear(releaseDate);
  const runtime = rawData.runtime || (rawData.episode_run_time && rawData.episode_run_time[0]) || 120;
  const genres = Array.isArray(rawData.genres)
    ? rawData.genres.map((g: any) => g.name || g).filter(Boolean)
    : [];

  const voteAverage = Number(rawData.vote_average || 0);
  const ratingFormatted = voteAverage > 0 ? voteAverage.toFixed(1) : '0.0';
  const voteCount = Number(rawData.vote_count || 0);

  const posterUrl = formatImageUrl(rawData.poster_path, 'w500');
  const backdropUrl = formatImageUrl(rawData.backdrop_path, 'w1280') || posterUrl;

  // Cast extraction
  const castList: Array<{ name: string; character: string; profileUrl?: string }> = [];
  if (creditsData && Array.isArray(creditsData.cast)) {
    creditsData.cast.slice(0, 10).forEach((c: any) => {
      if (c.name) {
        castList.push({
          name: c.name,
          character: c.character || 'Cast Member',
          profileUrl: c.profile_path ? formatImageUrl(c.profile_path, 'w500') : undefined
        });
      }
    });
  }

  // Director extraction
  let director: string | undefined;
  if (creditsData && Array.isArray(creditsData.crew)) {
    const dir = creditsData.crew.find((member: any) => member.job === 'Director');
    if (dir) director = dir.name;
  }

  // Similar titles extraction
  const similarTitles: Array<{ id: string | number; title: string; posterUrl: string; rating: string; year: string; type: 'movie' | 'tv' }> = [];
  if (similarData && Array.isArray(similarData.results)) {
    similarData.results.slice(0, 8).forEach((item: any) => {
      const sTitle = item.title || item.name;
      if (sTitle && item.poster_path) {
        similarTitles.push({
          id: item.id,
          title: sTitle,
          posterUrl: formatImageUrl(item.poster_path, 'w500'),
          rating: item.vote_average ? Number(item.vote_average).toFixed(1) : '8.0',
          year: getYear(item.release_date || item.first_air_date),
          type
        });
      }
    });
  }

  return {
    id: numericId,
    type,
    title,
    originalTitle: rawData.original_title || rawData.original_name,
    overview: rawData.overview || 'Stream and discover on MoviyFly.',
    releaseDate,
    firstAirDate: rawData.first_air_date,
    year,
    runtime,
    formattedRuntime: formatMinutesToRuntime(runtime),
    seasonsCount: rawData.number_of_seasons,
    episodesCount: rawData.number_of_episodes,
    genres,
    rating: voteAverage,
    ratingFormatted,
    voteCount,
    posterUrl,
    backdropUrl,
    originalLanguage: rawData.original_language?.toUpperCase() || 'EN',
    adult: rawData.adult || false,
    cast: castList,
    director,
    similar: similarTitles
  };
}

/**
 * Pre-render Home Page HTML & SEO
 */
export function renderHomePage(baseUrl: string): RenderedPageResult {
  const title = 'MoviyFly - Stream Movies, TV Shows, Anime & K-Dramas';
  const description = 'Discover trending movies, TV shows, anime and K-dramas on MoviyFly. Browse thousands of titles, explore new releases, and enjoy a modern entertainment discovery platform.';
  const canonicalUrl = `${baseUrl}/`;
  const ogImage = 'https://moviyfly.vercel.app/og-preview.png';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'MoviyFly',
      'url': canonicalUrl,
      'description': description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  // Fetch featured trending items from mock engine for immediate SSR
  const trendingRes = handleMockRequest('trending/movie/week', {});
  const movies = (trendingRes && trendingRes.results) ? trendingRes.results.slice(0, 12) : [];

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <!-- Header Navigation -->
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white hover:opacity-90">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">M</span>
          <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
        </a>
        <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="/home" class="text-white hover:text-purple-400 transition-colors">Home</a>
          <a href="/movies" class="hover:text-white transition-colors">Movies</a>
          <a href="/tv-shows" class="hover:text-white transition-colors">TV Shows</a>
          <a href="/watchlist" class="hover:text-white transition-colors">Watchlist</a>
          <a href="/search" class="hover:text-white transition-colors">Search</a>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <a href="/search" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors border border-white/10 flex items-center gap-2">
          <span>Search movies, shows...</span>
        </a>
      </div>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- Hero Showcase -->
      <section class="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-purple-900/40 via-[#13131A] to-[#0B0B10] border border-white/10 p-8 md:p-12 min-h-[380px] flex flex-col justify-center">
        <div class="max-w-2xl z-10">
          <span class="inline-block px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#A855F7] text-xs font-bold uppercase tracking-wider mb-4 border border-[#8B5CF6]/30">Featured Premiere</span>
          <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Stream High-Octane Cinema &amp; Premium Series</h1>
          <p class="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
            Unlimited exploration across Hollywood hits, Bollywood blockbusters, South Indian action, trending anime, and Korean dramas. All rendered with ultra-crisp presentation.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="/movies" class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white font-bold shadow-lg shadow-purple-900/40 transition-all transform hover:-translate-y-0.5">Explore Movies</a>
            <a href="/tv-shows" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold border border-white/10 transition-colors">Discover TV Series</a>
          </div>
        </div>
      </section>

      <!-- Trending Movies Row -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span>🔥 Trending Movies</span>
          </h2>
          <a href="/movies" class="text-sm font-medium text-purple-400 hover:text-purple-300">View All &rarr;</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          ${movies.map((m: any) => {
            const mTitle = m.title || m.name || 'Movie';
            const mSlug = slugify(mTitle);
            const mUrl = `/movie/${m.id}-${mSlug}`;
            const mPoster = formatImageUrl(m.poster_path, 'w500');
            const mRating = m.vote_average ? Number(m.vote_average).toFixed(1) : '8.0';
            const mYear = getYear(m.release_date || m.first_air_date);
            return `
              <article class="group relative rounded-xl overflow-hidden bg-[#13131A] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30">
                <a href="${mUrl}" class="block focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl">
                  <div class="aspect-[2/3] w-full overflow-hidden bg-gray-900 relative">
                    <img src="${mPoster}" alt="${escapeHtml(mTitle)} poster" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-xs font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                      ★ ${mRating}
                    </div>
                  </div>
                  <div class="p-3">
                    <h3 class="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">${escapeHtml(mTitle)}</h3>
                    <p class="text-xs text-gray-400 mt-1">${mYear || 'Movie'}</p>
                  </div>
                </a>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    </main>

    <footer class="border-t border-white/5 bg-[#08080C] py-8 text-center text-xs text-gray-500">
      <p>MoviyFly &mdash; Entertainment Discovery Platform. Powered by TMDB.</p>
    </footer>
  </div>
  `;

  return {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'website',
    jsonLd,
    bodyHtml
  };
}

/**
 * Pre-render Catalog Page (Movies or TV Shows)
 */
export function renderCatalogPage(
  type: 'movies' | 'tvshows',
  baseUrl: string
): RenderedPageResult {
  const isMovies = type === 'movies';
  const title = isMovies ? 'All Movies - MoviyFly Cinema' : 'TV Shows & Series - MoviyFly OTT';
  const description = isMovies
    ? 'Explore our extensive collection of Hollywood, Bollywood, South Indian, and world cinema hits on MoviyFly.'
    : 'Binge watch premium TV shows, anime series, and Korean dramas in high quality on MoviyFly.';
  const canonicalUrl = `${baseUrl}/${isMovies ? 'movies' : 'tv-shows'}`;
  const ogImage = 'https://moviyfly.vercel.app/og-preview.png';

  const mockEndpoint = isMovies ? 'discover/movie' : 'discover/tv';
  const listRes = handleMockRequest(mockEndpoint, {});
  const items = (listRes && listRes.results) ? listRes.results.slice(0, 18) : [];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': title,
      'url': canonicalUrl,
      'description': description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${baseUrl}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': isMovies ? 'Movies' : 'TV Shows',
          'item': canonicalUrl
        }
      ]
    }
  ];

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white">M</span>
          <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
        </a>
        <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="/home" class="hover:text-white transition-colors">Home</a>
          <a href="/movies" class="${isMovies ? 'text-white font-bold' : 'hover:text-white'} transition-colors">Movies</a>
          <a href="/tv-shows" class="${!isMovies ? 'text-white font-bold' : 'hover:text-white'} transition-colors">TV Shows</a>
          <a href="/watchlist" class="hover:text-white transition-colors">Watchlist</a>
          <a href="/search" class="hover:text-white transition-colors">Search</a>
        </nav>
      </div>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-400 flex items-center gap-2">
        <a href="/" class="hover:text-white">Home</a>
        <span>&rsaquo;</span>
        <span class="text-white">${isMovies ? 'Movies' : 'TV Shows'}</span>
      </nav>

      <div class="mb-8">
        <h1 class="text-2xl md:text-4xl font-black text-white mb-2">${isMovies ? 'All Movies' : 'TV Shows &amp; Series'}</h1>
        <p class="text-gray-400 text-sm md:text-base">${description}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${items.map((m: any) => {
          const mTitle = m.title || m.name || 'Title';
          const mSlug = slugify(mTitle);
          const mUrl = isMovies ? `/movie/${m.id}-${mSlug}` : `/tv/${m.id}-${mSlug}`;
          const mPoster = formatImageUrl(m.poster_path, 'w500');
          const mRating = m.vote_average ? Number(m.vote_average).toFixed(1) : '8.0';
          const mYear = getYear(m.release_date || m.first_air_date);
          return `
            <article class="group relative rounded-xl overflow-hidden bg-[#13131A] border border-white/5 hover:border-purple-500/40 transition-all duration-300">
              <a href="${mUrl}" class="block">
                <div class="aspect-[2/3] w-full overflow-hidden bg-gray-900 relative">
                  <img src="${mPoster}" alt="${escapeHtml(mTitle)} poster" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div class="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs font-bold text-amber-400 border border-white/10">★ ${mRating}</div>
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">${escapeHtml(mTitle)}</h3>
                  <p class="text-xs text-gray-400 mt-1">${mYear}</p>
                </div>
              </a>
            </article>
          `;
        }).join('')}
      </div>
    </main>
  </div>
  `;

  return {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'website',
    jsonLd,
    bodyHtml
  };
}

/**
 * Pre-render Movie or TV Details Page HTML & SEO
 */
export function renderDetailsPage(
  media: MediaDetails,
  baseUrl: string,
  requestPath: string
): RenderedPageResult {
  const isTv = media.type === 'tv';
  const cleanId = String(media.id);
  const titleSlug = slugify(media.title);
  const canonicalUrl = `${baseUrl}/${isTv ? 'tv' : 'movie'}/${cleanId}-${titleSlug}`;
  
  const seoTitle = `${media.title} (${media.year || 'Streaming'}) - Watch Full ${isTv ? 'Series' : 'Movie'} Online | MoviyFly`;
  const seoDesc = media.overview.length > 160
    ? `${media.overview.substring(0, 157)}...`
    : media.overview;

  // Schema.org Structured Data
  const jsonLd: object[] = [];

  // 1. Movie / TVSeries Schema
  if (!isTv) {
    const movieSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      'name': media.title,
      'description': media.overview,
      'url': canonicalUrl,
      'image': media.posterUrl || media.backdropUrl,
    };

    if (media.releaseDate) movieSchema.datePublished = media.releaseDate;
    if (media.genres.length > 0) movieSchema.genre = media.genres;
    
    const isoDuration = minutesToIsoDuration(media.runtime);
    if (isoDuration) movieSchema.duration = isoDuration;

    if (media.voteCount > 0 && media.rating > 0) {
      movieSchema.aggregateRating = {
        '@type': 'AggregateRating',
        'ratingValue': media.rating,
        'bestRating': 10,
        'worstRating': 1,
        'ratingCount': media.voteCount
      };
    }

    if (media.cast.length > 0) {
      movieSchema.actor = media.cast.slice(0, 5).map(c => ({
        '@type': 'Person',
        'name': c.name
      }));
    }

    if (media.director) {
      movieSchema.director = {
        '@type': 'Person',
        'name': media.director
      };
    }

    jsonLd.push(movieSchema);
  } else {
    const tvSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'TVSeries',
      'name': media.title,
      'description': media.overview,
      'url': canonicalUrl,
      'image': media.posterUrl || media.backdropUrl,
    };

    if (media.firstAirDate) tvSchema.startDate = media.firstAirDate;
    if (media.genres.length > 0) tvSchema.genre = media.genres;
    if (media.seasonsCount) tvSchema.numberOfSeasons = media.seasonsCount;
    if (media.episodesCount) tvSchema.numberOfEpisodes = media.episodesCount;

    if (media.voteCount > 0 && media.rating > 0) {
      tvSchema.aggregateRating = {
        '@type': 'AggregateRating',
        'ratingValue': media.rating,
        'bestRating': 10,
        'worstRating': 1,
        'ratingCount': media.voteCount
      };
    }

    if (media.cast.length > 0) {
      tvSchema.actor = media.cast.slice(0, 5).map(c => ({
        '@type': 'Person',
        'name': c.name
      }));
    }

    jsonLd.push(tvSchema);
  }

  // 2. BreadcrumbList Schema
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': isTv ? 'TV Shows' : 'Movies',
        'item': `${baseUrl}/${isTv ? 'tv-shows' : 'movies'}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': media.title,
        'item': canonicalUrl
      }
    ]
  });

  const watchUrl = `/watch/${isTv ? 'tv' : 'movie'}/${cleanId}`;

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <!-- Header -->
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white">M</span>
          <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
        </a>
        <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="/home" class="hover:text-white transition-colors">Home</a>
          <a href="/movies" class="${!isTv ? 'text-white font-bold' : 'hover:text-white'} transition-colors">Movies</a>
          <a href="/tv-shows" class="${isTv ? 'text-white font-bold' : 'hover:text-white'} transition-colors">TV Shows</a>
          <a href="/watchlist" class="hover:text-white transition-colors">Watchlist</a>
          <a href="/search" class="hover:text-white transition-colors">Search</a>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <a href="${watchUrl}" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-sm shadow-lg shadow-purple-900/40">Watch Now</a>
      </div>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Breadcrumb" class="mb-6 text-xs text-gray-400 flex items-center gap-2">
        <a href="/" class="hover:text-white">Home</a>
        <span>&rsaquo;</span>
        <a href="${isTv ? '/tv-shows' : '/movies'}" class="hover:text-white">${isTv ? 'TV Shows' : 'Movies'}</a>
        <span>&rsaquo;</span>
        <span class="text-white font-medium">${escapeHtml(media.title)}</span>
      </nav>

      <!-- Hero Header & Backdrop Card -->
      <article class="relative rounded-2xl overflow-hidden bg-[#13131A] border border-white/10 mb-12">
        <!-- Backdrop Banner -->
        <div class="relative w-full h-[320px] md:h-[460px] overflow-hidden bg-gray-900">
          ${media.backdropUrl ? `
            <img src="${media.backdropUrl}" alt="${escapeHtml(media.title)} backdrop" class="w-full h-full object-cover object-center filter brightness-50" />
          ` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-[#13131A] via-[#13131A]/60 to-transparent"></div>
        </div>

        <!-- Content Overlay -->
        <div class="relative -mt-40 md:-mt-56 px-6 md:px-10 pb-10 flex flex-col md:flex-row gap-8 items-start">
          <!-- Poster -->
          <div class="w-44 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 aspect-[2/3]">
            <img src="${media.posterUrl}" alt="${escapeHtml(media.title)} poster" class="w-full h-full object-cover" />
          </div>

          <!-- Metadata & Details -->
          <div class="flex-1 text-white">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                ${isTv ? 'TV Series' : 'Feature Movie'}
              </span>
              ${media.adult ? `<span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs font-bold">18+</span>` : `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">PG-13</span>`}
              <span class="text-xs text-gray-400">&bull; ${media.originalLanguage || 'EN'}</span>
            </div>

            <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">${escapeHtml(media.title)}</h1>

            <!-- Badges Row -->
            <div class="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300 mb-6">
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                <span>★ ${media.ratingFormatted}</span>
                <span class="text-xs text-gray-400 font-normal">(${media.voteCount.toLocaleString()} votes)</span>
              </div>
              <span>${media.year || 'N/A'}</span>
              <span>&bull;</span>
              <span>${isTv ? `${media.seasonsCount || 1} Seasons` : media.formattedRuntime}</span>
            </div>

            <!-- Genres Badges -->
            <div class="flex flex-wrap gap-2 mb-6">
              ${media.genres.map(g => `<span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 font-medium">${escapeHtml(g)}</span>`).join('')}
            </div>

            <!-- Overview Synopsis -->
            <div class="mb-8">
              <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Overview</h2>
              <p class="text-base text-gray-200 leading-relaxed max-w-3xl">${escapeHtml(media.overview)}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4">
              <a href="${watchUrl}" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white font-bold text-base shadow-xl shadow-purple-900/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                <span>▶ Watch Now</span>
              </a>
              <button type="button" class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-colors">
                + Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- Cast and Crew Section -->
      ${media.cast.length > 0 ? `
      <section class="mb-12">
        <h2 class="text-xl md:text-2xl font-bold text-white mb-6">Top Cast &amp; Crew</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          ${media.cast.map(actor => `
            <div class="p-3 rounded-xl bg-[#13131A] border border-white/5 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                ${actor.profileUrl ? `
                  <img src="${actor.profileUrl}" alt="${escapeHtml(actor.name)}" class="w-full h-full object-cover" />
                ` : `
                  <div class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 bg-purple-900/30">
                    ${actor.name.charAt(0)}
                  </div>
                `}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-white truncate">${escapeHtml(actor.name)}</p>
                <p class="text-xs text-gray-400 truncate">${escapeHtml(actor.character)}</p>
              </div>
            </div>
          `).join('')}
        </div>
        ${media.director ? `
          <div class="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 text-sm">
            <span class="text-gray-400 font-medium">Director: </span>
            <span class="text-white font-bold">${escapeHtml(media.director)}</span>
          </div>
        ` : ''}
      </section>
      ` : ''}

      <!-- Similar Titles Section -->
      ${media.similar.length > 0 ? `
      <section class="mb-12">
        <h2 class="text-xl md:text-2xl font-bold text-white mb-6">Similar ${isTv ? 'Shows' : 'Movies'} You May Like</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          ${media.similar.map(item => {
            const sSlug = slugify(item.title);
            const sUrl = `/${item.type}/${item.id}-${sSlug}`;
            return `
              <article class="group rounded-xl overflow-hidden bg-[#13131A] border border-white/5 hover:border-purple-500/40 transition-all">
                <a href="${sUrl}" class="block">
                  <div class="aspect-[2/3] w-full overflow-hidden bg-gray-900 relative">
                    <img src="${item.posterUrl}" alt="${escapeHtml(item.title)} poster" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-amber-400">★ ${item.rating}</div>
                  </div>
                  <div class="p-2">
                    <h3 class="text-xs font-bold text-white truncate group-hover:text-purple-400 transition-colors">${escapeHtml(item.title)}</h3>
                    <p class="text-[10px] text-gray-400">${item.year}</p>
                  </div>
                </a>
              </article>
            `;
          }).join('')}
        </div>
      </section>
      ` : ''}
    </main>

    <footer class="border-t border-white/5 bg-[#08080C] py-8 text-center text-xs text-gray-500">
      <p>MoviyFly &mdash; Entertainment Discovery Platform. Powered by TMDB.</p>
    </footer>
  </div>
  `;

  return {
    title: seoTitle,
    description: seoDesc,
    canonicalUrl,
    ogImage: media.backdropUrl || media.posterUrl,
    ogType: isTv ? 'video.tv_show' : 'video.movie',
    jsonLd,
    bodyHtml
  };
}

/**
 * Pre-render Watch Page HTML & SEO
 */
export function renderWatchPage(
  type: 'movie' | 'tv',
  rawId: string,
  media: MediaDetails | null,
  baseUrl: string
): RenderedPageResult {
  const isTv = type === 'tv';
  const mediaTitle = media ? media.title : (isTv ? 'TV Show' : 'Movie');
  const canonicalUrl = `${baseUrl}/watch/${type}/${rawId}`;
  const seoTitle = `Watch ${mediaTitle} Online Free in HD | MoviyFly`;
  const seoDesc = media
    ? `Stream ${mediaTitle} full ${isTv ? 'series' : 'movie'} in high definition on MoviyFly. ${media.overview.substring(0, 100)}...`
    : `Stream ${mediaTitle} full ${isTv ? 'series' : 'movie'} in high definition on MoviyFly.`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': isTv ? 'TVSeries' : 'Movie',
      'name': mediaTitle,
      'description': seoDesc,
      'url': canonicalUrl
    }
  ];

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white">M</span>
          <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
        </a>
        <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="/home" class="hover:text-white transition-colors">Home</a>
          <a href="/movies" class="hover:text-white transition-colors">Movies</a>
          <a href="/tv-shows" class="hover:text-white transition-colors">TV Shows</a>
          <a href="/watchlist" class="hover:text-white transition-colors">Watchlist</a>
          <a href="/search" class="hover:text-white transition-colors">Search</a>
        </nav>
      </div>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <nav aria-label="Breadcrumb" class="mb-4 text-xs text-gray-400 flex items-center gap-2">
        <a href="/" class="hover:text-white">Home</a>
        <span>&rsaquo;</span>
        <a href="${isTv ? '/tv-shows' : '/movies'}" class="hover:text-white">${isTv ? 'TV Shows' : 'Movies'}</a>
        <span>&rsaquo;</span>
        <span class="text-white">${escapeHtml(mediaTitle)}</span>
      </nav>

      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-black text-white mb-2">Streaming: ${escapeHtml(mediaTitle)}</h1>
        <p class="text-xs text-gray-400">High-definition multi-server streaming. Select preferred source below.</p>
      </div>

      <!-- Player Frame Placeholder -->
      <div class="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center relative shadow-2xl mb-8">
        <div class="text-center p-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            ▶
          </div>
          <p class="text-lg font-bold text-white mb-1">Loading Video Stream...</p>
          <p class="text-xs text-gray-400">Interactive player will initialize momentarily.</p>
        </div>
      </div>
    </main>
  </div>
  `;

  return {
    title: seoTitle,
    description: seoDesc,
    canonicalUrl,
    ogImage: media ? (media.backdropUrl || media.posterUrl) : 'https://moviyfly.vercel.app/og-preview.png',
    ogType: isTv ? 'video.tv_show' : 'video.movie',
    jsonLd,
    bodyHtml
  };
}

/**
 * Pre-render Search Page HTML & SEO
 */
export function renderSearchPage(baseUrl: string): RenderedPageResult {
  const title = 'Search Movies, TV Shows & Actors | MoviyFly';
  const description = 'Search the complete MoviyFly catalog for Hollywood, Bollywood, anime, and Korean dramas.';
  const canonicalUrl = `${baseUrl}/search`;

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white">M</span>
        <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
      </a>
      <nav aria-label="Main Navigation" class="flex items-center gap-6 text-sm font-medium text-gray-400">
        <a href="/home" class="hover:text-white transition-colors">Home</a>
        <a href="/movies" class="hover:text-white transition-colors">Movies</a>
        <a href="/tv-shows" class="hover:text-white transition-colors">TV Shows</a>
      </nav>
    </header>

    <main id="main-content" class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-black text-white mb-3">Search MoviyFly</h1>
        <p class="text-gray-400 text-sm">Find any movie, television series, actor, or genre instantly.</p>
      </div>

      <div class="relative max-w-2xl mx-auto mb-12">
        <form action="/search" method="GET" class="relative">
          <input type="text" name="q" placeholder="Type a title, actor, or genre..." class="w-full py-4 pl-5 pr-14 rounded-2xl bg-[#13131A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-xl" />
          <button type="submit" class="absolute right-3 top-3 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm">Search</button>
        </form>
      </div>
    </main>
  </div>
  `;

  return {
    title,
    description,
    canonicalUrl,
    ogImage: 'https://moviyfly.vercel.app/og-preview.png',
    ogType: 'website',
    jsonLd: [],
    bodyHtml
  };
}

/**
 * Pre-render Watchlist Page HTML & SEO
 */
export function renderWatchlistPage(baseUrl: string): RenderedPageResult {
  const title = 'My Watchlist - MoviyFly Cinema';
  const description = 'Access your personal curated watchlist of saved movies and TV shows on MoviyFly.';
  const canonicalUrl = `${baseUrl}/watchlist`;

  const bodyHtml = `
  <div class="min-h-screen bg-[#0B0B10] text-[#F3F4F6] font-sans antialiased">
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B0B10]/95 backdrop-blur px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-xl font-black tracking-wider text-white">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center font-bold text-white">M</span>
        <span>MOVIY<span class="text-[#A855F7]">FLY</span></span>
      </a>
      <nav aria-label="Main Navigation" class="flex items-center gap-6 text-sm font-medium text-gray-400">
        <a href="/home" class="hover:text-white transition-colors">Home</a>
        <a href="/movies" class="hover:text-white transition-colors">Movies</a>
        <a href="/tv-shows" class="hover:text-white transition-colors">TV Shows</a>
      </nav>
    </header>

    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-black text-white mb-2">My Cinema Watchlist</h1>
      <p class="text-gray-400 text-sm mb-8">${description}</p>
      <div class="p-8 rounded-2xl bg-[#13131A] border border-white/5 text-center">
        <p class="text-gray-300 mb-4">Your saved movies and television shows appear here.</p>
        <a href="/movies" class="inline-block px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm">Browse Catalog</a>
      </div>
    </main>
  </div>
  `;

  return {
    title,
    description,
    canonicalUrl,
    ogImage: 'https://moviyfly.vercel.app/og-preview.png',
    ogType: 'website',
    jsonLd: [],
    bodyHtml
  };
}

/**
 * Injects pre-rendered HTML and SEO tags into the index.html template string.
 */
export function injectSeoIntoHtml(
  templateHtml: string,
  rendered: RenderedPageResult
): string {
  let output = templateHtml;

  // 1. Remove existing title and meta tags that we will replace
  output = output.replace(/<title>[\s\S]*?<\/title>/gi, '');
  output = output.replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, '');
  output = output.replace(/<meta\s+name=["']robots["'][\s\S]*?>/gi, '');
  output = output.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/gi, '');
  output = output.replace(/<meta\s+property=["']og:[\s\S]*?>/gi, '');
  output = output.replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, '');
  output = output.replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '');

  // 2. Build the new SEO head tags
  const escapedTitle = escapeHtml(rendered.title);
  const escapedDesc = escapeHtml(rendered.description);
  const canonicalLink = `<link rel="canonical" href="${rendered.canonicalUrl}" />`;
  const robotsMeta = `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  const ogTags = [
    `<meta property="og:site_name" content="MoviyFly" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapedDesc}" />`,
    `<meta property="og:type" content="${rendered.ogType}" />`,
    `<meta property="og:url" content="${rendered.canonicalUrl}" />`,
    rendered.ogImage ? `<meta property="og:image" content="${rendered.ogImage}" />` : '',
  ].filter(Boolean).join('\n    ');

  const twitterTags = [
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    `<meta name="twitter:description" content="${escapedDesc}" />`,
    rendered.ogImage ? `<meta name="twitter:image" content="${rendered.ogImage}" />` : '',
  ].filter(Boolean).join('\n    ');

  const jsonLdTags = rendered.jsonLd.length > 0
    ? rendered.jsonLd.map(obj => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`).join('\n    ')
    : '';

  const headInjection = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDesc}" />
    ${robotsMeta}
    ${canonicalLink}
    ${ogTags}
    ${twitterTags}
    ${jsonLdTags}
  `;

  // Inject into <head>
  output = output.replace('</head>', `${headInjection}\n  </head>`);

  // 3. Inject body HTML into <div id="root"></div>
  output = output.replace(
    /<div\s+id=["']root["']>[\s\S]*?<\/div>/i,
    `<div id="root">\n${rendered.bodyHtml}\n</div>`
  );

  return output;
}
