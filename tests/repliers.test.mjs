import test from 'node:test';
import assert from 'node:assert/strict';
import { configuration, searchFilters, projectListing, queryListings } from '../server/repliers.js';
import handler from '../api/idx.js';
const env={GCR_IDX_MODE:'limited',VERCEL_ENV:'preview',GCR_IDX_REVIEW_HOST:'review.vercel.app',REPLIERS_API_KEY:'test-secret',GCR_IDX_BOARD_IDS:'123',GCR_IDX_PILOT_MLS_NUMBERS:'12345678',GCR_IDX_PERMISSIONS_VERIFIED:'true',GCR_IDX_PERMISSION_EVIDENCE:'test-only',GCR_IDX_DISCLOSURE:'Test disclosure'};
const config=configuration(env,'review.vercel.app');
const fixture={mlsNumber:'12345678',boardId:123,status:'A',permissions:{displayInternetEntireListing:'Y',displayPublic:'Y',displayAddressOnInternet:'N'},address:{streetName:'Private address',city:'Houston'},details:{description:'Synthetic test only'},images:['test.jpg','../secret','https://evil.example/image'],comparables:[{private:'secret'}],privateRemarks:'secret'};
test('default-off and independent licensing/host gates',()=>{
 assert.equal(configuration({},'goldencrossrealty.com').enabled,false);assert.equal(config.enabled,true);
 for(const key of ['REPLIERS_API_KEY','GCR_IDX_BOARD_IDS','GCR_IDX_PILOT_MLS_NUMBERS','GCR_IDX_PERMISSIONS_VERIFIED','GCR_IDX_PERMISSION_EVIDENCE','GCR_IDX_DISCLOSURE'])assert.equal(configuration({...env,[key]:''},'review.vercel.app').enabled,false,key);
 assert.equal(configuration(env,'goldencrossrealty.com').enabled,false);assert.equal(configuration({...env,VERCEL_ENV:'production'},'review.vercel.app').enabled,false);
 assert.equal(configuration({...env,GCR_IDX_MODE:'public'},'goldencrossrealty.com').enabled,false);
 const approved={...env,GCR_IDX_MODE:'public',GCR_IDX_PUBLIC_DISPLAY_AUTHORIZED:'true',GCR_IDX_ACCEPTANCE_PASSED:'true'};
 assert.equal(configuration(approved,'goldencrossrealty.com').enabled,true);assert.equal(configuration(approved,'gms.example').enabled,false);
});
test('filter mapping, bounds, scope, unsupported criteria',()=>{
 const f=searchFilters({location:'77301',forSale:'0',minPrice:'100',maxPrice:'500',beds:'3',baths:'2',page:'2',propertyType:'2'},config);
 assert.equal(f.zip,'77301');assert.equal(f.type,'lease');assert.equal(f.class,'condo');assert.equal(f.minBedroomsTotal,3);assert.equal(f.pageNum,2);assert.deepEqual(f.mlsNumber,['12345678']);assert.deepEqual(f.boardId,['123']);
 assert.deepEqual(searchFilters({location:'Houston, TX'},config).city,['Houston']);
 for(const input of [{tenantId:'other'},{page:'1001'},{minPrice:'500',maxPrice:'100'},{mlsNumber:'99999999',boardId:'123'},{mlsNumber:'12345678',boardId:'456'},{foreclosures:'true'},{propertyType:'3'},{location:['Houston']},{page:'NaN'}])assert.throws(()=>searchFilters(input,config));
});
test('display policy and projection remove private data',()=>{
 for(const l of [{...fixture,permissions:{}},{...fixture,boardId:456},{...fixture,status:'U'},{...fixture,mlsNumber:'99999999'}])assert.equal(projectListing(l,config),null);
 const p=projectListing(fixture,config);assert.equal(p.address,'Address available on request');assert.deepEqual(p.images,['https://cdn.repliers.io/test.jpg']);assert.equal('privateRemarks' in p,false);assert.equal('comparables' in p,false);
});
test('server-only credential and generic upstream failures',async()=>{
 let seen;const result=await queryListings(searchFilters({},config),config,'test-secret',async(url,options)=>{seen={url,options};return{ok:true,json:async()=>({listings:[fixture,{...fixture,boardId:456}],page:1,numPages:2})};});
 assert.equal(seen.url.includes('test-secret'),false);assert.equal(seen.options.headers['REPLIERS-API-KEY'],'test-secret');assert.equal(result.listings.length,1);assert.equal(result.hasMore,true);assert.equal(JSON.stringify(result).includes('test-secret'),false);
 await assert.rejects(queryListings({},config,'test-secret',async()=>({ok:false})),/Provider unavailable/);
});
test('disabled endpoint and cache policy',async()=>{
 const saved=process.env.GCR_IDX_MODE;process.env.GCR_IDX_MODE='off';const headers={};let status,body;const response={setHeader:(k,v)=>{headers[k]=v;return response;},status:code=>{status=code;return response;},end:value=>{body=JSON.parse(value);}};
 try{await handler({method:'GET',headers:{host:'goldencrossrealty.com'},query:{}},response);assert.equal(status,503);assert.equal(headers['Cache-Control'],'no-store');assert.equal('listings' in body,false);await handler({method:'GET',headers:{},query:{action:'config'}},response);assert.equal(body.enabled,false);}finally{if(saved===undefined)delete process.env.GCR_IDX_MODE;else process.env.GCR_IDX_MODE=saved;}
});

test('protected preview uses only its trusted deployment hostname when no explicit review host is set',()=>{
 const preview={...env,GCR_IDX_REVIEW_HOST:'',VERCEL_URL:'immutable-preview.vercel.app'};
 assert.equal(configuration(preview,'immutable-preview.vercel.app').enabled,true);
 assert.equal(configuration(preview,'unrelated.vercel.app').enabled,false);
 assert.equal(configuration({...preview,VERCEL_ENV:'production'},'immutable-preview.vercel.app').enabled,false);
 assert.equal(configuration({...preview,VERCEL_URL:''},'immutable-preview.vercel.app').enabled,false);
});

test('full preview expands inventory only behind the preview host gate',()=>{
 const full={...env,GCR_IDX_MODE:'preview'};
 const c=configuration(full,'review.vercel.app');
 assert.equal(c.enabled,true);assert.equal(searchFilters({},c).mlsNumber,undefined);
 assert.equal(configuration(full,'goldencrossrealty.net').enabled,false);
 assert.equal(configuration({...full,VERCEL_ENV:'production'},'review.vercel.app').enabled,false);
 const f=searchFilters({bounds:'-95.8,30,-95.1,30.6',waterfront:'true',beds:'3',minSqft:'1500',newListings:'true'},c);
 assert.equal(f.minBedroomsTotal,3);assert.equal(f.waterfront,'Y');assert.equal(f.minSqft,1500);assert.ok(f.minListDate);assert.equal(JSON.parse(f.map)[0].length,5);
 for(const bounds of ['0,0,100,100','NaN,30,-95,31','-95,31,-96,30'])assert.throws(()=>searchFilters({bounds},c));
 assert.throws(()=>searchFilters({ids:Array(13).fill('12345678').join(',')},c));
});

test('address privacy also removes exact map coordinates',()=>{
 const coordinates={...fixture,map:{latitude:'30.3',longitude:'-95.4'}};
 assert.equal(projectListing(coordinates,config).coordinates,null);
 assert.deepEqual(projectListing({...coordinates,permissions:{...fixture.permissions,displayAddressOnInternet:'Y'}},config).coordinates,[30.3,-95.4]);
 assert.equal(projectListing({...coordinates,permissions:{...fixture.permissions,displayPublic:'N'}},config),null);
});
