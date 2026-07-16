import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(`User-agent: *\nAllow: /\n\nSitemap: https://moviyfly.vercel.app/sitemap.xml\n`);
}
