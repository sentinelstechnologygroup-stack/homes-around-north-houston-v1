# Website intake protection — October 22, 2026

## Implemented

`server/request-security.js` rejects oversized byte payloads, arrays, malformed JSON, prototype keys, excessively nested objects and incorrect content types. Public form routes retain fixed source-site/origin ownership, contact consent checks, honeypots and elapsed-time checks. Upstream redirects are rejected. Local limits return Retry-After and remain a cheap first layer.

The shared `gmsWebsiteIntakeGuard` HTTP function uses the existing GMS Firestore project and ingestion secret. Website servers send HMAC digests, not IP addresses or form contents. All function calls require the server-only ingestion token. Firestore transactions enforce site- and purpose-specific limits across Vercel instances:

- Generic contact capture: 10 requests / 10 minutes / source IP digest / site.
- Requested search emails: 8 / 10 minutes.
- Existing North Houston session updates: 180 / 10 minutes.
- Property search (when wired by the search API): 120 / minute.

Captures have an atomic claim keyed by site, purpose and submission UUID. A repeated identical confirmed request replays its original receipt without another provider send. Reusing a UUID for changed content is rejected. Provider timeouts/ambiguous responses become reconciliation holds, never automatic resends. Confirmed receipts cannot be downgraded by a late timeout callback. Session telemetry is rate-limited but not frozen behind capture idempotency.

## Deploy and activate (parent release owner)

1. Deploy only `Customer-Portal/firebase/search-intake`, entry point `gmsWebsiteIntakeGuard`, using the existing project `gms-prod-1089114348316`, region `us-central1`, Node22, existing GMS function service account and `GMS_INGESTION_KEY` secret. It sends no email/call/SMS itself.
2. Set website production variables `GMS_INTAKE_GUARD_URL` to that function's HTTPS URL, `GMS_INTAKE_GUARD_TOKEN` to the existing ingestion secret, and `GMS_INTAKE_GUARD_REQUIRED=true`. Never print/commit the token. Existing search intake credentials are also accepted as the token fallback.
3. Enable TTL on `expiresAt` for collection groups `websiteIntakeRateLimits` and `websiteIntakeClaims`. Rate records retain two windows; claims retain 90 days. Do not enable client reads for either collection; existing GMS catch-all rules deny unmatched collections. Verify deployed rules before activation. TTL deletes and requests use the existing Firestore/cloud account; no subscription/add-on is provisioned.
4. Deploy both websites only after the guard responds correctly. Required protection fails closed if misconfigured or unavailable.
5. Use approved synthetic contacts to prove one confirmed provider receipt, duplicate replay, correct GMS versus brokerage routing and call suppression. Do not contact unrelated visitors during acceptance.

## Operational controls

Review `websiteIntakeClaims` with `state=uncertain` and old `state=claimed` records. Reconcile against provider receipts before an administrator records a confirmed response; never clear/replay blindly. Configure monitoring/alerts on guard 503s and stale claims. A TTL expiration is retention, not automatic reconciliation.

Platform WAF can reject bursts before they consume function/database work. Suggested log-stage rules: GET `/api/idx` 120/min/IP, POST `/api/search-inquiry` 30/10min/IP, POST `/api/lead` 240/10min/IP for North Houston telemetry (30/10min for brokerage-only capture). Observe and tune before deny. No external firewall rules are changed by this source work.

## Human verification

Optional server-side Turnstile validation is prepared: setting `TURNSTILE_SECRET_KEY` makes token verification mandatory for new captures, with success, hostname and timeout validation. Do not set this secret before the frontend widget/site key is integrated; session telemetry is exempt. Without a configured secret, existing honeypot/elapsed-time/rate controls run, but they are not proof that a visitor is human. No new CAPTCHA account or paid product was provisioned.

## Verification

Pure guard tests cover concurrent duplicates, confirmed response replay, fingerprint conflicts, source isolation, rate-window expiry, wrong claim ownership and ambiguous-delivery holds. Website tests cover byte/depth/prototype rejection, HMAC privacy, required fail-closed behavior, Turnstile hostname verification, and handler-level one-send/idempotent replay for generic and matching-home forms. No live messages are sent by these tests.

## Release smoke check for the generic contact popup

Generic contact uses LEAD_WEBHOOK_URL / LEAD_WEBHOOK_TOKEN / GMS_LEAD_ROUTE_KEY independently of the matching-home email endpoint. A successful build or search-email test does not establish that this separate intake route is ready.

Run `node scripts/check-contact-intake.mjs --env-only` in the protected production build/release environment to fail on missing settings; run without `--env-only` as the release smoke check. Use deployment/CI-injected secrets. Sensitive Vercel production values cannot be pulled with the CLI; do not replace them with empty local values or put secrets in shell command arguments. This standalone check does not change the build command or contact visitors.

The smoke request contains only `{}` and the existing server authentication/route headers. Success means the backend passed authentication and route readiness and then rejected the deliberately absent contact details with HTTP 400. It creates no lead, message or call. HTTP 404/409 indicates an unavailable route/readiness gate; resolve legitimate readiness evidence without fabricating approval or removing safeguards. Output never prints tokens or request headers.

October 22 contact-popup investigation: all production settings were present. Historical ingestWebsiteLead HTTP 409 responses occurred at 21:00, 21:01 and 21:15 UTC, before the readiness evidence was renewed at 21:17:38 UTC. This timing supports the earlier screenshot's route-readiness failure, although historical logs do not retain its exact rejection body. Current controlled capture and completion both returned 202; the saved lead and notification were verified with communications suppressed and zero contact attempts. No approval or route flags were changed during diagnosis.
