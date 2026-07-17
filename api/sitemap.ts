import type { IncomingMessage, ServerResponse } from 'http';
import { 
  generateSitemapRegistry, 
  generateSitemapIndexXml, 
  SAMPLE_MOVIES, 
  SAMPLE_TVS 
} from '../src/lib/sitemap.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=43200, s-maxage=43200'); // Cache for 12 hours
    const urlObj = new URL(req.url || '', 'https://moviyfly.vercel.app');
    const sub = urlObj.searchParams.get('sub');

    const registry = generateSitemapRegistry(SAMPLE_MOVIES, SAMPLE_TVS, {
      movieLimit: 3,
      tvLimit: 2,
    });

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
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
}
