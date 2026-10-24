# HAR connection review — October 20, 2026

Protected preview branch: codex/har-repliers-preview. Both broker keys confirmed HAR-BRIDGE board 147, VOW, partialAccess=false. Active listing permissions were checked against the live API. No key value is retained in this repository.

REPLIERS_API_KEY is a sensitive, server-only Vercel preview variable scoped to this branch. Shared server policy originates from the existing Golden Cross Realty pilot and fails closed for unknown/denied display permissions. This review permits only active MLS 65562436 and 12901218 on board 147, on the immutable Vercel preview hostname with VERCEL_ENV=preview. Vercel Authentication remains enabled; public activation/acceptance flags are false. The card projection excludes raw provider fields, private remarks and history. HRIS board disclaimer is configured verbatim. Existing HAR search remains available during acceptance.

/homes shows a small connection-review panel when the API config is enabled. This is not the finished map/search redesign. Listing images are allowed only from the Repliers CDN under the existing CSP. No lead intake credentials are changed and no inquiries, alerts or messages are sent by these checks.

Client approval, full custom map/search features, registration policy, shared rate limiting, end-to-end GMS handoff acceptance and domain launch remain pending. Per-listing permissions must always be enforced even though the feed is labeled VOW; the tested records returned displayPublic=Y. Do not generalize that to other records or publish them outside the approved workflow.

Run node --test tests/repliers.test.mjs plus npm run lint and npm run build. Verify /api/idx?action=config, /api/idx and an out-of-scope listing against the protected deployed preview; anonymous access should remain protected. Production API is off by default and receives no credential from this setup.
