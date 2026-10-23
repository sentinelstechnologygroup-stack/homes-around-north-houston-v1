import test from 'node:test';
import assert from 'node:assert/strict';
import {validate} from '../api/search-inquiry.js';
import {CONTACT_CONSENT_VERSION} from '../src/lib/contactConsent.js';
const request=()=>({submissionId:'12345678-1234-1234-1234-123456789012',name:'CONTROLLED TEST',email:'patrick.camacho1@gmail.com',phone:'2025550140',consentAccepted:true,consentVersion:CONTACT_CONSENT_VERSION,consentMethod:'form_submission',formStartedAt:new Date(Date.now()-3000).toISOString(),searchCriteria:{location:'Conroe',neighborhood:'April Sound',minPrice:'200000',maxPrice:'400000',beds:'3',baths:'2'},weeklyListingPreferencePresented:true,weeklyListingEmailsRequested:true});
test('preserves search and preference while suppressing SMS',()=>{const b=validate(request());assert.equal(b.searchCriteria.neighborhood,'April Sound');assert.equal(b.searchCriteria.maxPrice,'400000');assert.equal(b.weekly,true);assert.equal(b.consent.smsAccepted,false);assert.equal(b.phone,'+12025550140');});
test('weekly opt-out is retained',()=>{assert.equal(validate({...request(),weeklyListingEmailsRequested:false}).weekly,false);});
test('rejects invalid consent, price, spam and missing email',()=>{for(const patch of [{consentAccepted:false},{email:''},{website_check:'spam'},{searchCriteria:{location:'Conroe',minPrice:'500000',maxPrice:'200000'}},{formStartedAt:new Date().toISOString()}])assert.throws(()=>validate({...request(),...patch}));});

test('emailed search preserves drawn geometry and property filters',()=>{const polygon=JSON.stringify([[-95.7,30],[-95.5,30],[-95.5,30.2],[-95.7,30]]);const data=validate({...request(),searchCriteria:{location:'',polygon,beds:'3',waterfront:'true',availability:'active',minSqft:'2000'}});assert.equal(data.searchCriteria.polygon,polygon);assert.equal(data.searchCriteria.waterfront,'true');assert.equal(data.searchCriteria.minSqft,'2000');assert.throws(()=>validate({...request(),searchCriteria:{location:'',polygon:'invalid'}}));});
