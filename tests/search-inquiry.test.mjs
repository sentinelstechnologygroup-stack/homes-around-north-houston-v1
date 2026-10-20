import test from 'node:test';
import assert from 'node:assert/strict';
import {validate} from '../api/search-inquiry.js';
import {CONTACT_CONSENT_VERSION} from '../src/lib/contactConsent.js';
const request=()=>({submissionId:'12345678-1234-1234-1234-123456789012',name:'CONTROLLED TEST',email:'patrick.camacho1@gmail.com',phone:'2025550140',consentAccepted:true,consentVersion:CONTACT_CONSENT_VERSION,formStartedAt:new Date(Date.now()-3000).toISOString(),searchCriteria:{location:'Conroe',neighborhood:'April Sound',minPrice:'200000',maxPrice:'400000',beds:'3',baths:'2'},weeklyListingPreferencePresented:true,weeklyListingEmailsRequested:true});
test('preserves search and preference while suppressing SMS',()=>{const b=validate(request());assert.equal(b.searchCriteria.neighborhood,'April Sound');assert.equal(b.searchCriteria.maxPrice,'400000');assert.equal(b.weekly,true);assert.equal(b.consent.smsAccepted,false);assert.equal(b.phone,'+12025550140');});
test('weekly opt-out is retained',()=>{assert.equal(validate({...request(),weeklyListingEmailsRequested:false}).weekly,false);});
test('rejects invalid consent, price, spam and missing email',()=>{for(const patch of [{consentAccepted:false},{email:''},{website_check:'spam'},{searchCriteria:{location:'Conroe',minPrice:'500000',maxPrice:'200000'}},{formStartedAt:new Date().toISOString()}])assert.throws(()=>validate({...request(),...patch}));});
