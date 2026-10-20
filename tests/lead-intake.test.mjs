import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.js';

test('property inquiries preserve preferences and attribution through the server-owned GMS route',async()=>{
  const previous={...process.env},originalFetch=global.fetch;
  Object.assign(process.env,{VERCEL_ENV:'preview',VERCEL_URL:'review.vercel.app',LEAD_WEBHOOK_URL:'https://intake.example.invalid',LEAD_WEBHOOK_TOKEN:'synthetic-secret',GMS_LEAD_ROUTE_KEY:'controlled-test-route'});
  let forwarded,upstreamStatus=200,accepted=true;
  global.fetch=async(url,options)=>{forwarded={url,headers:options.headers,body:JSON.parse(options.body)};return {status:upstreamStatus,ok:upstreamStatus===200,json:async()=>accepted?{accepted:true,leadId:'synthetic-receipt',sessionId:'a'.repeat(64),sessionToken:'b'.repeat(64)}:{accepted:false}};};
  const body={submissionId:'11111111-1111-4111-8111-111111111111',name:'Synthetic Test',email:'synthetic@example.invalid',phone:'2025550140',interested_in:'buying',formStartedAt:new Date(Date.now()-5000).toISOString(),consentAccepted:true,consentVersion:'north-houston-office-inquiry-v3',weeklyListingPreferencePresented:true,weeklyListingEmailsRequested:false,property:{boardId:'147',mlsNumber:'12345678',address:'Synthetic address'},searchCriteria:{location:'Conroe',maxPrice:'500000'},attribution:{utm_source:'meta',fbclid:'synthetic-click'},smsConsentAccepted:true,smsConsentVersion:'north-houston-sms-v2',tenantId:'forged',assignedTo:'forged',routeKey:'forged'};
  async function invoke(overrides={}){let code,data;const response={setHeader(){},status(value){code=value;return this;},json(value){data=value;return this;}};await handler({method:'POST',headers:{origin:'https://review.vercel.app','content-type':'application/json','x-forwarded-for':'192.0.2.17'},body,...overrides},response);return {code,data};}
  try{
    assert.equal((await invoke()).code,202);
    assert.equal(forwarded.headers['x-gms-route-key'],'controlled-test-route');
    assert.match(forwarded.body.notes,/12345678/);assert.match(forwarded.body.notes,/Conroe/);
    assert.equal(forwarded.body.attribution.fbclid,'synthetic-click');
    assert.equal(forwarded.body.weeklyListingEmailsRequested,false);
    assert.equal(forwarded.body.consent.smsAccepted,false);
    assert.equal(forwarded.body.assignedTo,undefined);assert.equal(forwarded.body.tenantId,undefined);
    assert.equal((await invoke({body:{...body,consentAccepted:false}})).code,400);
    assert.equal((await invoke({headers:{origin:'https://untrusted.example','content-type':'application/json'}})).code,403);
    const captured=await invoke({body:{...body,funnelAction:'capture',weeklyListingPreferencePresented:false,funnelProfile:{location:'77304',beds:'3',maxPrice:'400000',mlsNumber:'12345678',boardId:'147',inquiryContext:'search'}}});
    assert.equal(captured.code,202);assert.equal(captured.data.sessionId,'a'.repeat(64));
    assert.equal(forwarded.body.funnelProfile.beds,'3');assert.equal(forwarded.body.weeklyListingEmailsRequested,false);assert.equal(forwarded.body.consent.smsAccepted,false);
    assert.equal((await invoke({body:{sessionId:'a'.repeat(64),sessionToken:'b'.repeat(64),funnelAction:'complete',funnelProfile:{location:'77304',beds:'3',maxPrice:'400000',weeklyListingPreferencePresented:true,weeklyListingEmailsRequested:false,tenantId:'forged'}}})).code,202);
    assert.equal(forwarded.body.funnelProfile.beds,'3');assert.equal(forwarded.body.funnelProfile.tenantId,undefined);
    upstreamStatus=409;assert.equal((await invoke()).code,503);
    upstreamStatus=200;accepted=false;assert.equal((await invoke()).code,502);
  }finally{global.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in previous))delete process.env[key];Object.assign(process.env,previous);}
});
