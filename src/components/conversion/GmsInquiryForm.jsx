import { useEffect, useRef, useState } from 'react';

export const CONSENT_TEXT='I agree that GMS Pro and Golden Cross Realty may contact me by phone and email about this real estate inquiry. GMS Pro will review and verify my request before connecting me with the brokerage.';
export const CONSENT_VERSION='north-houston-inquiry-v1';
/** @param {{ property?: any, filters?: Record<string,string>, weeklyOnly?: boolean, weeklyDefault?: boolean, onWeeklyChange?: (value: boolean) => Promise<boolean> }} props */
export default function GmsInquiryForm({ property=null, filters={location:'',minPrice:'',maxPrice:'',propertyType:''}, weeklyOnly=false, weeklyDefault=true, onWeeklyChange=async()=>true }) {
  const [form,setForm]=useState({name:'',email:'',phone:'',message:'',consent:false,weekly:weeklyDefault,website_check:''});
  const [status,setStatus]=useState('idle'),[error,setError]=useState('');
  const started=useRef(new Date().toISOString()),receipt=useRef(null);
  useEffect(()=>setForm(current=>({...current,weekly:weeklyDefault})),[weeklyDefault]);
  const change=(key,value)=>setForm(current=>({...current,[key]:value}));
  async function submit(event){
    event.preventDefault();if(status==='sending')return;
    const details={...form,property:property?{mlsNumber:property.mlsNumber,boardId:property.boardId,address:property.address}:null,filters};
    const fingerprint=JSON.stringify(details);
    if(receipt.current?.fingerprint!==fingerprint)receipt.current={fingerprint,id:crypto.randomUUID()};
    setStatus('sending');setError('');
    let attribution={};
    try{attribution=JSON.parse(sessionStorage.getItem('property-search-attribution')||'{}');}catch{/* Tracking is optional. */}
    const params=new URLSearchParams(window.location.search);
    for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid'])if(params.has(key))attribution[key]=params.get(key).slice(0,200);
    try{
      const response=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        submissionId:receipt.current.id,name:form.name,email:form.email,phone:form.phone,interested_in:'buying',
        message:form.message,property:details.property,searchCriteria:filters,requestType:weeklyOnly?'weekly_matches':'property_inquiry',
        website_check:form.website_check,formStartedAt:started.current,consentAccepted:form.consent,consentVersion:CONSENT_VERSION,
        weeklyListingPreferencePresented:true,weeklyListingEmailsRequested:form.weekly,
        funnelProfile:{area:filters.location||'',budgetRange:[filters.minPrice,filters.maxPrice].filter(Boolean).join('–'),propertyType:filters.propertyType||''},attribution,
      })});
      const result=await response.json();
      if(!response.ok || result.accepted!==true || !result.reference)throw new Error(result.error||'Receipt could not be confirmed.');
      setStatus('sent');setError('Reference: '+result.reference);
    }catch(failure){setStatus('idle');setError(failure.message||'Please try again later.');}
  }
  return <section className="gms-inquiry" aria-label={weeklyOnly?'Request weekly home matches':'Ask about this home'}>
    <p className="ps-eyebrow">GMS PRO · GOLDEN CROSS REALTY</p>
    <h2>{weeklyOnly?'Find your next home, one good match at a time.':'Interested in this home?'}</h2>
    <p>{weeklyOnly?'Request weekly newly listed homes matching this search.':'Ask a question or request a showing. The Golden Cross Realty office team will review your request and help with the next step.'}</p>
    <p className="ps-notice">Preview: follow-up and email delivery remain paused pending client approval. No SMS permission is requested.</p>
    {status==='sent'?<p role="status">Your inquiry was received for the Golden Cross Realty office team. {error} Weekly emails require setup before delivery begins.</p>:<form onSubmit={submit}>
      <div className="ps-fields"><label>Name<input required autoComplete="name" value={form.name} onChange={e=>change('name',e.target.value)} /></label><label>Email<input required type="email" autoComplete="email" value={form.email} onChange={e=>change('email',e.target.value)} /></label><label>Phone<input required type="tel" autoComplete="tel" value={form.phone} onChange={e=>change('phone',e.target.value)} /></label></div>
      <label className="ps-trap" aria-hidden="true">Leave blank<input tabIndex={-1} autoComplete="off" value={form.website_check} onChange={e=>change('website_check',e.target.value)} /></label>
      <label>Your question or preferred showing time<textarea maxLength={2000} value={form.message} onChange={e=>change('message',e.target.value)} /></label>
      <label className="ps-check"><input type="checkbox" checked={form.weekly} onChange={async e=>{const value=e.target.checked;change('weekly',value);if(!await onWeeklyChange(value))setError('Your account preference could not be updated. Please try again before sending.');}} />Send me a weekly email with newly listed homes that match my search preferences. I can unsubscribe at any time.</label>
      <label className="ps-check"><input type="checkbox" required checked={form.consent} onChange={e=>change('consent',e.target.checked)} />{CONSENT_TEXT}</label>
      <p className="ps-small">Weekly-email choices are recorded with your inquiry for Realtor setup. No alerts start from this preview. Email preferences never authorize texts.</p>
      {error && <p role="alert">{error}</p>}<button disabled={status==='sending'} className="ps-primary" type="submit">{status==='sending'?'Submitting…':weeklyOnly?'Request weekly matches':'Send inquiry to GMS Pro'}</button>
    </form>}
  </section>;
}
