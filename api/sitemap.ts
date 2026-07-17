import type { IncomingMessage, ServerResponse } from 'http';
import { 
  generateSitemapRegistry, 
  generateSitemapIndexXml,
  fetchMoviesFromTMDB,
  fetchTVsFromTMDB
} from '../src/lib/sitemap.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=43200, s-maxage=43200'); // Cache for 12 hours
    
    // Construct request base URL for accessing local or production proxy API routes
    const host = req.headers.host || 'moviyfly.vercel.app';
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const baseUrl = `${protocol}://${host}`;

    // Fetch movies and TV shows from real TMDB proxy
    const [movies, tvs] = await Promise.all([
      fetchMoviesFromTMDB(baseUrl),
      fetchTVsFromTMDB(baseUrl)
    ]);

    const urlObj = new URL(req.url || '', baseUrl);
    const sub = urlObj.searchParams.get('sub');

    const registry = generateSitemapRegistry(movies, tvs, { baseUrl });

    if (sub) {
      const filename = sub.endsWith('.xml') ? sub : `${sub}.xml`;
      const content = registry.getSitemapContent(filename);
      if (content) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(content);
        return;
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Sitemap not found');
        return;
      }
    }

    const indexXml = generateSitemapIndexXml(registry.index);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end(indexXml);
  } catch (err: any) {
    console.error('Error generating Vercel sitemap:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
}
