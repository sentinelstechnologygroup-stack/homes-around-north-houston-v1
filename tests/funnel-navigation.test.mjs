import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignDefaults, resultsUrl, searchInquiryUrl } from '../src/lib/funnelSession.js';
import { CONTACT_CONSENT_TEXT } from '../src/lib/contactConsent.js';

test('a search inquiry and return to results preserve filters and campaign attribution',()=>{
 const url=searchInquiryUrl({location:'77304',maxPrice:'400000',beds:'3',baths:'2'},null,'utm_source=meta&utm_campaign=conroe&city=OldCity&zip=99999');
 const incoming=new URL(url,'https://example.invalid');
 assert.equal(incoming.pathname,'/homes');assert.equal(incoming.hash,'#contact');
 const defaults=campaignDefaults(incoming.searchParams);
 assert.equal(defaults.city,'');assert.equal(defaults.zip,'77304');assert.equal(defaults.beds,'3');assert.equal(defaults.maxPrice,'400000');
 const results=new URL(resultsUrl(defaults,incoming.searchParams.toString()),incoming.origin);
 assert.equal(results.pathname,'/homes');assert.equal(results.searchParams.get('beds'),'3');assert.equal(results.searchParams.get('utm_source'),'meta');assert.equal(results.hash,'');
 assert.equal(results.searchParams.has('inquiryContext'),false);
});
test('property inquiries retain the selected property and existing search',()=>{
 const incoming=new URL(searchInquiryUrl({location:'Conroe',minPrice:'250000'},{boardId:'147',mlsNumber:'12345678',address:'Synthetic address'}),'https://example.invalid');
 assert.equal(incoming.pathname,'/property/147/12345678');
 const defaults=campaignDefaults(incoming.searchParams);
 assert.equal(defaults.mlsNumber,'12345678');assert.equal(defaults.propertyAddress,'Synthetic address');assert.equal(defaults.city,'Conroe');
});
test('general inquiries have no invented search and use the single office consent',()=>{
 const defaults=campaignDefaults(new URLSearchParams());
 assert.equal(defaults.city,'');assert.equal(defaults.mlsNumber,'');
 assert.match(CONTACT_CONSENT_TEXT,/^By submitting,.*Golden Cross Realty and its office support team/);
 assert.doesNotMatch(CONTACT_CONSENT_TEXT,/GMS|SMS/);
});
