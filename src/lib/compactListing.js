const clip=(s,n)=>String(s||'').length>n?String(s).slice(0,n-3)+'...':String(s||'');
export function compactListing(l,brand,missing=false){
 const price=l.price!=null?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(l.price)):'Price on request';
 const badges=[{kind:'status',label:l.standardStatus||'Active'},...(l.badges||[]).map(b=>({...b,label:b.kind==='featured'?'Featured':b.label}))].filter((b,i,all)=>all.findIndex(x=>x.label.toLowerCase().replace(/\s/g,'')===b.label.toLowerCase().replace(/\s/g,''))===i);
 let address=clip(l.address,70),locality=clip(l.city,35),facts=[l.beds!=null?l.beds+' beds':'',l.baths!=null?l.baths+' baths':'',l.sqft?Number(l.sqft).toLocaleString()+' sq ft':''].filter(Boolean).join(' / ');
 const fixed=[price,...badges.map(b=>b.label),'View home','Save home',...(missing?[brand,'Photos coming soon']:[])].join(' ');
 const length=()=>[fixed,address,locality,facts].join(' ').length;
 if(length()>200)locality='';if(length()>200)facts='';if(length()>200)address=clip(address,Math.max(8,200-fixed.length-3));
 return {price,address,locality,facts,badges,visibleText:[fixed,address,locality,facts].filter(Boolean).join(' ')};
}
