import test from 'node:test';
import assert from 'node:assert/strict';
import {contactAcknowledgement,CONTACT_CONSENT_VERSION,CONTACT_CONSENT_TEXT} from '../src/lib/contactConsent.js';
test('submission notice records the submit action without claiming a checked contact box',()=>{
 const result=contactAcknowledgement({consentAccepted:true,consentVersion:CONTACT_CONSENT_VERSION,consentMethod:'form_submission'});
 assert.equal(result.method,'form_submission');assert.equal(result.text,CONTACT_CONSENT_TEXT);assert.equal(result.smsAccepted,false);assert.deepEqual(result.channels,['phone','email']);
 assert.match(result.text,/^By submitting,/);
});
test('missing acknowledgement metadata is rejected; optional email/SMS flags cannot substitute for it',()=>{
 for(const body of [{},{consentAccepted:false,consentVersion:CONTACT_CONSENT_VERSION,consentMethod:'form_submission'},{consentAccepted:true,consentVersion:CONTACT_CONSENT_VERSION},{weeklyListingEmailsRequested:true,smsConsentAccepted:true}])assert.equal(contactAcknowledgement(body),null);
});
