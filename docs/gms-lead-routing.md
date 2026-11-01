# GMS lead routing — October 10, 2026

Website inquiry → GMS phone-agent queue → documented identity/contact verification and customer-approved qualification → Golden Cross Realty consultation and handoff, or callback.

## Completed preparation

- Two-step website form collects contact information and buying, selling or investment-property goals. The server fixes ownership, campaign, source and contact-permission evidence; visitor ownership and test flags are ignored.
- Stable submission reference and durable Firestore receipt protect retries. Lead, audit and phone-agent notification commit atomically. Per-contact throttling is enforced in Firestore in addition to best-effort website throttling.
- GCR onboarding revision 13 now includes the Homes Around North Houston campaign, existing broker-review questions, phone script, permission text, website copy and a draft review packet in the client cabinet. Existing staff and brokerage call tree were preserved. The campaign remains paused; no client approval was fabricated.
- Production-only Vercel variables are configured: LEAD_WEBHOOK_URL, sensitive LEAD_WEBHOOK_TOKEN, GMS_LEAD_ROUTE_KEY. Preview receives no production intake credential.
- Qualification guards reject drafts, absent scoring rules, incomplete required answers and missing manual identity/conversation evidence. A manually entered disposition cannot certify a provider transfer. Callbacks remain available without passing qualification.

## Remaining activation requirements

1. Golden Cross Realty reviews and approves the current campaign and confirms its actual qualification rubric, pass threshold or approved non-scored assessment method, three requalification checkpoints, callback expectations and contractual handoff acceptance criteria. The existing 15-question draft is not an approved billability rule.
2. Renew GHL verification and complete attended phone/conference tests, including two-way audio, hold/resume, recipient consultation/acceptance, no-answer fallback and call completion. Provider configuration alone does not establish verified audio.
3. Enable the managed campaign only through the normal readiness-gated onboarding flow. Do not substitute the legacy beta route.
4. Deploy/promote the website intake after operational readiness. Until then the current public website retains its existing contact behavior; the draft branch is reviewable.
5. Configure conversion analytics, operational response coverage and provider retention/cleanup for intake rate-limit documents before paid traffic. CAPTCHA remains deferred by the user. Format checks are not human verification.

Repliers integration, provider-controlled lead-copy settings and domain launch remain pending. No real prospect, outbound phone call, SMS or brokerage notification was created by this work.

## Verification

Website handler and hardening tests; production build; actual HTTP website API → GMS ingestion → Firestore emulator persistence → receipt test; concurrent retries; paused-route failure; qualification/handoff gate tests; onboarding and existing Agent/Customer bridge regressions. Emulator success does not establish production phone delivery.
