import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SITE_ORIGIN, pages, structuredData } from '../src/lib/seo.js';
test('every indexable route serves distinct metadata and meaningful initial HTML', async () => {
  const titles = new Set();
  for (const [route, metadata] of Object.entries(pages)) {
    const html = await fs.readFile(route === '/' ? 'dist/index.html' : `dist${route}/index.html`, 'utf8');
    assert.ok(html.includes(`<title>${metadata.title.replaceAll("&", "&amp;")}</title>`));
    assert.ok(html.includes(`href="${SITE_ORIGIN}${route === '/' ? '/' : route}"`));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(html.includes('Golden Cross Realty')); assert.ok(html.includes('id="main-content"'));
    assert.ok(!html.includes('https://HomesAroundNorthHouston.com'));
    titles.add(metadata.title);
  }
  assert.equal(titles.size, Object.keys(pages).length);
});
test('CSP accepts only the exact structured-data hash and preserves HAR framing', async () => {
  const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
  const policy = config.headers[0].headers.find(item => item.key === 'Content-Security-Policy').value;
  assert.ok(policy.includes(`'sha256-${createHash('sha256').update(structuredData).digest('base64')}'`));
  assert.ok(policy.includes("script-src 'self'")); assert.ok(!/script-src[^;]*unsafe-(inline|eval)/.test(policy));
  assert.ok(policy.includes('frame-src https://www.har.com')); assert.ok(policy.includes("frame-ancestors 'none'"));
  assert.ok(!config.rewrites.some(item => item.source.includes('(.*)')));
});
test('discovery files and not-found markup are present; video is opt-in', async () => {
  const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(pages).length);
  assert.ok((await fs.readFile('dist/robots.txt', 'utf8')).includes('/sitemap.xml'));
  assert.ok((await fs.readFile('dist/404.html', 'utf8')).includes('noindex,follow'));
  const homepage = await fs.readFile('dist/index.html', 'utf8');
  assert.ok(!homepage.includes('<video')); assert.ok(homepage.includes('north-houston-hero.webp'));
});
