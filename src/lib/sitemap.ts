/**
 * MoviyFly Sitemap.org XML Structured Generator
 * Supports dynamic generation for Search SEO optimization.
 */

export interface SitemapEntry {
  loc: string;
  lastmod?: string; // ISO 8601 format: YYYY-MM-DD
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // range 0.0 to 1.0
}

export interface SitemapGeneratorOptions {
  baseUrl?: string;
  defaultLastMod?: string;
}

const DEFAULT_BASE_URL = 'https://moviyfly.vercel.app';

/**
 * Formats a date into ISO 8601 (YYYY-MM-DD) standard.
 */
export function formatSitemapDate(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the default list of core static routes.
 */
export function getCoreRoutes(options?: SitemapGeneratorOptions): SitemapEntry[] {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const lastmod = options?.defaultLastMod || formatSitemapDate();

  return [
    {
      loc: `${baseUrl}/`,
      lastmod,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/movies`,
      lastmod,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/tvshows`,
      lastmod,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/watchlist`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/search`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.6,
    },
  ];
}

/**
 * Helper interface representing a dynamic Movie or TV Show record from TMDB or CMS
 */
export interface DynamicMediaItem {
  id: string | number;
  title?: string; // Movie title
  name?: string; // TV Show name
  slug?: string; // Pre-generated slug if available
  lastmod?: string; // ISO 8601 date
}

/**
 * Creates a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Computes a clean movie slug matching the application's exact routing format.
 */
export function getMovieSlug(item: DynamicMediaItem): string {
  const idStr = String(item.id);
  if (idStr.startsWith('movie-')) {
    return idStr;
  }
  return `movie-${idStr}`;
}

/**
 * Computes a clean TV show slug matching the application's exact routing format.
 */
export function getTVSlug(item: DynamicMediaItem): string {
  const idStr = String(item.id);
  if (idStr.startsWith('tv-')) {
    return idStr;
  }
  return `tv-${idStr}`;
}

/**
 * Reusable generator to dynamically produce Movie sitemap URLs.
 */
export function generateMovieSitemapEntry(
  item: DynamicMediaItem,
  options?: SitemapGeneratorOptions
): SitemapEntry {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const slug = getMovieSlug(item);
  return {
    loc: `${baseUrl}/movie/${slug}`,
    lastmod: item.lastmod || formatSitemapDate(),
    changefreq: 'weekly',
    priority: 0.8,
  };
}

/**
 * Reusable generator to dynamically produce TV show sitemap URLs.
 */
export function generateTVSitemapEntry(
  item: DynamicMediaItem,
  options?: SitemapGeneratorOptions
): SitemapEntry {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const slug = getTVSlug(item);
  return {
    loc: `${baseUrl}/tv/${slug}`,
    lastmod: item.lastmod || formatSitemapDate(),
    changefreq: 'weekly',
    priority: 0.8,
  };
}

/**
 * High-fidelity, dynamic sample dataset representing TMDB-powered Movie/TV records.
 */
export const SAMPLE_MOVIES: DynamicMediaItem[] = [];

export const SAMPLE_TVS: DynamicMediaItem[] = [];

/**
 * Splits an array into exactly N contiguous chunks.
 * Always returns exactly numChunks arrays (padded with empty arrays if needed).
 */
export function splitIntoContiguousChunks<T>(arr: T[], numChunks: number): T[][] {
  const chunks: T[][] = [];
  const size = Math.ceil(arr.length / numChunks);
  for (let i = 0; i < numChunks; i++) {
    const start = i * size;
    const end = Math.min(start + size, arr.length);
    if (start < arr.length) {
      chunks.push(arr.slice(start, end));
    } else {
      chunks.push([]);
    }
  }
  while (chunks.length < numChunks) {
    chunks.push([]);
  }
  return chunks;
}

/**
 * Fetch and construct Movie DynamicMediaItem array from multiple TMDB endpoints.
 */
export async function fetchMoviesFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
  const endpoints = [
    '/movie/popular',
    '/movie/top_rated',
    '/movie/now_playing',
    '/movie/upcoming',
    '/trending/movie/week'
  ];

  const allMovies: DynamicMediaItem[] = [];

  try {
    const promises = endpoints.map(endpoint => 
      fetch(`${baseUrl}/api/tmdb${endpoint}`)
        .then(res => {
          if (!res.ok) {
            console.error(`Sitemap TMDB Fetch Error for ${endpoint}: Status ${res.status}`);
            return null;
          }
          return res.json();
        })
        .catch(err => {
          console.error(`Sitemap TMDB Fetch Exception for ${endpoint}:`, err);
          return null;
        })
    );

    const results = await Promise.all(promises);

    for (const data of results) {
      if (data && Array.isArray(data.results)) {
        for (const movie of data.results) {
          if (movie && movie.id) {
            allMovies.push({
              id: movie.id,
              title: movie.title || movie.original_title || 'Untitled Movie',
              lastmod: movie.release_date || formatSitemapDate(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch movies from TMDB for sitemap:', err);
  }

  // Remove duplicate IDs
  const seenIds = new Set<string | number>();
  const uniqueMovies: DynamicMediaItem[] = [];
  for (const movie of allMovies) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      uniqueMovies.push(movie);
    }
  }

  return uniqueMovies;
}

/**
 * Fetch and construct TV DynamicMediaItem array from multiple TMDB endpoints.
 */
export async function fetchTVsFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
  const endpoints = [
    '/tv/popular',
    '/tv/top_rated',
    '/trending/tv/week'
  ];

  const allTVs: DynamicMediaItem[] = [];

  try {
    const promises = endpoints.map(endpoint => 
      fetch(`${baseUrl}/api/tmdb${endpoint}`)
        .then(res => {
          if (!res.ok) {
            console.error(`Sitemap TMDB Fetch Error for ${endpoint}: Status ${res.status}`);
            return null;
          }
          return res.json();
        })
        .catch(err => {
          console.error(`Sitemap TMDB Fetch Exception for ${endpoint}:`, err);
          return null;
        })
    );

    const results = await Promise.all(promises);

    for (const data of results) {
      if (data && Array.isArray(data.results)) {
        for (const tv of data.results) {
          if (tv && tv.id) {
            allTVs.push({
              id: tv.id,
              name: tv.name || tv.original_name || 'Untitled TV Show',
              lastmod: tv.first_air_date || formatSitemapDate(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch TV shows from TMDB for sitemap:', err);
  }

  // Remove duplicate IDs
  const seenIds = new Set<string | number>();
  const uniqueTVs: DynamicMediaItem[] = [];
  for (const tv of allTVs) {
    if (!seenIds.has(tv.id)) {
      seenIds.add(tv.id);
      uniqueTVs.push(tv);
    }
  }

  return uniqueTVs;
}

/**
 * Reusable paginator helper to split entries dynamically.
 */
export function paginateEntries<T>(items: T[], page: number, pageSize: number = 1000): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  if (startIndex < 0 || startIndex >= items.length) return [];
  return items.slice(startIndex, endIndex);
}

/**
 * Compiles a standard sitemap index for scalable URL architectures.
 */
export function generateSitemapIndexXml(sitemapUrls: string[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const indexStart = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const indexEnd = '</sitemapindex>';
  const lastmod = formatSitemapDate();

  const xmlSitemaps = sitemapUrls.map((url) => {
    return [
      '  <sitemap>',
      `    <loc>${url}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </sitemap>'
    ].join('\n');
  });

  return [xmlHeader, indexStart, ...xmlSitemaps, indexEnd].join('\n');
}

export interface SitemapRegistry {
  index: string[]; // List of absolute sitemap URLs
  getSitemapContent: (filename: string) => string | null;
}

/**
 * High-performance, production-ready sitemap registry generator.
 * Automatically splits dynamic URLs into exactly 2 pages for movies and 2 pages for TV shows.
 */
export function generateSitemapRegistry(
  movies: DynamicMediaItem[],
  tvs: DynamicMediaItem[],
  options?: SitemapGeneratorOptions
): SitemapRegistry {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;

  // 1. Static Core Sitemap
  const coreEntries = getCoreRoutes(options);

  // 2. Partition movies into exactly 2 chunks to keep movies-1.xml and movies-2.xml constant
  const movieChunks = splitIntoContiguousChunks(movies, 2);

  // 3. Partition TV Shows into exactly 2 chunks to keep tv-1.xml and tv-2.xml constant
  const tvChunks = splitIntoContiguousChunks(tvs, 2);

  // Build the list of sub-sitemaps (retains exactly the 5 static sitemaps requested)
  const indexUrls: string[] = [
    `${baseUrl}/sitemaps/static.xml`,
    `${baseUrl}/sitemaps/movies-1.xml`,
    `${baseUrl}/sitemaps/movies-2.xml`,
    `${baseUrl}/sitemaps/tv-1.xml`,
    `${baseUrl}/sitemaps/tv-2.xml`
  ];

  return {
    index: indexUrls,
    getSitemapContent: (filename: string): string | null => {
      if (filename === 'static.xml') {
        return buildSitemapXml(coreEntries);
      }

      const movieMatch = filename.match(/^movies-(\d+)\.xml$/);
      if (movieMatch) {
        const pageIndex = parseInt(movieMatch[1], 10) - 1;
        const chunk = movieChunks[pageIndex] || [];
        const entries = chunk.map((item) => generateMovieSitemapEntry(item, options));
        return buildSitemapXml(entries);
      }

      const tvMatch = filename.match(/^tv-(\d+)\.xml$/);
      if (tvMatch) {
        const pageIndex = parseInt(tvMatch[1], 10) - 1;
        const chunk = tvChunks[pageIndex] || [];
        const entries = chunk.map((item) => generateTVSitemapEntry(item, options));
        return buildSitemapXml(entries);
      }

      return null;
    }
  };
}

/**
 * Compiles a list of SitemapEntry objects into a valid XML string.
 * Escalates encoding of special characters to follow standard XML safety guidelines.
 */
export function buildSitemapXml(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = '</urlset>';

  const escapeXml = (unsafe: string): string => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const xmlEntries = entries.map((entry) => {
    const lines = ['  <url>'];
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    
    if (entry.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== undefined && entry.priority !== null) {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    
    lines.push('  </url>');
    return lines.join('\n');
  });

  return [xmlHeader, urlsetStart, ...xmlEntries, urlsetEnd].join('\n');
}
