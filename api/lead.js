import { createHash } from 'node:crypto';
import { CONTACT_CONSENT_TEXT, CONTACT_CONSENT_VERSION } from '../src/lib/contactConsent.js';

const clean = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const interests = { buying: 'Buying', selling: 'Selling', investing: 'Investment Properties', buying_and_selling: 'Buying & Selling' };
// Best-effort per-instance throttling; configure platform rate limits before launch.
const attempts = new Map();
function throttled(req) {
  const ip = clean(String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0], 100);
  const now = Date.now();
  for (const [key, entry] of attempts) if (now - entry.started > 600000) attempts.delete(key);
  const entry = attempts.get(ip) || { started: now, count: 0 };
  entry.count++;
  if (attempts.size >= 2000 && !attempts.has(ip)) return true;
  attempts.set(ip, entry);
  return entry.count > 10;
}
const allowedOrigins = ['https://homes-around-north-houston-v1.vercel.app', 'https://homesaroundnorthhouston.com', 'https://www.homesaroundnorthhouston.com'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const origins = (process.env.ALLOWED_ORIGINS || allowedOrigins.join(',')).split(',').map(item => item.trim());
  if (!req.headers.origin || !origins.includes(req.headers.origin)) return res.status(403).json({ error: 'Origin not allowed' });
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({ error: 'JSON required' });
  if (throttled(req)) return res.status(429).json({ error: 'Please wait before submitting another inquiry.' });
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid request' }); }
  }
  if (!body || typeof body !== 'object' || JSON.stringify(body).length > 20000) return res.status(400).json({ error: 'Invalid request' });
  if (clean(body.website_check)) return res.status(400).json({ error: 'Invalid request' });
  const submissionId = clean(body.submissionId, 80);
  if (!/^[a-f0-9-]{36}$/i.test(submissionId)) return res.status(400).json({ error: 'Please reload the page and try again.' });
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 40);
  const interest = Object.hasOwn(interests, body.interested_in) ? interests[body.interested_in] : '';
  const digits = phone.replace(/\D/g, '');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || digits.length < 10 || digits.length > 15 || !interest) {
    return res.status(400).json({ error: 'Enter your name, valid email and phone number, and interest.' });
  }
  if (body.consentAccepted !== true || body.consentVersion !== CONTACT_CONSENT_VERSION) return res.status(400).json({ error: 'Contact permission is required.' });
  const started = Date.parse(body.formStartedAt);
  const elapsed = Date.now() - started;
  if (!Number.isFinite(elapsed) || elapsed < 1500 || elapsed > 86400000) return res.status(400).json({ error: 'Please reload the page and try again.' });
  const webhook = process.env.LEAD_WEBHOOK_URL;
  const token = process.env.LEAD_WEBHOOK_TOKEN;
  const route = process.env.GMS_LEAD_ROUTE_KEY;
  if (!webhook || !token || !route) return res.status(503).json({ error: 'Online inquiries are not available yet. Please try again later.' });
  const now = new Date().toISOString();
  const goals = body.funnelProfile || {};
  const attribution = { sourceSite: 'homes-around-north-houston', channel: 'website', provider: 'GMS Pro', inquiryType: body.interested_in };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid']) attribution[key] = clean(body.attribution?.[key], 200);
  const lead = {
    weeklyListingPreferencePresented: body.weeklyListingPreferencePresented === true,
    weeklyListingEmailsRequested: body.weeklyListingPreferencePresented === true && body.weeklyListingEmailsRequested === true,
    submissionId, name, email, phone: digits.length === 10 ? `+1${digits}` : `+${digits}`, market: clean(goals.area, 200) || 'North Houston',
    services: [interest], sources: ['Homes Around North Houston website'],
    notes: `Interest: ${interest}\n${clean(body.message, 2000)}`,
    pageUrl: `${req.headers.origin}/`, submittedAt: now, attribution,
    consent: { accepted: true, version: CONTACT_CONSENT_VERSION, text: CONTACT_CONSENT_TEXT, capturedAt: now, channels: ['phone', 'email'], smsAccepted: false },
    funnelProfile: {
      area: clean(goals.area, 200), budgetRange: clean(goals.budgetRange, 100), timeline: clean(goals.timeline, 100),
      propertyType: clean(goals.propertyType, 100), workingWithAgent: clean(goals.workingWithAgent, 30), financingStatus: clean(goals.financingStatus, 100),
      completionStatus: 'completed',
    },
  };
  try {
    const upstream = await fetch(webhook, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-gms-route-key': route, 'idempotency-key': createHash('sha256').update(`${route}:${submissionId}`).digest('hex') },
      body: JSON.stringify(lead), signal: AbortSignal.timeout(12000),
    });
    if (upstream.status === 409 || upstream.status === 404) return res.status(503).json({ error: 'Online inquiries are not available yet. Please try again later.' });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.accepted !== true || !result.leadId) throw new Error('Intake not confirmed');
    return res.status(202).json({ accepted: true, reference: result.leadId });
  } catch {
    return res.status(502).json({ error: 'We could not confirm receipt. Please contact GMS Pro before submitting again.' });
  }
}
