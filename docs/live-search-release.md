# Live property-search release — October 20, 2026

Patrick explicitly authorized publishing the map/search changes to GoldenCrossRealty.net and HomesAroundNorthHouston.com. Earlier preview-only/domain-launch instructions are superseded for this website release. Phone-agent qualification criteria and client outreach approval remain separate.

- Full-width Leaflet/OpenStreetMap map; four listing columns on wide screens, three/two/one at smaller widths.
- Real provider totals; 50/100 results per page; complete pagination.
- Active, pending and coming-soon search, with status badges and active-only option.
- Address, square footage, lot size, price and year-built sorts in both directions. Address/lot sorting ranks the complete matching set before pagination; searches over 10,000 matches must be narrowed for these two sorts. Other sorts are native Repliers queries.
- Scroll-wheel zoom, optional debounced search-as-map-moves, drawn polygon, viewport intersection and retained city/ZIP/price/bed/bath constraints.
- Saved searches include drawn shape/viewport. Golden Cross account saves remain synchronized; North Houston uses device storage.
- Gold dashed municipal outline from U.S. Census TIGERweb is reference geography; MLS city-address areas can extend beyond municipal limits. Teal outlines identify the selected search area. No paid boundary add-on installed.
- Existing brokerage/GMS inquiry routing remains distinct. No phone/SMS activation or client approval is implied by website publication.

## Count reconciliation

Broker HAR-BRIDGE board 147 feed returned 2,867 Conroe sale listings across Active/Pending/Coming Soon in the controlled comparison. Enforcing displayPublic=Y and displayInternetEntireListing=Y returned 2,644: the 223 excluded listings were pending records requiring sign-in. HAR subsequently displayed 2,877 during a separate live refresh; counts are time-dependent. Do not hard-code HAR totals or publish restricted records anonymously to manufacture parity.

Repliers defines displayPublic=N as requiring authentication, and displayInternetEntireListing=N as prohibited from consumer display even after sign-in:
https://help.repliers.com/en/article/understanding-listing-permissions-in-the-api-yj6n9y/

Current release exposes only the anonymous public subset, including for visitors with existing saved-home accounts. Authenticated VOW inventory retrieval requires a separate server-verified authorization path. Public search is accurate to this permission scope; full HAR inventory parity is not yet implemented.

## Provider data issue for review

MLS 68798901 returned lot.acres=1955 and lot.squareFeet=85159800 while dimensions were 65 x 131 and lot features described under one-quarter acre. Do not guess a correction. Lot sorting follows provider values; this source-data issue needs Repliers/broker review. No support message has been sent.
