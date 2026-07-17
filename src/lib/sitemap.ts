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
 * Computes a clean movie slug.
 * Fallback patterns: slug -> id-title -> id
 */
export function getMovieSlug(item: DynamicMediaItem): string {
  if (item.slug) return item.slug;
  if (item.title) {
    const slugified = slugify(item.title);
    return slugified ? `${item.id}-${slugified}` : String(item.id);
  }
  return String(item.id);
}

/**
 * Computes a clean TV show slug.
 * Fallback patterns: slug -> id-name -> id
 */
export function getTVSlug(item: DynamicMediaItem): string {
  if (item.slug) return item.slug;
  const displayName = item.name || item.title;
  if (displayName) {
    const slugified = slugify(displayName);
    return slugified ? `${item.id}-${slugified}` : String(item.id);
  }
  return String(item.id);
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
export const SAMPLE_MOVIES: DynamicMediaItem[] = [
  { id: 1001, title: 'Jawan', lastmod: '2023-09-07' },
  { id: 1002, title: 'Pathaan', lastmod: '2023-01-25' },
  { id: 1003, title: 'Animal', lastmod: '2023-12-01' },
  { id: 1014, title: 'Dune Part Two', lastmod: '2024-03-01' },
  { id: 1015, title: 'Oppenheimer', lastmod: '2023-07-21' },
];

export const SAMPLE_TVS: DynamicMediaItem[] = [
  { id: 1019, name: 'Squid Game', lastmod: '2021-09-17' },
  { id: 1020, name: 'Crash Landing on You', lastmod: '2019-12-14' },
  { id: 1021, name: 'Shogun', lastmod: '2024-02-27' },
];

/**
 * Reusable paginator helper to split entries dynamically.
 * Enables handling hundreds of thousands of dynamic records without memory issues.
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
 * Automatically chunks dynamic URLs to comply with Google's 50,000 limit per file.
 */
export function generateSitemapRegistry(
  movies: DynamicMediaItem[],
  tvs: DynamicMediaItem[],
  options?: SitemapGeneratorOptions & { 
    maxUrlLimit?: number;
    movieLimit?: number;
    tvLimit?: number;
  }
): SitemapRegistry {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const maxUrlLimit = options?.maxUrlLimit || 50000; // Standard Google limits
  const movieLimit = options?.movieLimit || maxUrlLimit;
  const tvLimit = options?.tvLimit || maxUrlLimit;

  // 1. Static Core Sitemap
  const coreEntries = getCoreRoutes(options);

  // 2. Partition movies into chunks
  const movieChunks: DynamicMediaItem[][] = [];
  for (let i = 0; i < movies.length; i += movieLimit) {
    movieChunks.push(movies.slice(i, i + movieLimit));
  }

  // 3. Partition TV Shows into chunks
  const tvChunks: DynamicMediaItem[][] = [];
  for (let i = 0; i < tvs.length; i += tvLimit) {
    tvChunks.push(tvs.slice(i, i + tvLimit));
  }

  // Build the list of sub-sitemaps
  const indexUrls: string[] = [`${baseUrl}/sitemaps/static.xml`];
  
  // Even if list is empty, we must keep at least page 1 for structure
  const totalMoviePages = Math.max(1, movieChunks.length);
  for (let page = 1; page <= totalMoviePages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/movies-${page}.xml`);
  }

  const totalTvPages = Math.max(1, tvChunks.length);
  for (let page = 1; page <= totalTvPages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/tv-${page}.xml`);
  }

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
