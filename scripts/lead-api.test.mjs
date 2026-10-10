import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.js';
import { CONTACT_CONSENT_VERSION } from '../src/lib/contactConsent.js';

const originalFetch = globalThis.fetch;
const body = () => ({ name: 'Website Test', email: 'test@example.com', phone: '2025550100', interested_in: 'investing', consentAccepted: true, consentVersion: CONTACT_CONSENT_VERSION, formStartedAt: new Date(Date.now() - 5000).toISOString(), funnelProfile: { area: 'Conroe', budgetRange: '300000', workingWithAgent: 'yes' }, attribution: { utm_campaign: 'north-houston-test', gclid: 'synthetic-click-id', tenantId: 'foreign' }, tenantId: 'foreign', isTest: true });
async function invoke(payload = body(), extra = {}) {
  const res = { code: 0, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(value) { this.value = value; return this; } };
  await handler({ method: 'POST', headers: { origin: 'https://homes-around-north-houston-v1.vercel.app', 'content-type': 'application/json' }, body: payload, ...extra }, res);
  return res;
}
test('website intake enforces routing and receipt contract', async t => {
  process.env.LEAD_WEBHOOK_URL = 'https://example.invalid/intake';
  process.env.LEAD_WEBHOOK_TOKEN = 'test-only-token';
  process.env.GMS_LEAD_ROUTE_KEY = 'approved-website-route';
  let calls = 0, sent, headers;
  globalThis.fetch = async (_url, options) => { calls++; sent = JSON.parse(options.body); headers = options.headers; return { ok: true, status: 202, json: async () => ({ accepted: true, leadId: 'mock-reference' }) }; };
  try {
    await t.test('valid inquiry uses server route, keeps source/answers/permission, strips foreign ownership and test flag', async () => {
      const res = await invoke();
      assert.equal(res.code, 202); assert.equal(res.value.reference, 'mock-reference');
      assert.equal(headers['x-gms-route-key'], 'approved-website-route');
      assert.equal(sent.tenantId, undefined); assert.equal(sent.isTest, undefined);
      assert.equal(sent.attribution.tenantId, undefined); assert.equal(sent.attribution.sourceSite, 'homes-around-north-houston');
      assert.equal(sent.attribution.utm_campaign, 'north-houston-test'); assert.equal(sent.attribution.gclid, 'synthetic-click-id'); assert.equal(sent.funnelProfile.workingWithAgent, 'yes');
      assert.equal(sent.consent.smsAccepted, false); assert.equal(sent.qualificationStatus, undefined);
    });
    await t.test('foreign origins, missing consent, invalid phone, invalid interest and honeypot never reach GMS', async () => {
      const before = calls;
      assert.equal((await invoke(body(), { headers: { origin: 'https://foreign.example', 'content-type': 'application/json' } })).code, 403);
      for (const change of [{ consentAccepted: false }, { phone: '123' }, { interested_in: 'constructor' }, { website_check: 'spam' }]) assert.equal((await invoke({ ...body(), ...change })).code, 400);
      assert.equal(calls, before);
    });
    await t.test('missing configuration and paused GMS campaign do not display success', async () => {
      delete process.env.GMS_LEAD_ROUTE_KEY;
      assert.equal((await invoke()).code, 503);
      process.env.GMS_LEAD_ROUTE_KEY = 'approved-website-route';
      globalThis.fetch = async () => ({ status: 409 });
      assert.equal((await invoke()).code, 503);
    });
    await t.test('receipt without a persisted lead ID and uncertain transport do not display success', async () => {
      globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ accepted: true }) });
      assert.equal((await invoke()).code, 502);
      globalThis.fetch = async () => { throw new Error('timeout'); };
      assert.equal((await invoke()).code, 502);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of ['LEAD_WEBHOOK_URL', 'LEAD_WEBHOOK_TOKEN', 'GMS_LEAD_ROUTE_KEY']) delete process.env[key];
  }
});
