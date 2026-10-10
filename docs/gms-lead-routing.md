# GMS lead routing — October 9, 2026

## Intended path

Website inquiry → GMS intake → phone-agent review, contact validation and qualification → approved Golden Cross Realty handoff.

The two-step form collects contact details, interest, optional area/budget/timeline and existing-agent status. It sends contact permission and site/UTM attribution to `/api/lead`. All ownership, campaign, staffing, script and qualification identifiers come from the authenticated GMS server route, never visitor input. Leads remain pending qualification. No SMS or automated-call permission is inferred. A reference is displayed only after GMS returns an accepted lead ID. No automatic retry after uncertain delivery.

## Server configuration

Set production-only `LEAD_WEBHOOK_URL` to the GMS `ingestWebsiteLead` endpoint, `LEAD_WEBHOOK_TOKEN` from the existing GMS Secret Manager ingestion secret, and `GMS_LEAD_ROUTE_KEY` to the approved Homes Around North Houston route. Optional `ALLOWED_ORIGINS` is a comma-separated exact origin list. Never use VITE-prefixed secrets. Give preview a separately approved test-only route/credentials, never the production route.

The SPA rewrite excludes `/api/` so functions remain reachable. Endpoint rejects missing configuration, foreign origin, invalid contact details, missing consent, honeypot submissions and invalid form timing. Phone/email contact verification still happens in GMS; these format checks do not verify a person.

## Verified launch blockers

Read-only production check on October 9:
- GCR onboarding revision 12 has lifecycle `draft`.
- Managed campaign `campaign-e5de6185` route is paused; name/script/qualification/consent fields are incomplete.
- Phone readiness is false; GHL readiness true but verification is stale.
- The legacy `golden-cross-beta` route exists and is active, but must not be used to bypass current managed onboarding controls or misattribute this site's leads.
- Production phone/AI handoff completion is not established by test-call success.

Resolve campaign choice, approved script/qualification/contact policy, staffing and renewed readiness through the existing GMS onboarding flow before deploying the form. Configure a dedicated source so attribution/lead-credit evidence distinguishes this website from other Golden Cross channels.

## HAR lead copies

HAR-owned embedded forms stay under HAR control and may send straight to the brokerage. The website cannot insert a CC into their email delivery. The signed-in member area encountered a human-verification challenge. Confirm the intended GMS recipient, then inspect HAR notification settings. If HAR has no additional-recipient setting, configure a narrowly scoped forwarding rule in the receiving brokerage mailbox with approval/access. Preserve HAR message/lead ID, original timestamp and website source when supplied; match duplicates before creating a GMS record. Notification is evidence of an inquiry, not evidence of qualification or billability. Do not claim attribution for source-unknown HAR leads.

No HAR CC/forwarding was configured and no real lead or outbound call was created in this change.

## Checks

`node --test scripts/lead-api.test.mjs`, build, lint and typecheck. HTTP integration tests use a local mock GMS endpoint and synthetic contact data; they do not establish live phone delivery.
