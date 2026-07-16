import * as React from 'react';

export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
  jsonLd?: any;
  breadcrumbsLd?: any;
}

export function updateClientSEO(metadata: SEOMetadata) {
  if (typeof window === 'undefined') return;

  // 1. Update Title
  document.title = metadata.title;

  // 2. Update Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', metadata.description);

  // 3. Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  const currentUrl = metadata.url || window.location.href;
  canonicalLink.setAttribute('href', currentUrl);

  // 4. Update robots meta tag to ensure index, follow
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', 'index, follow');

  // 5. Update Open Graph Tags
  const setOgMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setOgMeta('og:title', metadata.title);
  setOgMeta('og:description', metadata.description);
  if (metadata.image) {
    setOgMeta('og:image', metadata.image);
  }
  setOgMeta('og:url', currentUrl);
  setOgMeta('og:type', metadata.type || 'website');
  setOgMeta('og:site_name', 'MoviyFly');

  // 6. Update Twitter Card Tags
  const setTwitterMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setTwitterMeta('twitter:card', 'summary_large_image');
  setTwitterMeta('twitter:title', metadata.title);
  setTwitterMeta('twitter:description', metadata.description);
  if (metadata.image) {
    setTwitterMeta('twitter:image', metadata.image);
  }

  // 7. Update JSON-LD Structured Data
  let jsonLdScript = document.getElementById('moviyfly-jsonld') as HTMLScriptElement | null;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'moviyfly-jsonld';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://moviyfly1.onrender.com';
  const targetJsonLd = metadata.jsonLd || {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MoviyFly",
    "alternateName": "MoviyFly Movies",
    "url": origin + "/",
    "description": "Watch Movies and TV Shows Online",
    "inLanguage": "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  jsonLdScript.textContent = JSON.stringify(targetJsonLd, null, 2);

  // 8. Update Breadcrumbs JSON-LD
  let breadcrumbsScript = document.getElementById('moviyfly-breadcrumbs-jsonld') as HTMLScriptElement | null;
  if (metadata.breadcrumbsLd) {
    if (!breadcrumbsScript) {
      breadcrumbsScript = document.createElement('script');
      breadcrumbsScript.id = 'moviyfly-breadcrumbs-jsonld';
      breadcrumbsScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbsScript);
    }
    breadcrumbsScript.textContent = JSON.stringify(metadata.breadcrumbsLd, null, 2);
  } else {
    if (breadcrumbsScript) {
      breadcrumbsScript.remove();
    }
  }
}

/**
 * Custom React Hook to dynamically manage document head metadata (SEO).
 * @param metadata SEOMetadata configuration object
 */
export function useSEO(metadata: SEOMetadata) {
  React.useEffect(() => {
    updateClientSEO(metadata);
  }, [
    metadata.title,
    metadata.description,
    metadata.image,
    metadata.type,
    metadata.url,
    metadata.jsonLd ? JSON.stringify(metadata.jsonLd) : '',
    metadata.breadcrumbsLd ? JSON.stringify(metadata.breadcrumbsLd) : '',
  ]);
}

/**
 * Helper to parse a formatted runtime like "2h 15m" into ISO 8601 duration "PT2H15M"
 */
export function parseDurationToISO(runtimeStr: string | null | undefined): string | undefined {
  if (!runtimeStr || runtimeStr === 'N/A') return undefined;
  const hMatch = runtimeStr.match(/(\d+)h/);
  const mMatch = runtimeStr.match(/(\d+)m/);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;
  if (hours === 0 && minutes === 0) {
    const rawMin = parseInt(runtimeStr, 10);
    if (!isNaN(rawMin)) {
      return `PT${rawMin}M`;
    }
    return undefined;
  }
  return `PT${hours ? hours + 'H' : ''}${minutes ? minutes + 'M' : ''}`;
}

export interface MovieJsonLdParams {
  name: string;
  description: string;
  image: string;
  datePublished: string;
  genre: string[];
  duration?: string;
  ratingValue?: number | string;
  ratingCount?: number;
  url: string;
  actors?: { name: string; image?: string }[];
  directors?: { name: string; image?: string }[];
}

export function generateMovieJsonLd(params: MovieJsonLdParams) {
  const ratingVal = typeof params.ratingValue === 'string' ? parseFloat(params.ratingValue) : params.ratingValue;
  
  // Format duration to ISO if it looks like "2h 15m"
  const isoDuration = params.duration && !params.duration.startsWith('PT')
    ? parseDurationToISO(params.duration)
    : params.duration;

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": params.name,
    "description": params.description,
    "image": params.image || "",
    "datePublished": params.datePublished || "",
    "genre": params.genre || [],
    ...(isoDuration ? { "duration": isoDuration } : {}),
    "url": params.url,
    ...(ratingVal && ratingVal > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingVal.toFixed(1),
        "bestRating": "10",
        "worstRating": "1",
        "ratingCount": params.ratingCount || 100
      }
    } : {}),
    ...(params.actors && params.actors.length > 0 ? {
      "actor": params.actors.map(actor => ({
        "@type": "Person",
        "name": actor.name,
        ...(actor.image ? { "image": actor.image } : {})
      }))
    } : {}),
    ...(params.directors && params.directors.length > 0 ? {
      "director": params.directors.map(dir => ({
        "@type": "Person",
        "name": dir.name,
        ...(dir.image ? { "image": dir.image } : {})
      }))
    } : {})
  };
}

export interface TVSeriesJsonLdParams {
  name: string;
  description: string;
  image: string;
  genre: string[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  ratingValue?: number | string;
  ratingCount?: number;
  url: string;
}

export function generateTVSeriesJsonLd(params: TVSeriesJsonLdParams) {
  const ratingVal = typeof params.ratingValue === 'string' ? parseFloat(params.ratingValue) : params.ratingValue;

  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": params.name,
    "description": params.description,
    "image": params.image || "",
    "genre": params.genre || [],
    ...(params.numberOfSeasons ? { "numberOfSeasons": params.numberOfSeasons } : {}),
    ...(params.numberOfEpisodes ? { "numberOfEpisodes": params.numberOfEpisodes } : {}),
    "url": params.url,
    ...(ratingVal && ratingVal > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingVal.toFixed(1),
        "bestRating": "10",
        "worstRating": "1",
        "ratingCount": params.ratingCount || 100
      }
    } : {})
  };
}

export interface WebSiteJsonLdParams {
  name: string;
  alternateName?: string;
  url: string;
  description: string;
  inLanguage?: string;
}

export function generateWebSiteJsonLd(params: WebSiteJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": params.name,
    ...(params.alternateName ? { "alternateName": params.alternateName } : {}),
    "url": params.url,
    "description": params.description,
    "inLanguage": params.inLanguage || "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${params.url.endsWith('/') ? params.url : params.url + '/' }search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbsJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}
