import {parseRequestBody,localRate,beginIntake,finishIntake,uncertainIntake,verifyBotToken,sendRequestError,RequestError} from '../server/request-security.js';
import { createHash } from 'node:crypto';
import { CONTACT_CONSENT_TEXT, CONTACT_CONSENT_VERSION } from '../src/lib/contactConsent.js';

const clean = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const interests = { buying: 'Buying', selling: 'Selling', investing: 'Investment Properties', buying_and_selling: 'Buying & Selling' };
export const config = { maxDuration: 120 };
const allowedOrigins = ['https://homes-around-north-houston-v1.vercel.app', 'https://homesaroundnorthhouston.com', 'https://www.homesaroundnorthhouston.com'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const origins = (process.env.ALLOWED_ORIGINS || allowedOrigins.join(',')).split(',').map(item => item.trim());
  if(process.env.VERCEL_ENV==='preview' && process.env.VERCEL_URL) origins.push('https://'+process.env.VERCEL_URL);
  if (!req.headers.origin || !origins.includes(req.headers.origin)) return res.status(403).json({ error: 'Origin not allowed' });
  let body;
  try { body=parseRequestBody(req,20000);const activity=['active','hidden','exit','complete','verify_email','verify_sms'].includes(body.funnelAction);localRate(req,activity?'lead-session':'lead-capture',activity?180:10); } catch(error){return sendRequestError(res,error);}
  if (clean(body.website_check)) return res.status(400).json({ error: 'Invalid request' });
  if (['active','hidden','exit','complete','verify_email','verify_sms'].includes(body.funnelAction)) {
    if (!/^[a-f0-9]{64}$/.test(body.sessionId || '') || !/^[a-f0-9]{64}$/.test(body.sessionToken || '')) return res.status(400).json({ error: 'Invalid session' });
    const goals = { ...(body.searchCriteria || {}), ...(body.property ? {boardId:body.property.boardId,mlsNumber:body.property.mlsNumber,propertyAddress:body.property.address} : {}), ...(body.funnelProfile || {}) };
    const funnelProfile = Object.fromEntries(['area','city','zip','neighborhood','minPrice','maxPrice','location','beds','baths','propertyType','bounds','polygon','availability','minSqft','waterfront','newListings','boardId','mlsNumber','propertyAddress','inquiryContext','budgetRange','timeline','workingWithAgent'].map(key => [key, clean(goals[key],key==='polygon'?6000:200)]));
    funnelProfile.interested_in = Object.hasOwn(interests, goals.interested_in) ? goals.interested_in : '';
    funnelProfile.message = clean(goals.message, 2000);
    funnelProfile.weeklyListingPreferencePresented = goals.weeklyListingPreferencePresented === true;
    funnelProfile.weeklyListingEmailsRequested = goals.weeklyListingPreferencePresented === true && goals.weeklyListingEmailsRequested === true;
    return forward({ funnelAction: body.funnelAction, sessionId: body.sessionId, sessionToken: body.sessionToken, funnelProfile, funnelTelemetry: body.funnelTelemetry }, res, req.headers.origin, req, body);
  }
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
  const goals = { ...(body.searchCriteria || {}), ...(body.property ? {boardId:body.property.boardId,mlsNumber:body.property.mlsNumber,propertyAddress:body.property.address} : {}), ...(body.funnelProfile || {}) };
  const attribution = { sourceSite: 'homes-around-north-houston', channel: 'website', provider: 'GMS Pro', inquiryType: body.interested_in };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'cta', 'campaign']) attribution[key] = clean(body.attribution?.[key], 200);
  const lead = {
    weeklyListingPreferencePresented: body.weeklyListingPreferencePresented === true,
    weeklyListingEmailsRequested: body.weeklyListingPreferencePresented === true && body.weeklyListingEmailsRequested === true,
    submissionId, name, email, phone: digits.length === 10 ? `+1${digits}` : `+${digits}`, market: clean(goals.area, 200) || 'North Houston',
    services: [interest], sources: ['Homes Around North Houston website'],
    notes: `Interest: ${interest}\n${clean(body.message, 2000)}\nSearch/property context: ${JSON.stringify(Object.fromEntries(['location','city','zip','minPrice','maxPrice','beds','baths','boardId','mlsNumber','propertyAddress'].map(key=>[key,clean(goals[key],key==='polygon'?6000:200)]).filter(([,value])=>value)))}`,
    pageUrl: `${req.headers.origin}/`, submittedAt: now, attribution,
    consent: { accepted: true, version: CONTACT_CONSENT_VERSION, text: CONTACT_CONSENT_TEXT, capturedAt: now, channels: ['phone', 'email'], smsAccepted: false },
    funnelProfile: {
      area: clean(goals.area, 200), budgetRange: clean(goals.budgetRange, 100), timeline: clean(goals.timeline, 100),
      propertyType: clean(goals.propertyType, 100), workingWithAgent: clean(goals.workingWithAgent, 30), financingStatus: clean(goals.financingStatus, 100),
      ...Object.fromEntries(['city','zip','neighborhood','minPrice','maxPrice','location','beds','baths','propertyType','bounds','polygon','availability','minSqft','waterfront','newListings','boardId','mlsNumber','propertyAddress','inquiryContext'].map(key => [key, clean(goals[key],key==='polygon'?6000:200)])),
      completionStatus: body.funnelAction === 'capture' ? 'contact_captured' : 'completed',
    },
  };
  if (body.funnelAction === 'capture') { lead.funnelAction = 'capture'; lead.funnelTelemetry = body.funnelTelemetry; }
  return forward(lead, res, req.headers.origin, req, body);
}

async function forward(lead, res, origin, req, body) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  const token = process.env.LEAD_WEBHOOK_TOKEN;
  const route = process.env.GMS_LEAD_ROUTE_KEY;
  if (!webhook || !token || !route) return res.status(503).json({ error: 'Online inquiries are not available yet. Please try again later.' });
  // Only server configuration can enable fixtures; a browser test flag is ignored.
  const controlledPreview = process.env.GMS_INTAKE_TEST_ONLY === 'true' && process.env.VERCEL_ENV === 'preview';
  if (process.env.GMS_INTAKE_TEST_ONLY === 'true') {
    if (!controlledPreview) return res.status(503).json({ error: 'Controlled intake is available only in the preview.' });
    lead.isTest = true;
  }
  let guard;
  try {
    const session=!lead.submissionId;if(!session)await verifyBotToken(body,origin);
    guard=await beginIntake(req,{site:'north',scope:session?'session':'lead',body,submissionId:lead.submissionId,rateOnly:session});if(guard.replay)return res.status(guard.replay.status).json(guard.replay.body);
    const upstream = await fetch(webhook, {
      method: 'POST', redirect:'error', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-gms-route-key': route, ...(controlledPreview ? {'x-gms-preview-origin': origin} : {}), 'idempotency-key': createHash('sha256').update(`${route}:${lead.submissionId || lead.sessionId}`).digest('hex') },
      body: JSON.stringify(lead), signal: AbortSignal.timeout(controlledPreview ? 105000 : 12000),
    });
    if (upstream.status === 409 || upstream.status === 404) {await uncertainIntake(guard);return res.status(503).json({ error: 'Online inquiries are not available yet. Please try again later.' });}
    const result = await upstream.json().catch(() => ({}));
    if (controlledPreview && upstream.status === 403) {await uncertainIntake(guard);return res.status(403).json({ error: 'Controlled preview: use the designated test email. This test may also have expired.' });}
    if (!upstream.ok || result.accepted !== true || !result.leadId) throw new Error('Intake not confirmed');
    const receipt={ accepted: true, reference: result.leadId,...(lead.funnelAction ? { sessionId: result.sessionId, sessionToken: result.sessionToken, state: result.state } : {}) };
    await finishIntake(guard,'complete',{status:202,body:receipt});return res.status(202).json(receipt);
  } catch(error) {await uncertainIntake(guard);if(error instanceof RequestError)return sendRequestError(res,error);
    return res.status(502).json({ error: 'We could not confirm receipt. Please contact the Golden Cross Realty office before submitting again.' });
  }
}
