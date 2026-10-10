# Hardening and conversion pass — October 9, 2026

## Delivery scope

This pass improves the independent production website without activating the unfinished GMS lead workflow. A polished landing page is not evidence of qualified-lead production. The highest-priority launch requirement remains website → saved GMS lead → phone verification → approved brokerage handoff, with evidence retained at each stage.

## Implemented baseline

- Distinct buyer, seller and investment-property landing pages with corresponding navigation and inquiry intent.
- Build-time HTML for eight routes, unique titles/descriptions/canonicals, social metadata, WebSite/RealEstateAgent structured data, robots.txt and sitemap.xml.
- Canonical URLs use the currently working Vercel host. The requested custom domain returned 404 and was not attached to this project; no DNS or domain changes were made.
- Removed broad SPA fallback so nonexistent URLs can return real HTTP 404 rather than soft 404.
- Restrictive CSP for scripts and HAR frames, structured-data hash, anti-framing and MIME-sniffing headers, referrer and browser-permission policies. Inline styles remain allowed for existing React/animation styling. External advertising scripts are not allowlisted until specific accounts and consent behavior are verified.
- WebP derivatives reduced the referenced image set from 20,014,117 to 2,050,996 bytes (about 90%). Original assets preserved. Below-fold images lazy-load; hero image preloads and background video loads only on request.
- Tailwind and React Router upgrades plus compatible dependency fixes. Final npm audit and production-dependency audit report zero known advisories at the time of this pass. This is not a penetration-test certification.
- Keyboard skip link, visible focus states, reduced-motion CSS, improved hero-button contrast and header offset for anchored sections.
- Vercel intake-path logging rule prepared and published through the dashboard. This is observation, not an enforced distributed submission limit. No global bot challenge or geographic block was applied.

## Remaining conversion work, in order

1. Complete the approved GMS campaign, script, qualification criteria, staffing, consent policy and phone readiness. Activate the prepared intake only after a synthetic submission appears under the correct site source, tenant, campaign and queue. Prove actual callback and handoff with a consenting test recipient. A mailto draft is not a conversion.
2. Replace the main-site email draft with the prepared two-step GMS form. Add a property address for seller inquiries and buying/selling-specific questions only where they help the phone agent; do not turn the first step into a long questionnaire. Carry working-with-agent answers into review without making automated eligibility decisions.
3. Make the buyer, seller and investment landing experiences self-contained for paid traffic once intake is ready. Place the compact form beside the offer rather than making visitors scroll through the full homepage. Add a mobile next-step CTA after measuring its effect on readability and form completion.
4. Use verified brokerage photos, authorized testimonials and actual examples of service. Collect real trust evidence rather than invent ratings, savings, sales counts or performance claims. Add short answers to common questions and explain what the visitor receives after requesting help.
5. Expand a small set of useful local guides with current, cited information and distinct buyer/seller usefulness. Do not mass-produce thin city pages or imply expertise/resources that have not been provided.
6. Confirm realistic response coverage and escalation. Monitor inquiry acceptance, first attempt, successful contact, qualification, accepted handoff, appointment and closing separately. Follow existing GMS policy before any billing or lead-credit decision.

## SEO activation

Connect the final domain after confirming its intended cutover. Update SITE_ORIGIN in src/lib/seo.js and the social-image host in index.html, regenerate the CSP hash with node scripts/security-config.mjs, rebuild and verify HTTPS/canonicals/redirects/sitemap. Choose one preferred hostname and redirect secondary aliases while preserving paths and advertising query parameters. Verify Search Console ownership and submit the final sitemap. Check URL inspection, rendered HTML, indexing exclusions and crawl errors. The site-owned content is rendered; the HAR iframe does not create owned, indexable listing-detail pages.

Measure mobile LCP/INP/CLS on real devices and field data. Reduced asset weight is not a measured Core Web Vitals score. Validate HAR usability on mobile, accessibility, ad-crawler fetches and image/structured-data results before claiming compliance or rankings.

## PPC measurement and campaign controls

- Existing GA4/GTM, Google Ads and Meta account/pixel selections remain unanswered. No ad spend, campaign, pixel, tag container or customer-data upload was activated.
- Preserve UTMs and click IDs (gclid, gbraid, wbraid and supported Meta attribution) with the saved GMS lead. Keep original source and later touch separate. Never put names, emails, phone numbers or free-text answers in URLs or analytics event parameters.
- Event contract: landing_view and inquiry_start are observations; inquiry_submitted fires only after a saved GMS receipt; contact_verified, qualified_lead, handoff_accepted and appointment_booked originate from authoritative backend workflow transitions. Do not let the browser declare qualification or count the same lead twice.
- Configure consent before activating external advertising/analytics tags; contact permission is separate from analytics/advertising consent. No SMS or automated-call permission is inferred from a phone field.
- Use Google Ads Data Manager/enhanced conversions for leads when the account and consent model are configured. Verify diagnostics, deduplication, timestamps, opt-outs and feedback from accepted qualified leads. Do not optimize solely for clicks or raw form starts.
- Match each ad group to the right intent page and offer. Review search terms/negative keywords and service geography. Avoid excluding genuine buyers looking for the property categories offered. Use location settings intentionally, including relocation demand where appropriate.
- US housing ads require restricted demographic/ZIP targeting behavior. Review Google’s housing rules and Meta’s current Housing category in the live ad accounts before launch. Website ZIP search is separate from advertising audience targeting.
- Establish delivery/error monitoring and a rollback/pause owner. Pause campaigns if intake or follow-up cannot accept leads. No paid campaign should launch against the current email-draft form.

## Security completion

Before activating public intake, enforce a tuned distributed rate limit on POST /api/lead after observing legitimate behavior. The draft’s in-memory throttle is only per-instance. Add provider-verified bot protection if abuse warrants it, without blanket challenges that block legitimate ad crawlers/search engines. Verify secret isolation, rejection of visitor-supplied ownership, payload bounds, malformed inputs, upstream timeout ambiguity, durable idempotency and duplicate handling across retries. Alerts and a durable receipt/recovery path are needed for uncertain upstream delivery; currently the prepared form does not auto-retry.

Retain existing GMS tenant permissions and workflow launch checks. Test actual CRM handoff access, exports, notifications and audit history. The HAR notification-copy work remains deferred until Patrick can complete its human-verification challenge. Match HAR lead IDs/source evidence before attributing credit; a copied message is not proof of qualification.

## Validation and primary sources

Build, lint, typecheck, dependency audits and three prerender/security checks. Browser checks cover landing navigation, inquiry intent, mobile menu/overflow and runtime errors. Production verification checks routes, metadata, discovery files, headers and missing-path status. These checks do not establish ad-account configuration, live calling or third-party provider uptime.

- Google JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google offline conversions/Data Manager: https://support.google.com/google-ads/answer/2998031
- Google housing advertising restrictions: https://support.google.com/adspolicy/answer/16701755
- Vercel security headers: https://vercel.com/docs/cdn-security/security-headers
- Vercel rate limiting: https://vercel.com/kb/guide/add-rate-limiting-vercel
- Tailwind upgrade guidance: https://tailwindcss.com/docs/upgrade-guide
