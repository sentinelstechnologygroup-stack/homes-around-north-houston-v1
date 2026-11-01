import test from 'node:test';
import assert from 'node:assert/strict';
import {searchFilters,queryListings} from '../server/repliers.js';
import {newConstructionFilter} from '../server/new-construction.js';
const config={boards:['147'],mode:'public'};
test('new construction combines with the normal property filters',()=>{
 const f=searchFilters({newConstruction:'true',location:'77304',minPrice:'250000',maxPrice:'450000',beds:'3',baths:'2',neighborhood:'Test subdivision',minSqft:'1500',minLotSqft:'5000'},config);
 assert.equal(f._newConstruction,true);assert.equal(f.type,'sale');assert.equal(f.zip,'77304');assert.equal(f.minPrice,250000);assert.equal(f.maxPrice,450000);assert.equal(f.minBedroomsTotal,3);assert.equal(f.minBaths,2);assert.equal(f.minSqft,1500);assert.equal(f.minLotSizeSqft,5000);assert.deepEqual(f.neighborhood,['Test subdivision']);assert.equal(f.minListDate,undefined);
 assert.deepEqual(searchFilters({newConstruction:'true',location:'Conroe'},config).city,['Conroe']);
 assert.equal(searchFilters({newConstruction:'false'},config)._newConstruction,undefined);
 assert.throws(()=>searchFilters({newConstruction:'yes'},config));
 assert.throws(()=>searchFilters({newConstruction:'true',forSale:'0'},config));
});
test('discovers MLS affirmative values and fails closed without the field',async()=>{
 for(const [field,values,expected] of [['NewConstructionYN',{'true':5,'false':7},['true']],['NewConstruction',{'Yes':9,'No':3,'Unknown':2},['Yes']]]){
 const result=await newConstructionFilter({boardId:['147']},'synthetic-key',async url=>{const q=new URL(url).searchParams;assert.equal(q.get('listings'),'false');assert.deepEqual(q.getAll('boardId'),['147']);return{ok:true,json:async()=>({aggregates:{raw:{[field]:values}}})};});
 assert.deepEqual(result,{['raw.'+field]:expected});
 }
 await assert.rejects(newConstructionFilter({},'',async()=>({ok:true,json:async()=>({})})),/unavailable/);
});
test('provider receives new construction alongside other criteria on results and map requests',async()=>{
 const requests=[];
 await queryListings(searchFilters({newConstruction:'true',location:'Conroe',minPrice:'250000',maxPrice:'450000',beds:'3',baths:'2'},config),config,'synthetic-key',async url=>{
 const q=new URL(url).searchParams;
 if(q.get('aggregates')?.includes('raw.NewConstruction'))return{ok:true,json:async()=>({aggregates:{raw:{NewConstructionYN:{true:8,false:12}}}})};
 requests.push(q);
 return{ok:true,json:async()=>({listings:[],count:0,page:1,numPages:0,aggregates:{map:{clusters:[]}}})};
 });
 assert.ok(requests.length>0);
 for(const q of requests){assert.equal(q.get('raw.NewConstructionYN'),'true');assert.equal(q.get('city'),'Conroe');assert.equal(q.get('minPrice'),'250000');assert.equal(q.get('maxPrice'),'450000');assert.equal(q.get('minBedroomsTotal'),'3');assert.equal(q.get('minBaths'),'2');}
});

test('an ignored new-construction field cannot return a broader result set',async()=>{
 await assert.rejects(queryListings(searchFilters({newConstruction:'true'},config),config,'synthetic-key',async url=>{
  const q=new URL(url).searchParams;
  if(q.has('aggregates'))return{ok:true,json:async()=>({aggregates:{raw:{NewConstructionYN:{true:8}}}})};
  return{ok:true,json:async()=>({listings:[],unrecognizedParams:['raw.NewConstructionYN']})};
 }),/unavailable/);
});

test('new construction survives inquiry and result links',async()=>{
 const {campaignDefaults,resultsUrl,searchInquiryUrl}=await import('../src/lib/funnelSession.js');
 const link=searchInquiryUrl({newConstruction:'true',location:'77304',minPrice:'250000',maxPrice:'450000',beds:'3',baths:'2'});
 const query=new URL(link,'https://example.test').searchParams;
 const form=campaignDefaults(query);
 assert.equal(form.newConstruction,'true');
 const result=new URL(resultsUrl(form),'https://example.test').searchParams;
 for(const key of ['newConstruction','location','minPrice','maxPrice','beds','baths'])assert.equal(result.get(key),query.get(key));
});
