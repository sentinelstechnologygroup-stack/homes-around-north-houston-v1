import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeConsent,safePage,safeArea,controlledTest} from '../src/lib/campaignTracking.js';
test('optional tracking denied and GPC overrides advertising consent',()=>{assert.deepEqual(normalizeConsent(),{analytics:false,ads:false});assert.deepEqual(normalizeConsent({analytics:true,ads:true},true),{analytics:true,ads:false});assert.deepEqual(normalizeConsent({analytics:'true',ads:1}),{analytics:false,ads:false});});
test('page URLs remove all query and fragment data',()=>assert.equal(safePage('https://example.com/homes?email=private@example.com#contact'),'https://example.com/homes'));
test('only city or ZIP survives location boundary',()=>{assert.equal(safeArea('77375'),'77375');assert.equal(safeArea('The Woodlands'),'The Woodlands');assert.equal(safeArea('123 Main Street'),'');assert.equal(safeArea('person@example.com'),'');assert.equal(safeArea('[[30,-95]]'),'');});
test('controlled preview leads never qualify for conversions',()=>{assert.equal(controlledTest('CONTROLLED TEST — Patrick'),true);assert.equal(controlledTest('PREVIEW TEST no follow-up'),true);assert.equal(controlledTest('Patrick'),false);});

import {readFile} from 'node:fs/promises';
test('only accepted caller receipt produces one consented event and tests produce none',async()=>{
 const calls=[],store=new Map();
 globalThis.window={location:{href:'https://example.com/homes?email=private',search:'?email=private',hash:''},navigator:{},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:{title:'Homes',getElementById:()=>true},dataLayer:[],gtag:(...args)=>calls.push(args)};
 store.set('realestate:privacy:v1',JSON.stringify({analytics:true,ads:true}));
 const source=(await readFile(new URL('../src/lib/campaignTracking.js',import.meta.url),'utf8')).replace(/const env = .*?;/,"const env = {VITE_GA4_ID:'G-TEST123',VITE_GOOGLE_ADS_ID:'AW-12345',VITE_GOOGLE_ADS_LABEL:'test_label'};");
 const tracking=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 tracking.trackAcceptedLead({receiptId:'receipt-test',testOnly:true});
 assert.equal(calls.filter(x=>x[0]==='event').length,0);
 tracking.trackAcceptedLead({receiptId:'receipt-123',area:'123 Main Street'});
 tracking.trackAcceptedLead({receiptId:'receipt-123'});
 const events=calls.filter(x=>x[0]==='event');assert.equal(events.length,2);assert.equal(events[0][1],'generate_lead');assert.equal(events[1][1],'conversion');assert.equal(events[0][2].search_area,'');assert.equal(events[0][2].page_location,'https://example.com/homes');
 delete globalThis.window;
});
