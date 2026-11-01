# Homes Around North Houston

Vite/React website for Homes Around North Houston / Golden Cross Realty, with website technology supplied by Golden Marketing Services.

## Development and checks

```sh
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Routes

- `/`: home, buyer/seller guidance, investment properties, communities, and email inquiry.
- `/buy`, `/sell`, `/investment-properties`: dedicated intent landing pages.
- `/homes`: Golden Cross Realty's existing HAR IDX search, account identifier 605032.
- `/market-reports`: links to HAR's published reports and local-analysis requests.
- `/privacy` and `/terms`: disclosures describing the implemented website behavior.

The build prerenders each known route with its own metadata and initial HTML, plus robots/sitemap/404 files. Vercel maps known routes to their HTML and returns 404 for unknown paths. Images and video remain under `public/`.

## Branding, disclosures, and IDX

`src/lib/siteConfig.js` centralizes the brokerage contact, technology disclosure, HAR destinations, and existing publicly hosted Golden Cross Realty disclosure PDFs. GMS is identified as the technology provider; Golden Cross Realty supplies brokerage services. Do not imply that GMS has its own MLS license or that this brokerage's authorization applies to other GMS customers.

The October 4 conversation “Assess GMS Pro MLS feasibility” (01a10937-fd50-76a3-9e4a-74fe820bc292) supplied the CINC technology/service disclosure example. The implemented wording adapts its role separation to GMS and Golden Cross Realty; it is not a claim of legal certification.

TREC references checked October 9, 2026:
- https://www.trec.texas.gov/link-iabs-form-required-my-website
- https://www.trec.texas.gov/node/941

HAR search is embedded directly, preserving HAR's listing attribution and presentation. Search filters use HAR's existing city, zip_code, subdivisions, listing_price_min, and listing_price_max parameters. A new-tab fallback is provided. This is the existing HAR IDX integration, not a new Repliers API implementation.

## Operational limitations

- This branch prepares GMS intake pending an approved campaign and readiness. Production continues using its email-draft form until intake is activated. See `docs/gms-lead-routing.md`.
- Market reports link to HAR's published source, not a live statistical API. Old unsourced market figures, inventory counts, uplift claims, and unverified testimonials were removed.
- Business-networking and local-service directories have been removed. The inquiry supports buying, selling, investment properties, and buying/selling together.
- The existing Golden Cross IABS is reused; the broker remains responsible for keeping its details current.
- The Vercel project currently lists Vercel aliases. Custom-domain cutover and multi-customer Repliers/vendor licensing are separate work.

## SEO, security and PPC readiness

See `docs/hardening-and-conversion-plan.md`. Run `node --test scripts/site-hardening.test.mjs` after building. `src/lib/seo.js` controls the canonical host and route metadata. Update the host and run `node scripts/security-config.mjs` when the custom domain is connected; the CSP hash must match the emitted structured data. External ad/analytics tags are intentionally disabled until accounts and consent configuration are verified.
