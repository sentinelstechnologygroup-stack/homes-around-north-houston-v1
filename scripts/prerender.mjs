import fs from 'node:fs/promises';
import path from 'node:path';
import { render } from '../.prerender/entry-server.js';
import { SITE_ORIGIN, pages, pageMetadata, structuredData } from '../src/lib/seo.js';
const template = await fs.readFile('dist/index.html', 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const route of [...Object.keys(pages), '/404']) {
  const metadata = pageMetadata(route);
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(metadata.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(metadata.description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escape(metadata.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(metadata.description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${SITE_ORIGIN}${route === '/' ? '/' : route}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${SITE_ORIGIN}${route === '/' ? '/' : route}" />`)
    .replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${metadata.noindex ? 'noindex,follow' : 'index,follow'}" />`)
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
    .replace('</head>', `<script type="application/ld+json">${structuredData}</script></head>`);
  if (route !== '/') html = html.replace(/<link rel="preload" as="image"[^>]*>/, '');
  const target = route === '/' ? 'dist/index.html' : route === '/404' ? 'dist/404.html' : `dist${route}/index.html`;
  await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, html);
}
await fs.writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
await fs.writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(route => `<url><loc>${SITE_ORIGIN}${route === '/' ? '/' : route}</loc></url>`).join('')}</urlset>\n`);
console.log(`Prerendered ${Object.keys(pages).length} pages and the 404 page.`);
