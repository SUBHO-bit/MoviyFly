import { TMDB_CONFIG } from '../../config/tmdb';

// Client-side in-memory cache for TMDB response data
const tmdbCache = new Map<string, { data: any; expiry: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes

// Track in-flight requests to deduplicate concurrent calls
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Generic utility to fetch from our server-side TMDB proxy with automatic caching and request collapsing.
 * This ensures that no API keys or access tokens are exposed in the browser network tab.
 */
export async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  // Clean endpoint by removing leading slashes
  const cleanEndpoint = endpoint.replace(/^\//, '');

  // Construct query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const cacheKey = `${cleanEndpoint}?${queryString}`;
  const now = Date.now();

  // 1. Check if we have a valid cached response
  const cached = tmdbCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  // 2. Check if a request for this exact endpoint is already in-flight
  const existingPromise = inFlightRequests.get(cacheKey);
  if (existingPromise) {
    return existingPromise as Promise<T>;
  }

  // 3. Perform the fetch and cache the result
  const url = `/api/tmdb/${cleanEndpoint}${queryString ? `?${queryString}` : ''}`;
  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`TMDB Proxy request failed (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      
      // Store in cache
      tmdbCache.set(cacheKey, {
        data: responseData,
        expiry: Date.now() + CACHE_DURATION_MS,
      });

      return responseData;
    } finally {
      // Clean up from in-flight request tracker once complete
      inFlightRequests.delete(cacheKey);
    }
  })();

  // Track in-flight promise
  inFlightRequests.set(cacheKey, fetchPromise);

  return fetchPromise as Promise<T>;
}

