import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Defined static routes for build-time prerendering
const PRERENDER_ROUTES = [
  {
    path: '/',
    dir: '',
    title: 'MoviyFly - Stream Movies, TV Shows, Anime & K-Dramas',
    description: 'Discover trending movies, TV shows, anime and K-dramas on MoviyFly. Browse thousands of titles, explore new releases, and enjoy a modern entertainment discovery platform.',
    canonical: 'https://moviyfly.vercel.app/',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/home',
    dir: 'home',
    title: 'Explore Movies, TV Shows & Anime Library | MoviyFly',
    description: 'Browse popular movies, trending TV shows, anime and K-dramas. Discover thousands of titles on MoviyFly.',
    canonical: 'https://moviyfly.vercel.app/home',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/movies',
    dir: 'movies',
    title: 'All Movies - MoviyFly Cinema',
    description: 'Explore our extensive collection of Hollywood, Bollywood, South Indian, and world cinema hits on MoviyFly.',
    canonical: 'https://moviyfly.vercel.app/movies',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/tv',
    dir: 'tv',
    title: 'TV Shows & Series - MoviyFly OTT',
    description: 'Binge watch premium TV shows, anime series, and Korean dramas in high quality on MoviyFly.',
    canonical: 'https://moviyfly.vercel.app/tvshows',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/tvshows',
    dir: 'tvshows',
    title: 'TV Shows & Series - MoviyFly OTT',
    description: 'Binge watch premium TV shows, anime series, and Korean dramas in high quality on MoviyFly.',
    canonical: 'https://moviyfly.vercel.app/tvshows',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/anime',
    dir: 'anime',
    title: 'Watch Anime Series & Movies Online | MoviyFly',
    description: 'Stream top-rated anime series, movies, and trending Japanese animation in high quality on MoviyFly.',
    canonical: 'https://moviyfly.vercel.app/anime',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
  {
    path: '/search',
    dir: 'search',
    title: 'Search Movies & TV Shows - MoviyFly',
    description: 'Search the complete MoviyFly catalog for movies, TV series, actors, and directors.',
    canonical: 'https://moviyfly.vercel.app/search',
    ogImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200',
  },
];

function escapeHtml(str) {
  return str.replace(/"/g, '&quot;');
}

function generateRouteHtml(templateHtml, route) {
  let cleaned = templateHtml;

  // Remove placeholder / existing meta tags to prevent duplication
  cleaned = cleaned.replace(/<title>[^]*?<\/title>/gi, '');
  cleaned = cleaned.replace(/<meta[^>]*?name="description"[^>]*?\/?>/gi, '');
  cleaned = cleaned.replace(/<link[^>]*?rel="canonical"[^>]*?\/?>/gi, '');
  cleaned = cleaned.replace(/<meta[^>]*?property="og:[^"]*"[^>]*?\/?>/gi, '');
  cleaned = cleaned.replace(/<meta[^>]*?name="twitter:[^"]*"[^>]*?\/?>/gi, '');

  const metaBlock = `
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <link rel="canonical" href="${route.canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${route.canonical}" />
    <meta property="og:image" content="${route.ogImage}" />
    <meta property="og:site_name" content="MoviyFly" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${route.ogImage}" />
  `.trim();

  return cleaned.replace(/<head>/i, `<head>\n    ${metaBlock}`);
}

async function runPrerender() {
  console.log('⚡ Starting build-time static route prerendering...');

  if (!fs.existsSync(INDEX_HTML)) {
    console.error(`❌ Error: ${INDEX_HTML} not found. Run 'vite build' first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(INDEX_HTML, 'utf-8');

  for (const route of PRERENDER_ROUTES) {
    const prerenderedHtml = generateRouteHtml(templateHtml, route);

    if (route.dir === '') {
      // Root '/' route
      fs.writeFileSync(INDEX_HTML, prerenderedHtml, 'utf-8');
      console.log(`  ✅ Prerendered root route [/] -> dist/index.html`);
    } else {
      const targetDir = path.join(DIST_DIR, route.dir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Write dist/[dir]/index.html
      const indexPath = path.join(targetDir, 'index.html');
      fs.writeFileSync(indexPath, prerenderedHtml, 'utf-8');

      // Also write dist/[dir].html for static hosts
      const htmlFile = path.join(DIST_DIR, `${route.dir}.html`);
      fs.writeFileSync(htmlFile, prerenderedHtml, 'utf-8');

      console.log(`  ✅ Prerendered route [${route.path}] -> dist/${route.dir}/index.html & dist/${route.dir}.html`);
    }
  }

  console.log('🎉 Static route prerendering completed successfully!');
}

runPrerender();
