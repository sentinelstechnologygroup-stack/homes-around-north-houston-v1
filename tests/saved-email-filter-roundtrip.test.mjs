import test from 'node:test';import assert from 'node:assert/strict';
import {savedSearchFilters,savedSearches,SAVED_SEARCH_FILTER_KEYS} from '../src/lib/savedSearchFilters.js';
import {validate} from '../api/search-inquiry.js';
import {CONTACT_CONSENT_VERSION} from '../src/lib/contactConsent.js';
const criteria={location:'77304',neighborhood:'April Sound',minPrice:'300000',maxPrice:'500000',beds:'4',baths:'3',propertyType:'single_family',forSale:'1',openHouses:'true',waterfront:'false',newConstruction:'true',priceReduced:'true',newListings:'false',minSqft:'2000',bounds:'-95.6,30.2,-95.5,30.3',polygon:'[[-95.6,30.2],[-95.5,30.2],[-95.5,30.3],[-95.6,30.3],[-95.6,30.2]]',availability:'pending',mapZoom:'12',featuredOnly:'false',minLotSqft:'5000',maxLotSqft:'10000'};
test('all selected saved filters survive storage and a fresh read',()=>{
 assert.deepEqual(Object.keys(criteria).sort(),[...SAVED_SEARCH_FILTER_KEYS].sort());
 for(const location of ['Conroe','77304']){const saved=[{name:'My search',filters:{...criteria,location}}];const reopened=savedSearches(JSON.parse(JSON.stringify(saved)));assert.deepEqual(reopened,saved);const params=new URLSearchParams(reopened[0].filters);for(const[k,v]of Object.entries(saved[0].filters))assert.equal(params.get(k),v);}
 assert.equal(savedSearchFilters({newConstruction:'true',email:'not-a-filter',nested:{private:true}}).email,undefined);
});
test('matching-home request preserves the same selected filters',()=>{
 const result=validate({submissionId:'12345678-1234-1234-1234-123456789012',name:'Synthetic test',email:'test@example.invalid',phone:'2025550140',consentAccepted:true,consentVersion:CONTACT_CONSENT_VERSION,consentMethod:'form_submission',formStartedAt:new Date(Date.now()-3000).toISOString(),searchCriteria:criteria});
 assert.deepEqual(result.searchCriteria,criteria);
});
