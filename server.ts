import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import dns from 'dns';
import { handleMockRequest } from './server-mock-data';

// Set DNS resolution order to favor IPv4 to prevent connection failures in containerized environments
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from .env.local and standard .env
dotenv.config({ path: '.env.local' });
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory cache system to cache TMDB responses for 10 minutes
  const cache = new Map<string, { data: any; expiry: number }>();
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Circuit Breaker state to prevent blocking the app when TMDB API is unreachable/timing out
  let isTmdbOffline = false;
  let lastFailureTime = 0;
  const CIRCUIT_BREAKER_COOLDOWN = 5 * 60 * 1000; // 5 minutes

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Helper function to check if an ID is one of our defined mock IDs
  function isMockId(idStr: string): boolean {
    const idNum = parseInt(idStr, 10);
    if (isNaN(idNum)) return false;
    const mockIds = [
      1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021,
      2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
      3001, 3002, 3003, 3004, 3005,
      4001, 4002,
      5001, 5002, 5003,
      6001
    ];
    return mockIds.includes(idNum);
  }

  // TMDB API Proxy and Cache Layer
  app.all('/api/tmdb/*', async (req, res) => {
    const token = process.env.TMDB_READ_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
    const targetPath = req.params[0] || '';
    const queryParamsObj: Record<string, string> = {};
    if (req.query) {
      Object.entries(req.query).forEach(([k, v]) => {
        queryParamsObj[k] = String(v);
      });
    }

    const cacheKey = req.originalUrl;
    const now = Date.now();

    // Parse clicked TMDB ID if present in the target path (e.g. movie/123 or tv/123/videos)
    const pathParts = targetPath.split('/');
    const isMovieOrTvDetails = (pathParts[0] === 'movie' || pathParts[0] === 'tv') && pathParts[1] && /^\d+$/.test(pathParts[1]);
    const clickedTmdbId = isMovieOrTvDetails ? pathParts[1] : null;
    const hasValidTmdbId = clickedTmdbId && !isMockId(clickedTmdbId);

    const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
    const tmdbUrl = `https://api.themoviedb.org/3/${targetPath}${queryParams ? `?${queryParams}` : ''}`;

    // If it is a mock ID, resolve directly from local mock database without hitting TMDB
    if (clickedTmdbId && isMockId(clickedTmdbId)) {
      console.log(`[TMDB Proxy] Mock ID detected (${clickedTmdbId}). Routing to mock engine...`);
      try {
        const fallbackData = handleMockRequest(targetPath, queryParamsObj);
        return res.json(fallbackData);
      } catch (mockErr: any) {
        return res.status(500).json({
          error: 'Mock data resolution failed',
          message: mockErr.message
        });
      }
    }

    // Serve from cache if available and not expired (Only cache live TMDB data)
    if (cache.has(cacheKey)) {
      const cachedItem = cache.get(cacheKey)!;
      if (now < cachedItem.expiry) {
        if (hasValidTmdbId) {
          console.log(`[TMDB Proxy] Serving cached TMDB response for ID: ${clickedTmdbId}, endpoint: ${targetPath}`);
        }
        return res.json(cachedItem.data);
      }
    }

    // Check circuit breaker first, BUT bypass it completely if we have a valid clickedTmdbId
    if (isTmdbOffline && !hasValidTmdbId) {
      if (now - lastFailureTime < CIRCUIT_BREAKER_COOLDOWN) {
        console.log(`[TMDB Proxy] Circuit breaker active. Bypassing live TMDB API for endpoint: ${targetPath}`);
        try {
          const fallbackData = handleMockRequest(targetPath, queryParamsObj);
          return res.json(fallbackData);
        } catch (mockErr: any) {
          return res.status(500).json({
            error: 'Internal server error',
            message: 'TMDB API is offline and local fallback engine failed',
            details: mockErr.message
          });
        }
      } else {
        isTmdbOffline = false;
        console.log('[TMDB Proxy] Circuit breaker cooldown passed. Resetting to online mode.');
      }
    }

    // If there is no token:
    if (!token) {
      const fallbackReason = 'TMDB Read Access Token is missing in environment variables';
      console.log('--- TMDB PROXY DETAIL ---');
      console.log(`clicked TMDB ID: ${clickedTmdbId || 'None'}`);
      console.log(`requested endpoint: ${tmdbUrl}`);
      console.log(`TMDB response status: No response (Token Detail)`);
      console.log(`fallback detail: ${fallbackReason}`);
      console.log('-------------------------');

      try {
        const fallbackData = handleMockRequest(targetPath, queryParamsObj);
        return res.json(fallbackData);
      } catch (mockErr: any) {
        return res.status(500).json({
          error: 'Missing TMDB Token & Fallback Engine failed',
          message: mockErr.message
        });
      }
    }

    // Make the live request to TMDB
    let responseData: any = null;
    let responseOk = false;
    let responseStatus: string | number = 'Unknown';
    let fallbackReason: string | null = null;
    const controller = new AbortController();
    // 10-second timeout to allow slower TMDB requests to finish without premature aborts
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      console.log(`[TMDB Proxy] Requesting live TMDB -> ${tmdbUrl}`);
      const response = await fetch(tmdbUrl, {
        method: req.method,
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      responseStatus = response.status;
      if (response.ok) {
        responseData = await response.json();
        responseOk = true;
      } else {
        const statusText = response.statusText || '';
        fallbackReason = `TMDB returned non-OK status ${response.status}: ${statusText}`;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      responseStatus = err.name === 'AbortError' ? 'offline/timeout' : 'offline/network';
      fallbackReason = 'offline status';
    }

    // Add console logging for: clicked TMDB ID, requested endpoint, TMDB response status, fallback reason
    console.log('--- TMDB PROXY LOGGING ---');
    console.log(`clicked TMDB ID: ${clickedTmdbId || 'None'}`);
    console.log(`requested endpoint: ${tmdbUrl}`);
    console.log(`TMDB response status: ${responseStatus}`);
    if (fallbackReason) {
      console.log(`fallback detail: ${fallbackReason}`);
    }
    console.log('--------------------------');

    // If successful, cache and return
    if (responseOk && responseData) {
      if (req.method === 'GET') {
        cache.set(cacheKey, {
          data: responseData,
          expiry: now + CACHE_TTL,
        });
      }
      return res.json(responseData);
    }

    // Trip circuit breaker on failure to prevent stalling subsequent general/list requests (only if not details path)
    if (!hasValidTmdbId) {
      isTmdbOffline = true;
      lastFailureTime = Date.now();
      console.log(`[TMDB Proxy] Tripped circuit breaker for non-details endpoint: ${targetPath}`);
    }

    // Fall back to high-fidelity mock dataset even for valid TMDB IDs if the live request is offline
    console.log(`[TMDB Proxy] TMDB live query unavailable (${responseStatus}). Serving from mock engine: ${targetPath}`);
    try {
      const fallbackData = handleMockRequest(targetPath, queryParamsObj);
      return res.json(fallbackData);
    } catch (mockErr: any) {
      if (hasValidTmdbId) {
        // If mock engine doesn't have data for this specific real ID, we construct a basic schema fallback
        console.log(`[TMDB Proxy] Mock engine status for ${targetPath}. Generating dynamic data...`);
        
        const isTv = targetPath.startsWith('tv/');
        const isVideos = targetPath.endsWith('/videos');
        const isCredits = targetPath.endsWith('/credits');
        const isSimilar = targetPath.endsWith('/similar') || targetPath.endsWith('/recommendations');
        const id = clickedTmdbId ? parseInt(clickedTmdbId, 10) : 99999;

        if (isVideos) {
          return res.json({
            id,
            results: [
              {
                id: 'trailer-fallback',
                key: 'dQw4w9WgXcQ',
                name: 'Official Trailer',
                site: 'YouTube',
                type: 'Trailer',
                official: true
              }
            ]
          });
        }

        if (isCredits) {
          return res.json({
            id,
            cast: [
              { id: 1, name: 'Lead Actor', character: 'Protagonist', profile_path: null },
              { id: 2, name: 'Supporting Actor', character: 'Antagonist', profile_path: null }
            ]
          });
        }

        if (isSimilar) {
          return res.json({
            page: 1,
            results: isTv ? [] : [], // Empty array is safe and valid
            total_pages: 1,
            total_results: 0
          });
        }

        // Default details fallback
        return res.json({
          id,
          title: isTv ? 'Cinematic TV Show' : 'Cinematic Movie',
          name: isTv ? 'Cinematic TV Show' : 'Cinematic Movie',
          overview: 'This title is temporarily unavailable due to a live TMDB connection timeout. Enjoy our offline catalog.',
          poster_path: '',
          backdrop_path: '',
          vote_average: 8.0,
          vote_count: 100,
          release_date: '2024-01-01',
          first_air_date: '2024-01-01',
          original_language: 'en',
          genres: [{ id: 18, name: 'Drama' }],
          runtime: 120,
          number_of_seasons: 1,
          number_of_episodes: 10,
        });
      }

      return res.status(500).json({
        error: 'Internal server error',
        message: 'Both TMDB API and local fallback engine failed',
        details: mockErr.message
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
