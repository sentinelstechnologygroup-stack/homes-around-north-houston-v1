export const CONTACT_CONSENT_VERSION = 'north-houston-office-inquiry-v4';
export const CONTACT_CONSENT_TEXT = 'By submitting, you are asking Golden Cross Realty and its office support team to contact you by phone or email about this real estate inquiry.';
export const SMS_CONSENT_VERSION = 'north-houston-sms-v4';
export const SMS_CONSENT_TEXT = 'I agree to receive SMS, emails, or phone calls from Golden Cross Realty and its office support team about my real estate inquiry.';

export function smsAcknowledgement(body) {
  if (body?.smsConsentAccepted !== true) return { smsAccepted: false };
  if (body.smsConsentVersion !== SMS_CONSENT_VERSION) return null;
  return { smsAccepted: true, smsVersion: SMS_CONSENT_VERSION, smsText: SMS_CONSENT_TEXT, smsMethod: 'checkbox' };
}

// Record the submit action rather than claiming a separate checkbox was checked.
// Old open tabs can still send the previous checked-checkbox version.
export function contactAcknowledgement(body) {
  if (body?.consentAccepted !== true) return null;
  if (body.consentVersion === CONTACT_CONSENT_VERSION && body.consentMethod === 'form_submission') {
    return { accepted: true, version: CONTACT_CONSENT_VERSION, text: CONTACT_CONSENT_TEXT, method: 'form_submission', channels: ['phone', 'email'], smsAccepted: false };
  }
  if (body.consentVersion === 'north-houston-office-inquiry-v3') {
    return { accepted: true, version: body.consentVersion, text: 'I agree that Golden Cross Realty and its office support team may contact me by phone and email about this real estate inquiry.', method: 'checkbox', channels: ['phone', 'email'], smsAccepted: false };
  }
  return null;
}
