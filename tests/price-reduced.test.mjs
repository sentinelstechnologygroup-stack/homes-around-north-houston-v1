import test from 'node:test';import assert from 'node:assert/strict';import {searchFilters,queryListings} from '../server/repliers.js';import {savedSearches} from '../src/lib/savedSearchFilters.js';
const cfg={boards:['147'],mode:'public'};
test('price reductions combine with location, limits, construction and each availability',()=>{
 for(const availability of ['all','active_only','under_contract','pending','coming_soon']){const input={location:'Montgomery County',minPrice:'300000',maxPrice:'500000',beds:'3',baths:'2',newConstruction:'true',priceReduced:'true',availability};const f=searchFilters(input,cfg);assert.equal(f.lastPriceChangeType,'decrease');assert.equal(f.area,'Montgomery');assert.equal(f.minPrice,300000);assert.equal(f.maxPrice,500000);assert.equal(f.minBedroomsTotal,3);assert.equal(f.minBaths,2);assert.equal(f._newConstruction,true);assert.deepEqual(savedSearches(JSON.parse(JSON.stringify([{name:'Reduced new homes',filters:input}])))[0].filters,input);}
 assert.equal(searchFilters({priceReduced:'false'},cfg).lastPriceChangeType,undefined);assert.throws(()=>searchFilters({priceReduced:'increase'},cfg));
});
test('provider receives reduction filtering before pagination and fails closed for unsupported filters',async()=>{
 const f=searchFilters({priceReduced:'true',page:'2'},cfg);const requests=[];
 await queryListings(f,cfg,'fake',async url=>{requests.push(new URL(url));return {ok:true,json:async()=>({listings:[],count:0,page:2,numPages:0})};});assert.ok(requests.some(r=>r.searchParams.get('pageNum')==='2'));for(const r of requests)assert.equal(r.searchParams.get('lastPriceChangeType'),'decrease');
 await assert.rejects(queryListings(f,cfg,'fake',async()=>({ok:true,json:async()=>({listings:[],unrecognizedParams:['lastPriceChangeType']})})));
});
