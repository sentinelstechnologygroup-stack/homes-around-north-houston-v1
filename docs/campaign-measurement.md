# Campaign measurement

Set verified public build IDs VITE_GTM_ID, VITE_GA4_ID, VITE_GOOGLE_ADS_ID (AW-…), VITE_GOOGLE_ADS_LABEL and VITE_META_PIXEL_ID only for their respective site. Missing/invalid IDs leave providers inactive. No provider account or conversion ID is invented.

Direct gtag is the managed GA4 source. Keep the GTM container empty until reviewed: do not duplicate Google tag configuration, enable enhanced measurement form events, enhanced conversions, audience exports, automatic advanced matching, or remarketing. In GA4 disable enhanced measurement form interactions, outbound click and site-search collection where raw query parameters can be collected; use this explicit sanitized integration. Mark generate_lead as a key event. The Ads conversion action must be verified with its exact ID/label; no campaign spend is enabled by this code.

Optional analytics and advertising measurement default off, separately selectable through Privacy choices. Global Privacy Control forces advertising off. Housing ad personalization and Google Signals are disabled. Search works regardless of choices. No rejected/failed/pending inquiry is a conversion. Confirmed receipt IDs deduplicate per provider on the device. Controlled preview/test lead names are excluded entirely; real delivery tests must use those labels.

Tracking excludes URL queries/fragments, contact data, full addresses and map geometry. Meta pixel is withheld on any query/fragment URL because its library may automatically inspect the URL; no Meta PageView is emitted. Meta automatic configuration and advanced matching are not enabled. Do not place PII in pathnames. Browser choice updates revoke future events; already-loaded third-party libraries persist until reload.

Deployment verification: inspect network before consent (no vendor calls); accept analytics only (GA4 page_view, no Ads/Meta); reject/revoke; test GPC; submit labeled controlled tests (zero conversions); verify a separately authorized genuine accepted inquiry produces one event per configured consented provider and retry produces none. Check provider diagnostics before using events for bidding.
