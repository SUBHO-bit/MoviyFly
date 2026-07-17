/**
 * MoviyFly Schema.org Structured Data Utility
 * Follows Google's latest recommendations for Search SEO.
 */

export interface WebSiteSchemaParams {
  name?: string;
  url?: string;
  searchTarget?: string;
}

export interface SearchActionSchemaParams {
  target?: string;
}

export interface MovieSchemaParams {
  title: string;
  description: string;
  poster: string;
  releaseDate: string;
  genres: string[];
  rating?: number | { ratingValue: number; ratingCount?: number };
  runtime?: number | string; // If number, represents runtime in minutes. If string, it could be already formatted (e.g. "2h 15m")
  tmdbId: string | number;
  canonicalUrl: string;
  inLanguage?: string;
  productionCompany?: string | string[];
}

export interface TVSeriesSchemaParams {
  name: string;
  description: string;
  poster: string;
  firstAirDate: string;
  genres: string[];
  numberOfSeasons?: number;
  rating?: number | { ratingValue: number; ratingCount?: number };
  tmdbId: string | number;
  canonicalUrl: string;
  inLanguage?: string;
}

export interface VideoObjectSchemaParams {
  name: string;
  description: string;
  thumbnailUrl: string;
  embedUrl: string;
  uploadDate: string;
  inLanguage?: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Parses minutes or formatted duration strings into ISO 8601 duration format (e.g., PT1H45M)
 */
export function parseDurationToISO(runtime: number | string | null | undefined): string | undefined {
  if (runtime === undefined || runtime === null || runtime === 'N/A') return undefined;

  if (typeof runtime === 'number') {
    if (runtime <= 0) return 'PT0M';
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;
    return `PT${hours > 0 ? hours + 'H' : ''}${mins > 0 ? mins + 'M' : ''}`;
  }

  // Handle strings like "2h 15m"
  const hMatch = runtime.match(/(\d+)h/);
  const mMatch = runtime.match(/(\d+)m/);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;

  if (hours === 0 && minutes === 0) {
    const rawMin = parseInt(runtime, 10);
    if (!isNaN(rawMin)) {
      return `PT${rawMin}M`;
    }
    return undefined;
  }

  return `PT${hours > 0 ? hours + 'H' : ''}${minutes > 0 ? minutes + 'M' : ''}`;
}

/**
 * 1. WebSite Schema Generator
 */
export function generateWebSiteSchema(params?: WebSiteSchemaParams) {
  const name = params?.name || 'MoviyFly';
  const url = params?.url || 'https://moviyfly.vercel.app';
  const searchTarget = params?.searchTarget || `${url}/search?q={search_term_string}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': name,
    'url': url,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': searchTarget,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 2. SearchAction Schema Generator
 */
export function generateSearchActionSchema(params?: SearchActionSchemaParams) {
  const target = params?.target || 'https://moviyfly.vercel.app/search?q={search_term_string}';
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    'target': target,
    'query-input': 'required name=search_term_string',
  };
}

/**
 * Safely parses rating to AggregateRating schema type, or returns undefined if rating is invalid.
 */
export function parseRating(ratingInput: any): any {
  if (ratingInput === undefined || ratingInput === null) return undefined;

  let rawValue: any;
  let ratingCount = 100;

  if (typeof ratingInput === 'number') {
    rawValue = ratingInput;
  } else if (typeof ratingInput === 'object') {
    rawValue = ratingInput.ratingValue;
    if (ratingInput.ratingCount !== undefined && ratingInput.ratingCount !== null) {
      const parsedCount = Number(ratingInput.ratingCount);
      if (Number.isFinite(parsedCount)) {
        ratingCount = parsedCount;
      }
    }
  } else {
    rawValue = ratingInput;
  }

  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);

  if (Number.isFinite(numericValue) && numericValue > 0) {
    return {
      '@type': 'AggregateRating',
      'ratingValue': numericValue.toFixed(1),
      'bestRating': '10',
      'worstRating': '1',
      'ratingCount': ratingCount,
    };
  }

  return undefined;
}

/**
 * 3. Movie Schema Generator
 */
export function generateMovieSchema(params: MovieSchemaParams) {
  const ratingObj = parseRating(params.rating);
  const duration = parseDurationToISO(params.runtime);

  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    'name': params.title,
    'description': params.description,
    'image': params.poster,
    'datePublished': params.releaseDate,
    'genre': params.genres,
    ...(ratingObj ? { 'aggregateRating': ratingObj } : {}),
    ...(duration ? { 'duration': duration } : {}),
    'url': params.canonicalUrl,
    'identifier': {
      '@type': 'PropertyValue',
      'propertyID': 'TMDB_ID',
      'value': String(params.tmdbId),
    },
    ...(params.inLanguage ? { 'inLanguage': params.inLanguage } : {}),
    ...(params.productionCompany ? {
      'productionCompany': Array.isArray(params.productionCompany)
        ? params.productionCompany.map(name => ({ '@type': 'Organization', 'name': name }))
        : { '@type': 'Organization', 'name': params.productionCompany }
    } : {}),
  };
}

/**
 * 4. TVSeries Schema Generator
 */
export function generateTVSeriesSchema(params: TVSeriesSchemaParams) {
  const ratingObj = parseRating(params.rating);

  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    'name': params.name,
    'description': params.description,
    'image': params.poster,
    'startDate': params.firstAirDate,
    'genre': params.genres,
    ...(params.numberOfSeasons !== undefined ? { 'numberOfSeasons': params.numberOfSeasons } : {}),
    ...(ratingObj ? { 'aggregateRating': ratingObj } : {}),
    'url': params.canonicalUrl,
    'identifier': {
      '@type': 'PropertyValue',
      'propertyID': 'TMDB_ID',
      'value': String(params.tmdbId),
    },
    ...(params.inLanguage ? { 'inLanguage': params.inLanguage } : {}),
  };
}

/**
 * 5. VideoObject Schema Generator
 */
export function generateVideoObjectSchema(params: VideoObjectSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': params.name,
    'description': params.description,
    'thumbnailUrl': params.thumbnailUrl,
    'embedUrl': params.embedUrl,
    'uploadDate': params.uploadDate,
    ...(params.inLanguage ? { 'inLanguage': params.inLanguage } : {}),
    'publisher': {
      '@type': 'Organization',
      'name': 'MoviyFly',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://moviyfly.vercel.app/icon.png',
      },
    },
  };
}

/**
 * 6. BreadcrumbList Schema Generator
 */
export function generateBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.item,
    })),
  };
}

/**
 * Client-side script injector.
 * Automatically removes any previous JSON-LD tag with the same ID before inserting the new one.
 */
export function injectSchema(schema: any, id: string = 'moviyfly-jsonld') {
  if (typeof window === 'undefined') return;

  // Find and remove any existing script tag to ensure clean client-side navigation
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and append the new JSON-LD structured data tag
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/**
 * Helper to manually clear a structured data tag
 */
export function clearSchema(id: string = 'moviyfly-jsonld') {
  if (typeof window === 'undefined') return;
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
}
