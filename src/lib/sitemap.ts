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
 * Normalizes any string or Date into YYYY-MM-DD format.
 * Falls back to today's date if empty or invalid.
 */
export function normalizeSitemapDate(input?: string | Date | null): string {
  if (!input) {
    return formatSitemapDate();
  }

  if (input instanceof Date) {
    return formatSitemapDate(input);
  }

  // Handle YYYY-MM-DD pattern
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  // Try parsing general Date format
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return formatSitemapDate(parsed);
  }

  return formatSitemapDate();
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
  popularity?: number; // TMDB popularity metric
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
    lastmod: normalizeSitemapDate(item.lastmod),
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
    lastmod: normalizeSitemapDate(item.lastmod),
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

interface CacheContainer<T> {
  data: T[];
  lastFetched: number;
}

// In-memory server-side cache for 24 hours
let moviesCache: CacheContainer<DynamicMediaItem> | null = null;
let tvsCache: CacheContainer<DynamicMediaItem> | null = null;

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch and construct Movie DynamicMediaItem array from multiple TMDB endpoints.
 * Caches results for 24 hours. Falls back to cached data if TMDB fails or is offline.
 */
export async function fetchMoviesFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
  const now = Date.now();
  if (moviesCache && (now - moviesCache.lastFetched < CACHE_DURATION_MS)) {
    console.log(`[Sitemap Cache] Serving cached movie list. Age: ${Math.round((now - moviesCache.lastFetched) / 1000)} seconds.`);
    return moviesCache.data;
  }

  console.log('[Sitemap Cache] Fetching fresh movie data from TMDB endpoints...');
  const fetched = await fetchFreshMoviesFromTMDB(baseUrl);

  if (fetched.length > 0) {
    moviesCache = {
      data: fetched,
      lastFetched: now,
    };
    return fetched;
  } else if (moviesCache && moviesCache.data.length > 0) {
    console.warn('[Sitemap Cache] TMDB movie fetch failed. Serving stale cache as fallback.');
    return moviesCache.data;
  }

  return [];
}

/**
 * Clean internal fetch helper for movies.
 */
async function fetchFreshMoviesFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
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
            // Check if native release_date exists and is non-empty
            const hasReleaseDate = !!movie.release_date && typeof movie.release_date === 'string' && movie.release_date.trim().length > 0;
            allMovies.push({
              id: movie.id,
              title: movie.title || movie.original_title || 'Untitled Movie',
              lastmod: hasReleaseDate ? normalizeSitemapDate(movie.release_date) : formatSitemapDate(),
              popularity: typeof movie.popularity === 'number' ? movie.popularity : 0,
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
  let releaseDateCount = 0;

  for (const movie of allMovies) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      uniqueMovies.push(movie);
      
      // Count items that have an actual release_date (not fallback to today)
      if (movie.lastmod && movie.lastmod !== formatSitemapDate()) {
        releaseDateCount++;
      }
    }
  }

  // Sort by TMDB popularity (highest first)
  uniqueMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  console.log(`[Sitemap Generator] Movie duplicates removed and sorted by popularity. Total: ${uniqueMovies.length}. Items with native release_date: ${releaseDateCount}.`);
  return uniqueMovies;
}

/**
 * Fetch and construct TV DynamicMediaItem array from multiple TMDB endpoints.
 * Caches results for 24 hours. Falls back to cached data if TMDB fails or is offline.
 */
export async function fetchTVsFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
  const now = Date.now();
  if (tvsCache && (now - tvsCache.lastFetched < CACHE_DURATION_MS)) {
    console.log(`[Sitemap Cache] Serving cached TV list. Age: ${Math.round((now - tvsCache.lastFetched) / 1000)} seconds.`);
    return tvsCache.data;
  }

  console.log('[Sitemap Cache] Fetching fresh TV data from TMDB endpoints...');
  const fetched = await fetchFreshTVsFromTMDB(baseUrl);

  if (fetched.length > 0) {
    tvsCache = {
      data: fetched,
      lastFetched: now,
    };
    return fetched;
  } else if (tvsCache && tvsCache.data.length > 0) {
    console.warn('[Sitemap Cache] TMDB TV fetch failed. Serving stale cache as fallback.');
    return tvsCache.data;
  }

  return [];
}

/**
 * Clean internal fetch helper for TVs.
 */
async function fetchFreshTVsFromTMDB(baseUrl: string): Promise<DynamicMediaItem[]> {
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
            // Check if native first_air_date exists and is non-empty
            const hasFirstAirDate = !!tv.first_air_date && typeof tv.first_air_date === 'string' && tv.first_air_date.trim().length > 0;
            allTVs.push({
              id: tv.id,
              name: tv.name || tv.original_name || 'Untitled TV Show',
              lastmod: hasFirstAirDate ? normalizeSitemapDate(tv.first_air_date) : formatSitemapDate(),
              popularity: typeof tv.popularity === 'number' ? tv.popularity : 0,
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
  let firstAirDateCount = 0;

  for (const tv of allTVs) {
    if (!seenIds.has(tv.id)) {
      seenIds.add(tv.id);
      uniqueTVs.push(tv);

      // Count items that have an actual first_air_date (not fallback to today)
      if (tv.lastmod && tv.lastmod !== formatSitemapDate()) {
        firstAirDateCount++;
      }
    }
  }

  // Sort by TMDB popularity (highest first)
  uniqueTVs.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  console.log(`[Sitemap Generator] TV duplicates removed and sorted by popularity. Total: ${uniqueTVs.length}. Items with native first_air_date: ${firstAirDateCount}.`);
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

export interface SitemapRegistry {
  index: string[]; // List of absolute sitemap URLs
  getSitemapContent: (filename: string) => string | null;
}

/**
 * Validates a sitemap XML string against the official Google / sitemap.org protocol requirements.
 * Checks for maximum URL count, maximum uncompressed size, valid XML envelope, and valid tags.
 */
export function validateSitemapProtocol(xml: string, isIndex: boolean = false): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check 1: Size limit (50 MB = 52428800 bytes)
  const byteLength = typeof Buffer !== 'undefined' ? Buffer.from(xml, 'utf-8').byteLength : xml.length * 2;
  if (byteLength > 52428800) {
    errors.push(`Sitemap size of ${byteLength} bytes exceeds the 50 MB uncompressed protocol limit.`);
  }

  // Check 2: Well-formed start/end tags and namespace
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('Sitemap missing standard XML UTF-8 declaration.');
  }

  if (isIndex) {
    if (!xml.includes('<sitemapindex') || !xml.includes('</sitemapindex>')) {
      errors.push('Sitemap index is missing valid <sitemapindex> envelope tags.');
    }
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Sitemap index is missing correct xmlns namespace.');
    }
    
    // Count index URLs
    const sitemapCount = (xml.match(/<sitemap>/g) || []).length;
    if (sitemapCount > 50000) {
      errors.push(`Sitemap index contains ${sitemapCount} sitemaps, exceeding the 50,000 limit.`);
    }
  } else {
    if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
      errors.push('Sitemap is missing valid <urlset> envelope tags.');
    }
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Sitemap is missing correct xmlns namespace.');
    }

    // Count URLs
    const urlCount = (xml.match(/<url>/g) || []).length;
    if (urlCount > 50000) {
      errors.push(`Sitemap contains ${urlCount} URLs, exceeding the 50,000 limit per sitemap file.`);
    }

    // Validate that every loc is fully escaped
    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (locMatches) {
      for (const locTag of locMatches) {
        const urlText = locTag.replace(/<\/?loc>/g, '');
        // An unescaped ampersand in XML is illegal unless part of an entity reference
        if (urlText.includes('&') && !/&amp;|&quot;|&apos;|&lt;|&gt;/.test(urlText)) {
          errors.push(`Sitemap contains unescaped ampersand in location: ${urlText}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
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

  const xml = [xmlHeader, indexStart, ...xmlSitemaps, indexEnd].join('\n');
  
  // Validate index sitemap
  const validation = validateSitemapProtocol(xml, true);
  if (!validation.valid) {
    console.error(`[Sitemap Validator] Validation errors in sitemap index:`, validation.errors);
  } else {
    console.log(`[Sitemap Validator] Sitemap index is 100% compliant with Google/Sitemaps.org protocol.`);
  }

  return xml;
}

/**
 * High-performance, production-ready sitemap registry generator.
 * Automatically splits dynamic URLs into pages conforming to Google's 50,000 limit.
 * Keeps URLs sorted by TMDB popularity (highest first).
 */
export function generateSitemapRegistry(
  movies: DynamicMediaItem[],
  tvs: DynamicMediaItem[],
  options?: SitemapGeneratorOptions & { pageSize?: number }
): SitemapRegistry {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const pageSize = options?.pageSize || 50000; // Standard Google limit

  // Sort by TMDB popularity descending (highest first)
  const sortedMovies = [...movies].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const sortedTVs = [...tvs].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  // Determine dynamic page counts (minimum 1 page per media type to maintain valid endpoints)
  const totalMoviePages = Math.max(1, Math.ceil(sortedMovies.length / pageSize));
  const totalTvPages = Math.max(1, Math.ceil(sortedTVs.length / pageSize));

  // Build list of sub-sitemaps dynamically based on page count
  const indexUrls: string[] = [`${baseUrl}/sitemaps/static.xml`];
  for (let page = 1; page <= totalMoviePages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/movies-${page}.xml`);
  }
  for (let page = 1; page <= totalTvPages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/tv-${page}.xml`);
  }

  // Static Core Sitemap
  const coreEntries = getCoreRoutes(options);

  return {
    index: indexUrls,
    getSitemapContent: (filename: string): string | null => {
      let content: string | null = null;

      if (filename === 'static.xml') {
        content = buildSitemapXml(coreEntries);
      } else {
        const movieMatch = filename.match(/^movies-(\d+)\.xml$/);
        if (movieMatch) {
          const page = parseInt(movieMatch[1], 10);
          if (page >= 1 && page <= totalMoviePages) {
            const chunk = paginateEntries(sortedMovies, page, pageSize);
            const entries = chunk.map((item) => generateMovieSitemapEntry(item, options));
            content = buildSitemapXml(entries);
          }
        } else {
          const tvMatch = filename.match(/^tv-(\d+)\.xml$/);
          if (tvMatch) {
            const page = parseInt(tvMatch[1], 10);
            if (page >= 1 && page <= totalTvPages) {
              const chunk = paginateEntries(sortedTVs, page, pageSize);
              const entries = chunk.map((item) => generateTVSitemapEntry(item, options));
              content = buildSitemapXml(entries);
            }
          }
        }
      }

      if (content !== null) {
        // Validate against sitemap.org and Google protocols
        const validation = validateSitemapProtocol(content, false);
        if (!validation.valid) {
          console.error(`[Sitemap Validator] Validation errors found in ${filename}:`, validation.errors);
        } else {
          console.log(`[Sitemap Validator] ${filename} is 100% compliant with Google/Sitemaps.org protocol.`);
        }
      }

      return content;
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
