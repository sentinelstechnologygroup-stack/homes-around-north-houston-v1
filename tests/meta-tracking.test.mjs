import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {safeMetaUrl} from '../src/lib/campaignTracking.js';

test('only clean URLs and opaque Meta click IDs reach the pixel',()=>{
 for(const url of ['https://example.com/','https://example.com/?fbclid=IwZX-Test_123','https://example.com/#contact','https://example.com/?interest=buying#contact'])assert.equal(safeMetaUrl(url),true);
 for(const url of ['https://example.com/?email=a@b.com','https://example.com/?fbclid=a@b.com','https://example.com/?fbclid=ok&search=private','https://example.com/#private','https://example.com/?interest=private','invalid'])assert.equal(safeMetaUrl(url),false);
});

test('Meta respects consent, GPC, accepted receipts, test suppression and deduplication',async()=>{
 const store=new Map(), scripts=[];
 globalThis.window={location:{href:'https://example.com/?fbclid=Opaque_123'},navigator:{},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{getElementById:()=>null,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},dispatchEvent:()=>{}};
 const source=(await readFile(new URL('../src/lib/campaignTracking.js',import.meta.url),'utf8')).replace(/const env = .*?;/,"const env = {VITE_META_PIXEL_ID:'1672301791232153'};");
 const tracking=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 tracking.initializeTracking();assert.equal(scripts.length,0);
 tracking.saveConsent({ads:true});assert.equal(scripts.length,1);
 const queue=window.fbq.queue;
 assert.equal(queue.filter(x=>x[0]==='track'&&x[1]==='PageView').length,1);
 tracking.trackAcceptedLead({receiptId:'test-only',testOnly:true});
 assert.equal(queue.filter(x=>x[1]==='Lead').length,0);
 tracking.trackAcceptedLead({receiptId:'accepted-1'});tracking.trackAcceptedLead({receiptId:'accepted-1'});
 assert.equal(queue.filter(x=>x[1]==='Lead').length,1);
 window.location.href='https://example.com/?email=private@example.com';
 tracking.trackAcceptedLead({receiptId:'accepted-2'});assert.equal(queue.filter(x=>x[1]==='Lead').length,1);
 window.location.href='https://example.com/';window.navigator.globalPrivacyControl=true;
 tracking.trackAcceptedLead({receiptId:'accepted-3'});assert.equal(queue.filter(x=>x[1]==='Lead').length,1);
 assert.ok(!JSON.stringify(queue).includes('private@example.com'));
 delete globalThis.window;
});
