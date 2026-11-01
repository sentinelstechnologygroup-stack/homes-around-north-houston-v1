import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import PageShell from '@/components/PageShell';
import {sendFunnelAction, funnelEvent} from '@/lib/funnelSession';

export default function VerifyContact() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('saving');
  const started = useRef(false);
  const channel = params.get('s') ? 'sms' : params.get('channel');
  const confirm = async () => {
    if (!['email','sms'].includes(channel)) return setStatus('error');
    setStatus('saving');
    try {
      if(params.get('s')) await sendFunnelAction({confirmationCode:params.get('s')}, 'verify_sms_short');
      else await sendFunnelAction({sessionId: params.get('id'), sessionToken: params.get('token')}, `verify_${channel}`);
      funnelEvent(`${channel}_verified`);
      setStatus('verified');
      window.history.replaceState(null, '', '/verify');
    } catch { setStatus('error'); }
  };
  useEffect(() => { if(started.current)return; started.current=true; void confirm(); }, []);
  return <PageShell title={status === 'verified' ? (channel === 'sms' ? 'Thank you for confirming your number.' : 'Thank you for confirming your email address.') : (status === 'error' ? 'Unable to confirm' : 'Confirming...')}>
    {status === 'error' && <p role="alert">This link has expired or could not be confirmed. Please contact Golden Cross Realty for help.</p>}
  </PageShell>;
}
