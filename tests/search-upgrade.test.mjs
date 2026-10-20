import test from 'node:test';
import assert from 'node:assert/strict';
import {searchFilters,queryListings,configuration,projectListing} from '../server/repliers.js';
import {intersectBox} from '../server/search-geometry.js';
const config={boards:['147'],mode:'public',disclosure:'HAR'};
const listing=(id,price=100)=>({mlsNumber:id,boardId:147,status:'A',standardStatus:'Active',listPrice:price,address:{streetName:id,city:'Conroe'},permissions:{displayInternetEntireListing:'Y',displayPublic:'Y',displayAddressOnInternet:'Y'},details:{},lot:{squareFeet:price}});
test('page sizes, complete market statuses and native sorting are forwarded without losing location',()=>{
 assert.equal(searchFilters({},config).resultsPerPage,48);
 assert.equal(searchFilters({pageSize:'96'},config).resultsPerPage,96);
 const f=searchFilters({location:'Conroe',pageSize:'100',page:'27',sort:'yearBuiltAsc',bounds:'-95.8,30.1,-95.6,30.3'},config);
 assert.equal(f.resultsPerPage,100);assert.equal(f.pageNum,27);assert.equal(f.sortBy,'yearBuiltAsc');assert.deepEqual(f.city,['Conroe']);assert.ok(f.standardStatus.includes('Pending'));assert.ok(f.standardStatus.includes('Coming Soon'));assert.equal(f.status,undefined);
 assert.throws(()=>searchFilters({pageSize:'10000'},config));
});
test('detail projection exposes organized public facts and more photos without leaking raw or restricted address fields',()=>{
 const raw={...listing('detail'),address:{streetName:'Home',city:'Conroe',zip:'77304',neighborhood:'Public subdivision'},details:{heating:'Gas',HOAFee:'650',privateRemarks:'SECRET'},taxes:{annualAmount:2500},rooms:[{description:'Bedroom',length:'12',width:'10',private:'SECRET'}],images:Array.from({length:35},(_,i)=>`photo${i}.jpg`)};
 const card=projectListing(raw,config),detail=projectListing(raw,config,true);
 assert.equal(card.images.length,12);assert.equal(card.propertyDetails,undefined);assert.equal(detail.images.length,35);
 assert.equal(detail.propertyDetails.rooms[0].dimensions,'12 × 10');assert.ok(detail.propertyDetails.sections.find(s=>s.title==='HOA & property taxes'));
 assert.ok(!JSON.stringify(detail).includes('SECRET'));
 const hidden=projectListing({...raw,permissions:{...raw.permissions,displayAddressOnInternet:'N'}},config,true);
 assert.equal(hidden.address,'Address available on request');assert.equal(hidden.coordinates,null);assert.ok(!JSON.stringify(hidden.propertyDetails).includes('77304'));assert.ok(!JSON.stringify(hidden.propertyDetails).includes('Public subdivision'));
});
test('drawn shape and viewport intersect; panning away never drops the city constraint',()=>{
 const ring=[[-95.5,30],[-95.3,30],[-95.3,30.2],[-95.5,30.2],[-95.5,30]];
 const f=searchFilters({location:'Conroe',polygon:JSON.stringify(ring),bounds:'-95.8,30.3,-95.6,30.5'},config);
 assert.deepEqual(f.city,['Conroe']);assert.equal(f._emptyArea,true);
 const clipped=intersectBox(ring,[-95.45,30.05,-95.35,30.15]);assert.ok(clipped.every(([x,y])=>x>=-95.45001&&x<=-95.34999&&y>=30.04999&&y<=30.15001));
 assert.throws(()=>searchFilters({polygon:'[[0,0],[1,1]]'},config));
});
test('provider total is independent of page length and pending listing still requires display permission',async()=>{
 const r=await queryListings(searchFilters({pageSize:'50'},config),config,'synthetic',async()=>({ok:true,json:async()=>({listings:[listing('one')],count:2867,page:1,numPages:58})}));
 assert.equal(r.total,2867);assert.equal(r.listings.length,1);assert.equal(r.hasMore,true);
 assert.ok(projectListing({...listing('pending'),status:'U',standardStatus:'Pending'},config));
 assert.equal(projectListing({...listing('closed'),status:'U',standardStatus:'Closed'},config),null);
 assert.equal(projectListing({...listing('hidden'),permissions:{}},config),null);
});
test('lot sorting ranks the complete match set before selecting the requested page',async()=>{
 const all=[listing('small',1),listing('big',50),listing('middle',10)];
 const fetcher=async url=>{const p=new URL(url).searchParams;const ids=p.getAll('mlsNumber');return {ok:true,json:async()=>({listings:ids.length?all.filter(l=>ids.includes(l.mlsNumber)):all,count:3,page:1,numPages:1})};};
 const r=await queryListings({...searchFilters({sort:'lotSizeDesc'},config),resultsPerPage:1,pageNum:2},config,'synthetic',fetcher);
 assert.equal(r.total,3);assert.equal(r.listings[0].mlsNumber,'middle');
});
test('public activation is limited to authorized custom domains',()=>{
 const env={GCR_IDX_MODE:'public',GCR_IDX_PUBLIC_DISPLAY_AUTHORIZED:'true',GCR_IDX_ACCEPTANCE_PASSED:'true',GCR_IDX_PERMISSIONS_VERIFIED:'true',GCR_IDX_PERMISSION_EVIDENCE:'synthetic approval',GCR_IDX_BOARD_IDS:'147',REPLIERS_API_KEY:'synthetic',GCR_IDX_DISCLOSURE:'HAR'};
 assert.equal(configuration(env,'goldencrossrealty.net').enabled,true);
 assert.equal(configuration(env,'www.homesaroundnorthhouston.com').enabled,true);
 assert.equal(configuration(env,'foreign.example').enabled,false);
});
test('map clusters represent all matches independently of the cards and exclude restricted-address records',async()=>{
 let mapQuery;
 const fetcher=async url=>{const p=new URL(url).searchParams;const clustered=p.get('cluster')==='true';if(clustered)mapQuery=p;
 return {ok:true,json:async()=>clustered?{listings:[],count:2867,aggregates:{map:{clusters:[{count:2867,location:{latitude:30.3,longitude:-95.4},bounds:{top_left:{latitude:30.5,longitude:-95.6},bottom_right:{latitude:30.1,longitude:-95.2}}}]}}}:{listings:[listing('one')],count:2867,page:1,numPages:58}};};
 const result=await queryListings(searchFilters({},config),config,'synthetic',fetcher);
 assert.equal(result.listings.length,1);assert.equal(result.clusters[0].count,2867);assert.equal(result.mapCoverage,'all');
 assert.equal(mapQuery.get('displayAddressOnInternet'),'Y');assert.equal(mapQuery.get('displayPublic'),'Y');assert.equal(mapQuery.get('listings'),'false');
});
