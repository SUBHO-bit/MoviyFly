import * as React from 'react';

export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
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
}
