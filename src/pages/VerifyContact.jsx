import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import PageShell from '@/components/PageShell';
import {sendFunnelAction, funnelEvent} from '@/lib/funnelSession';

export default function VerifyContact() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('ready');
  const channel = params.get('channel');
  const confirm = async () => {
    if (!['email','sms'].includes(channel)) return setStatus('error');
    setStatus('saving');
    try {
      await sendFunnelAction({sessionId: params.get('id'), sessionToken: params.get('token')}, `verify_${channel}`);
      funnelEvent(`${channel}_verified`);
      setStatus('verified');
      window.history.replaceState(null, '', '/verify');
    } catch { setStatus('error'); }
  };
  return <PageShell title="Confirm your contact details" intro="Homes Around North Houston · Golden Cross Realty">
    <div className="max-w-xl bg-white border rounded-xl p-8">
      {status === 'verified' ? <p role="status">Thank you. Your contact information has been verified. Our team will follow up about your inquiry.</p> : <>
        <p className="mb-6">Select the button below to confirm that you made this real estate inquiry.</p>
        <button disabled={status === 'saving'} onClick={confirm} className="bg-[#C5A059] text-[#0A192F] rounded px-6 py-3 font-semibold">{status === 'saving' ? 'Confirming…' : 'Confirm My Contact Details'}</button>
        {status === 'error' && <p role="alert" className="mt-4">This link could not be verified. It may have expired. Please contact Golden Cross Realty for help.</p>}
      </>}
    </div>
  </PageShell>;
}
