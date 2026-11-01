import { structuredData } from '../src/lib/seo.js';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
// Refresh the JSON-LD hash without resetting existing CSP integrations, rewrites or headers.
const hash = createHash('sha256').update(structuredData).digest('base64');
const cfg = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const policyHeader = cfg.headers.flatMap(group => group.headers || []).find(header => header.key.toLowerCase() === 'content-security-policy');
if (!policyHeader || !/script-src[^;]*/.test(policyHeader.value)) throw new Error('Existing script-src policy is required.');
policyHeader.value = policyHeader.value.replace(/script-src[^;]*/, directive => {
 const withoutOldHash = directive.replace(/\s+'sha256-[A-Za-z0-9+/=]+'/g, '');
 return `${withoutOldHash} 'sha256-${hash}'`;
});
fs.writeFileSync('vercel.json', JSON.stringify(cfg, null, 2) + '\n');
console.log('Updated structured-data CSP hash; existing security configuration preserved.');
