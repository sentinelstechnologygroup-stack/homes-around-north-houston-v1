# Homes Around North Houston

Vite/React website for Jonathan Currey / Golden Cross Realty, with website technology supplied by Golden Marketing Services.

## Development and checks

```sh
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Routes

- `/`: home, buyer/seller resources, communities, local resources, and email inquiry.
- `/homes`: Jonathan's existing HAR IDX search, account identifier 605032.
- `/market-reports`: links to HAR's published reports and local-analysis requests.
- `/privacy` and `/terms`: disclosures describing the implemented website behavior.

Vercel's SPA rewrite supports direct navigation and refreshes on these routes. Images and video remain under `public/`.

## Branding, disclosures, and IDX

`src/lib/siteConfig.js` centralizes the brokerage contact, technology disclosure, HAR destinations, and existing publicly hosted Golden Cross Realty disclosure PDFs. GMS is identified as the technology provider; Golden Cross Realty supplies brokerage services. Do not imply that GMS has its own MLS license or that Jonathan's authorization applies to other GMS customers.

The October 4 conversation “Assess GMS Pro MLS feasibility” (01a10937-fd50-76a3-9e4a-74fe820bc292) supplied the CINC technology/service disclosure example. The implemented wording adapts its role separation to GMS and Golden Cross Realty; it is not a claim of legal certification.

TREC references checked October 9, 2026:
- https://www.trec.texas.gov/link-iabs-form-required-my-website
- https://www.trec.texas.gov/node/941

HAR search is embedded directly, preserving HAR's listing attribution and presentation. Search filters use HAR's existing city, zip_code, subdivisions, listing_price_min, and listing_price_max parameters. A new-tab fallback is provided. This is the existing HAR IDX integration, not a new Repliers API implementation.

## Operational limitations

- The inquiry form prepares an email to Broker@GoldenCrossRealty.com; the visitor must send it. No GMS CRM ingestion or automatic email delivery is implemented here.
- Market reports link to HAR's published source, not a live statistical API. Old unsourced market figures, inventory counts, uplift claims, and unverified testimonials were removed.
- Local resources are categories rather than a verified provider directory.
- The existing Golden Cross IABS is reused; the broker remains responsible for keeping its details current.
- The Vercel project currently lists Vercel aliases. Custom-domain cutover and multi-customer Repliers/vendor licensing are separate work.
