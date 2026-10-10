import { structuredData } from '../src/lib/seo.js';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
const hash = createHash('sha256').update(structuredData).digest('base64');
const policy = `default-src 'self'; script-src 'self' 'sha256-${hash}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-src https://www.har.com https://har.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'; upgrade-insecure-requests`;
const cfg = {
  headers: [{ source: '/(.*)', headers: [
    { key: 'Content-Security-Policy', value: policy }, { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  ] }],
  rewrites: ['buy', 'sell', 'investment-properties', 'homes', 'market-reports', 'privacy', 'terms'].map(route => ({ source: '/' + route, destination: '/' + route + '/index.html' })),
};
fs.writeFileSync('vercel.json', JSON.stringify(cfg, null, 2) + '\n');
