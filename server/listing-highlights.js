export function listingHighlights(l,now=Date.now()){
 const brokerage=String(l.office?.brokerageName||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const featured=/^golden cross realty(?: llc| inc)?$/.test(brokerage);
 const days=(now-Date.parse(l.listDate))/86400000;
 const today=new Date(now).toLocaleDateString('en-CA',{timeZone:'America/Chicago'});
 const openHouses=(Array.isArray(l.openHouse)?l.openHouse:[]).filter(o=>o.type==='Public'&&o.status!=='Cancelled'&&o.date>=today).slice(0,8).map(o=>({date:String(o.date).slice(0,10),startTime:String(o.startTime||'').slice(0,40),endTime:String(o.endTime||'').slice(0,40)}));
 const badges=[];if(featured)badges.push({kind:'featured',label:'Featured · Golden Cross Realty'});
 if(l.standardStatus==='Coming Soon')badges.push({kind:'coming',label:'Coming soon'});else if(days>=0&&days<=7)badges.push({kind:'new',label:'Just listed'});
 if(openHouses.length)badges.push({kind:'open',label:'Open house'});
 if(Number(l.originalPrice)>Number(l.listPrice)&&Number(l.listPrice)>0)badges.push({kind:'reduced',label:'Below original list price'});
 return {featured,badges:badges.slice(0,3),openHouses,listDate:l.listDate||null};
}
