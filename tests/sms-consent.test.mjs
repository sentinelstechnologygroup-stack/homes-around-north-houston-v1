import test from 'node:test';
import assert from 'node:assert/strict';
import {smsAcknowledgement,SMS_CONSENT_VERSION,SMS_CONSENT_TEXT} from '../src/lib/contactConsent.js';
test('SMS permission requires explicit true and the current disclosure',()=>{
  for(const body of [{},{smsConsentAccepted:false},{smsConsentAccepted:'true'}]) assert.deepEqual(smsAcknowledgement(body),{smsAccepted:false});
  assert.equal(smsAcknowledgement({smsConsentAccepted:true,smsConsentVersion:'old'}),null);
  assert.deepEqual(smsAcknowledgement({smsConsentAccepted:true,smsConsentVersion:SMS_CONSENT_VERSION}),{smsAccepted:true,smsVersion:SMS_CONSENT_VERSION,smsText:SMS_CONSENT_TEXT,smsMethod:'checkbox'});
});
