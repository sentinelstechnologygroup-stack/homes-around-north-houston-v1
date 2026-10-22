# Launch review — October 22, 2026

## Code and deployment verification

- [ ] Deploy the reviewed commit to each existing project; verify the custom host serves that commit.
- [ ] Verify open search, sorting, pagination, drawing/clear/reset, geographic outlines, map thumbnail previews, saved-home sign-in, and property pages on desktop and mobile.
- [ ] Run a clearly labeled controlled inquiry. North Houston must route through GMS; Golden Cross must route directly to broker@goldencrossrealty.com. Verify receipt, search-link email, unsubscribe, and downstream record. Calls remain pending client approval.
- [ ] Verify configured GA4/GTM, Google Ads conversion and Meta IDs with consent denied and granted. Prevent duplicate conversions and exclude controlled tests. Source-code integration alone does not prove account configuration or delivery.
- [ ] Check HTTPS, robots.txt, sitemap.xml, canonical tags, real 404 response, verification route, and Search Console ownership/submission.
- [ ] Review branding, brokerage disclosures, data attribution, privacy and terms with the client/broker.

## Domain cutover — external release steps

- [ ] Attach GoldenCrossRealty.com and www to the intended new project and confirm DNS/TLS. Existing .com currently serves the earlier site; canonical preparation does not migrate it.
- [ ] Verify .com search, inquiries, sign-in links and email URLs before enabling .net and www redirects. Preserve paths and query parameters. Do not alter mail DNS.
- [ ] Activate the separately prepared host redirects only after .com is healthy; test one-hop redirects without loops. The supplied cutover preparation command does not activate anything.
- [ ] Keep Homes Around North Houston canonical at https://www.homesaroundnorthhouston.com and validate its apex redirect.

## Broker policy and inventory scope — not code defects

Public search must remain within the licensed public-display inventory and field permissions. A HAR portal count can include statuses, property classes, geography, timing or restricted inventory unavailable for public display. Compare equivalent filters, status definitions and update times; do not promise identical counts by exposing restricted VOW records.

Before restricted VOW features are enabled, the broker must approve the lawful broker-consumer relationship/disclosure flow, real name, verified email, affirmative terms, unique identity, definite access expiry/renewal, and required audit retention. Current HAR rules require retention at least 180 days after access expiry; do not assume a universal 90-day expiry. Resolve HAR's legacy credential-record language with a secure managed-auth approach; never store plaintext passwords. Confirm both domains and vendor authorization in the licensing agreement.

Source: [HAR MLS Rules, section 19.3](https://content.harstatic.com/mls/pdf/MLSRules.pdf).

## Capacity and service scope — not code defects

OpenStreetMap public tiles are best-effort with no SLA. Retain visible attribution, valid browser referrer, and normal browser caching; no bulk prefetch or cache-busting. Campaign-scale traffic may need a tile capacity decision before increased advertising. No paid replacement was added or authorized. [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/).

Stay on Repliers Standard $199. No Professional alert/messaging service, LiveBy data, paid boundaries, or new paid map provider is included. Weekly listing emails require the site's own configured delivery/scheduling workflow and confirmed operating costs; do not imply Repliers Professional services are enabled. Responsive listing photos use the documented existing Repliers CDN sizing. [Photo documentation](https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/).
