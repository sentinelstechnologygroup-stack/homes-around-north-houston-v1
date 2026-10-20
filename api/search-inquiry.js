import {CONTACT_CONSENT_TEXT,CONTACT_CONSENT_VERSION} from '../src/lib/contactConsent.js';
const SITE='north';
const origins=['https://homesaroundnorthhouston.com','https://www.homesaroundnorthhouston.com'];
const attempts=new Map();
export const config={maxDuration:120};
const clean=(v,n=200)=>typeof v==='string'?v.trim().slice(0,n):'';
export function validate(body){
 if(!body||typeof body!=='object'||JSON.stringify(body).length>15000||clean(body.website_check))throw Error('Invalid inquiry.');
 if(!/^[a-f0-9-]{36}$/i.test(body.submissionId||''))throw Error('Please reload and try again.');
 const name=clean(body.name,120),email=clean(body.email,254).toLowerCase(),digits=clean(body.phone,40).replace(/\D/g,'');
 if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||digits.length<10||digits.length>15)throw Error('Enter your name, valid email and phone number.');
 if(body.consentAccepted!==true||body.consentVersion!==CONTACT_CONSENT_VERSION)throw Error('Contact permission is required.');
 const elapsed=Date.now()-Date.parse(body.formStartedAt);if(!Number.isFinite(elapsed)||elapsed<1500||elapsed>86400000)throw Error('Please reload and try again.');
 const s=body.searchCriteria||{},searchCriteria={location:clean(s.location,100),neighborhood:clean(s.neighborhood,100)};
 if(!searchCriteria.location)throw Error('Choose a city or ZIP code.');
 for(const k of ['minPrice','maxPrice','beds','baths'])if(s[k]!==''&&s[k]!=null){const n=Number(s[k]);if(!Number.isInteger(n)||n<0||n>(k.endsWith('Price')?100000000:20))throw Error('Check your search preferences.');searchCriteria[k]=String(n);}
 if(searchCriteria.minPrice&&searchCriteria.maxPrice&&Number(searchCriteria.minPrice)>Number(searchCriteria.maxPrice))throw Error('Maximum price must be at least the minimum price.');
 const attribution=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid'].map(k=>[k,clean(body.attribution?.[k],200)]));
 return {site:SITE,submissionId:body.submissionId,name,email,phone:digits.length===10?'+1'+digits:'+'+digits,searchCriteria,weekly:body.weeklyListingPreferencePresented===true&&body.weeklyListingEmailsRequested===true,consent:{accepted:true,text:CONTACT_CONSENT_TEXT,version:CONTACT_CONSENT_VERSION,capturedAt:new Date().toISOString(),smsAccepted:false},services:['Buying'],sources:[SITE==='north'?'Homes Around North Houston website':'Golden Cross Realty website'],attribution:{...attribution,sourceSite:SITE==='north'?'homes-around-north-houston':'golden-cross-realty'},testOnly:email==='patrick.camacho1@gmail.com'&&name.startsWith('CONTROLLED TEST')};
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'POST required'});}
 if(!origins.includes(req.headers.origin))return res.status(403).json({error:'Origin not allowed'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'JSON required'});
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0],now=Date.now();for(const[k,v]of attempts)if(now-v.at>600000)attempts.delete(k);const count=attempts.get(ip)||{at:now,count:0};count.count++;if(attempts.size>=2000&&!attempts.has(ip)||count.count>8)return res.status(429).json({error:'Please wait before sending another request.'});attempts.set(ip,count);
 let payload;try{const b=typeof req.body==='string'?JSON.parse(req.body):req.body;payload=validate(b);}catch(e){return res.status(400).json({error:e.message||'Invalid inquiry.'});}
 if(!process.env.GMS_SEARCH_INTAKE_TOKEN||!process.env.GMS_SEARCH_INTAKE_URL)return res.status(503).json({error:'Matching-home requests are temporarily unavailable. You can still browse Search Homes.'});
 try{const r=await fetch(process.env.GMS_SEARCH_INTAKE_URL,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.GMS_SEARCH_INTAKE_TOKEN}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(105000)});const d=await r.json();if(!r.ok||!d.accepted||!d.leadId)throw Error('Receipt not confirmed');return res.status(202).json({accepted:true,reference:d.leadId,searchUrl:d.searchUrl,emailStatus:d.emailStatus});}catch{return res.status(502).json({error:'We could not confirm receipt. Please contact the office before submitting again.'});}
}
