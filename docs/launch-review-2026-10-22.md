# Launch review — October 22, 2026

## Completed verification

- [x] Lint, typecheck and production builds pass for both sites. North Houston: 58 tests; Golden Cross: 56 tests plus two isolated emulator tests for verified cross-device saves and owner-only access. Follow-up search-link tests cover rentals, legacy parameters and unsupported requests.
- [x] Reviewed changes deployed to both existing production projects; public custom hosts serve the release. Both APIs returned the same total and 48 displayed listings for identical ZIP 77375/status filters, without protection failures.
- [x] Controlled North Houston/GMS and Golden Cross/direct-brokerage inquiries verified, including rich listing emails delivered, saved records, search links and duplicate suppression. Controlled tests do not trigger ad conversions. Calls remain off pending client approval.
- [x] HTTPS, public robots/sitemaps and rendered canonical metadata verified. North Houston /verify is noindex; Golden Cross has no corresponding public verification page. Golden Cross .com canonical remains prepared pending the actual domain cutover.
- [x] Separate analytics/advertising consent defaults denied; GPC disables advertising. GA4 direct integration verified with consent and live activity observed on both properties. generate_lead is configured as a key event; empty GTM version 2 published. Google enhanced measurement is disabled to avoid duplicate or unintended form tracking.
- [x] North Houston property 560371570 / G-33QVQ2VYBQ / GTM-5G98B8KK. Golden Cross property 560415682 / G-RQXPGVL4L8 / GTM-PPVG9WW6.

## Remaining launch approvals and operating setup

- [ ] Final desktop/mobile browser review of map resizing, drawing/reset, geographic outlines, listing previews, sign-in and property details after the final display refinements.
- [ ] Google Ads and Meta conversions are not connected: account choice/sign-in and verified conversion/pixel configuration remain pending. No spend is enabled.
- [ ] Normal weekly email delivery stays disabled. Approve postal sender details and campaign content, then configure the delivery schedule and review capacity/costs. Controlled rich-email tests passed; this is not evidence of an active weekly schedule.
- [ ] Client/broker approval of branding, disclosures, attribution, privacy/terms and qualification workflow. Calls remain pending that approval.
- [ ] Search Console ownership and sitemap submission, plus the separate .com domain cutover below.

## Domain cutover — external release steps

- [ ] Attach GoldenCrossRealty.com and www to the intended new project and confirm DNS/TLS. Existing .com currently serves the earlier site; canonical preparation does not migrate it.
- [ ] Verify .com search, inquiries, sign-in links and email URLs before enabling .net and www redirects. Preserve paths and query parameters. Do not alter mail DNS.
- [ ] Activate the separately prepared host redirects only after .com is healthy; test one-hop redirects without loops. The supplied cutover preparation command does not activate anything.
- [x] Keep Homes Around North Houston canonical at https://www.homesaroundnorthhouston.com and validate its apex redirect.

## Broker policy and inventory scope — not code defects

Public search must remain within the licensed public-display inventory and field permissions. A HAR portal count can include statuses, property classes, geography, timing or restricted inventory unavailable for public display. Compare equivalent filters, status definitions and update times; do not promise identical counts by exposing restricted VOW records.

Before restricted VOW features are enabled, the broker must approve the lawful broker-consumer relationship/disclosure flow, real name, verified email, affirmative terms, unique identity, definite access expiry/renewal, and required audit retention. Current HAR rules require retention at least 180 days after access expiry; do not assume a universal 90-day expiry. Resolve HAR's legacy credential-record language with a secure managed-auth approach; never store plaintext passwords. Confirm both domains and vendor authorization in the licensing agreement.

Source: [HAR MLS Rules, section 19.3](https://content.harstatic.com/mls/pdf/MLSRules.pdf).

## Capacity and service scope — not code defects

OpenStreetMap public tiles are best-effort with no SLA. Retain visible attribution, valid browser referrer, and normal browser caching; no bulk prefetch or cache-busting. Campaign-scale traffic may need a tile capacity decision before increased advertising. No paid replacement was added or authorized. [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/).

Stay on Repliers Standard $199. No Professional alert/messaging service, LiveBy data, paid boundaries, or new paid map provider is included. Weekly listing emails require the site's own configured delivery/scheduling workflow and confirmed operating costs; do not imply Repliers Professional services are enabled. Responsive listing photos use the documented existing Repliers CDN sizing. [Photo documentation](https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/).
