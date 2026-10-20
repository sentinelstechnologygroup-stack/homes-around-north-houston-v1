import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {funnelEvent} from '@/lib/funnelSession';
import LeadFormSection from '@/components/landing/LeadFormSection';

// One shared intake instance across every marketing page. Keep the draft in
// memory when the dialog closes, so returning visitors do not create duplicates.
export default function LeadFunnel() {
  const location = useLocation();
  const navigate = useNavigate();
  const closeRef = useRef(null);
  const open = location.hash === '#contact';
  useEffect(() => {
    const capture = event => {
      const anchor = event.target.closest?.('a');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin || url.hash !== '#contact' || url.searchParams.get('inquiry') === 'received') return;
      event.preventDefault();
      const query = new URLSearchParams(location.search);
      url.searchParams.forEach((value, key) => query.set(key, value));
      query.set('cta', anchor.textContent.trim().slice(0, 80));
      funnelEvent('cta_clicked', {cta: query.get('cta')});
      navigate({ pathname: location.pathname, search: `?${query}`, hash: '#contact' });
    };
    document.addEventListener('click', capture, true);
    return () => document.removeEventListener('click', capture, true);
  }, [location.pathname, location.search, navigate]);
  const close = async () => {
    if (closeRef.current && await closeRef.current() === false) return;
    navigate({ pathname: location.pathname, search: location.search, hash: '' }, { replace: true });
  };
  return <Dialog open={open} onOpenChange={value => { if (!value) void close(); }}>
    <LeadFormSection popup open={open} closeRef={closeRef} panel={content => <DialogContent className=" max-w-2xl max-h-[90dvh] overflow-y-auto bg-white p-0 rounded-2xl" onInteractOutside={event => event.preventDefault()}>
      <div className="px-6 pt-6 pr-12">
        <p className="text-[#C5A059] font-semibold text-sm">Homes Around North Houston · Golden Cross Realty</p>
        <DialogTitle className="font-display text-2xl mt-2 text-[#0A192F]">Your next chapter starts here</DialogTitle>
        <DialogDescription className="mt-2">{new URLSearchParams(location.search).get('inquiryContext') === 'search' ? 'Your search is already included. Share your contact details so the office team can help.' : 'Share your contact details, then tell us about your real estate goals.'}</DialogDescription>
      </div>
      {content}
    </DialogContent>} />
  </Dialog>;
}
