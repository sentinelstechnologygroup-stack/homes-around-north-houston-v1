/// <reference types="vite/client" />
// Only explicit, non-personal campaign fields may cross this boundary.
const env = /** @type {Record<string,string>} */ (import.meta.env || {});
const KEY='realestate:privacy:v1';
// Meta reads the URL itself. Permit only its opaque click ID; inquiry/search URLs stay excluded.
export function safeMetaUrl(url){try{const u=new URL(url);return (!u.hash||u.hash==='#contact')&&[...u.searchParams].every(([key,value])=>(key==='fbclid'&&/^[a-zA-Z0-9_-]{1,1000}$/.test(value))||(key==='interest'&&['buying','selling','investing'].includes(value))||(key==='campaign'&&['hanh-new-homes-400k','hanh-new-construction'].includes(value))||(['ad_id','adset_id','campaign_id'].includes(key)&&/^\d{5,25}$/.test(value))||(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','placement'].includes(key)&&/^[a-zA-Z0-9_.-]{1,100}$/.test(value)));}catch{return false;}}
let initialized=false;
const memory=new Set();
const host=()=>typeof window==='undefined'?null:/** @type {any} */(window);
export function normalizeConsent(value={},gpc=false){return {analytics:value.analytics===true,ads:value.ads===true&&!gpc};}
export function safePage(url){try{const u=new URL(url);return u.origin+u.pathname;}catch{return '';}}
export function safeArea(value){const s=String(value||'').trim();return /^\d{5}$/.test(s)?s:/^[a-zA-Z .'-]{2,40}$/.test(s)?s:'';}
export function controlledTest(name){return /^\s*(CONTROLLED TEST|PREVIEW TEST|TEST LEAD)\b/i.test(String(name||''));}
export function readConsent(){const w=host();if(!w)return null;try{const v=JSON.parse(w.localStorage.getItem(KEY)||'null');return v?normalizeConsent(v,w.navigator.globalPrivacyControl===true):null;}catch{return null;}}
function tag(...args){const w=host();if(w)w.gtag(...args);}
function script(id,src){const w=host();if(!w||w.document.getElementById(id))return;const el=w.document.createElement('script');el.id=id;el.async=true;el.src=src;w.document.head.appendChild(el);}
export function initializeTracking(){const w=host();if(!w||initialized)return;initialized=true;w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};tag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});tag('set','ads_data_redaction',true);tag('set',{page_location:safePage(w.location.href),page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false});applyConsent(readConsent()||normalizeConsent());}
export function applyConsent(choice){const w=host();if(!w)return;const c=normalizeConsent(choice,w.navigator.globalPrivacyControl===true);tag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.ads?'granted':'denied',ad_user_data:c.ads?'granted':'denied',ad_personalization:'denied'});
 const ga=/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||'')?env.VITE_GA4_ID:'';
 const ads=/^AW-\d+$/.test(env.VITE_GOOGLE_ADS_ID||'')?env.VITE_GOOGLE_ADS_ID:'';
 if((c.analytics&&ga)||(c.ads&&ads)){script('campaign-gtag','https://www.googletagmanager.com/gtag/js?id='+(c.analytics&&ga?ga:ads));tag('js',new Date());if(c.analytics&&ga)tag('config',ga,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:safePage(w.location.href),page_referrer:''});if(c.ads&&ads)tag('config',ads,{send_page_view:false,allow_ad_personalization_signals:false});}
 if((c.analytics||c.ads)&&/^GTM-[A-Z0-9]+$/.test(env.VITE_GTM_ID||'')){w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});script('campaign-gtm','https://www.googletagmanager.com/gtm.js?id='+env.VITE_GTM_ID);}
 if(c.ads&&safeMetaUrl(w.location.href)&&/^\d{8,20}$/.test(env.VITE_META_PIXEL_ID||'')&&!w.fbq){const fb=function(...args){fb.callMethod?fb.callMethod(...args):fb.queue.push(args);};fb.queue=[];fb.callMethod=null;fb.loaded=true;fb.version='2.0';w.fbq=fb;w._fbq=fb;script('campaign-meta','https://connect.facebook.net/en_US/fbevents.js');w.fbq('set','autoConfig',false,env.VITE_META_PIXEL_ID);w.fbq('init',env.VITE_META_PIXEL_ID);w.fbq('track','PageView');}
 if(w.fbq)w.fbq('consent',c.ads?'grant':'revoke');
}
export function saveConsent(choice){const w=host();if(!w)return;initializeTracking();const c=normalizeConsent(choice,w.navigator.globalPrivacyControl===true);w.localStorage.setItem(KEY,JSON.stringify(c));applyConsent(c);w.dispatchEvent(new Event('campaign:consent'));return c;}
export function trackPage(){initializeTracking();const w=host(),c=readConsent();if(w)tag('set',{page_location:safePage(w.location.href),page_referrer:''});if(w&&c?.analytics&&/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||''))tag('event','page_view',{send_to:env.VITE_GA4_ID,page_location:safePage(w.location.href),page_referrer:'',page_title:w.document.title});}
export function trackAcceptedLead({receiptId,testOnly=false,area='',kind='inquiry'}){initializeTracking();const w=host(),c=readConsent();if(!w||testOnly||!receiptId||!c)return;const id=String(receiptId);if(!/^[a-zA-Z0-9_:-]{1,160}$/.test(id))return;
 const once=(provider,run)=>{const key='campaign:receipt:'+provider+':'+id;try{if(memory.has(key)||w.localStorage.getItem(key))return;run();memory.add(key);w.localStorage.setItem(key,'1');}catch{/* Storage restrictions must not break intake. */}};
 const params={transaction_id:id,inquiry_type:['inquiry','property_inquiry','weekly_matches','search_match'].includes(kind)?kind:'inquiry',search_area:safeArea(area),page_location:safePage(w.location.href),page_referrer:''};
 if(c.analytics&&/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||''))once('ga4',()=>tag('event','generate_lead',{...params,send_to:env.VITE_GA4_ID}));
 if(c.ads&&/^AW-\d+$/.test(env.VITE_GOOGLE_ADS_ID||'')&&/^[a-zA-Z0-9_-]{3,100}$/.test(env.VITE_GOOGLE_ADS_LABEL||''))once('ads',()=>tag('event','conversion',{send_to:env.VITE_GOOGLE_ADS_ID+'/'+env.VITE_GOOGLE_ADS_LABEL,transaction_id:id,page_location:params.page_location}));
 // Meta automatically captures the page URL: never send from a URL containing inquiry/search data.
 if(c.ads&&w.fbq&&safeMetaUrl(w.location.href))once('meta',()=>w.fbq('track','Lead',{content_category:params.inquiry_type},{eventID:id}));
}

export function trackBehavior(name,parameters={}){initializeTracking();const w=host(),c=readConsent();if(!w||!c?.analytics||!/^G-[A-Z0-9]+$/.test(env.VITE_GA4_ID||''))return;
 const allowed=['listing_search_handoff','phone_click','contact_click','idx_search_start','idx_area_search','idx_category_search','valuation_start','school_search_start','property_search','idx_authorized_search_open'];if(!allowed.includes(name))return;
 tag('event',name,{send_to:env.VITE_GA4_ID,search_area:safeArea(parameters.search_location),page_location:safePage(w.location.href),page_referrer:''});
}
