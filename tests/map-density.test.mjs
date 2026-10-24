import test from 'node:test';
import assert from 'node:assert/strict';
import {mapMarkers} from '../src/lib/mapMarkers.js';
import {mapClusters,searchFilters} from '../server/repliers.js';
const config={mode:'public',boards:['147']};
const home=(id,x,y)=>({boardId:'147',mlsNumber:String(id),coordinates:[y,x],price:300000});
const project=([y,x])=>({x,y});
test('dense areas leave room for surrounding-area prices and labels do not overlap',()=>{
 const cells=Array.from({length:100},(_,i)=>({listings:Array.from({length:100},(_,j)=>home(i+'-'+j,(i%10)*80+j*.01,Math.floor(i/10)*40+j*.01))}));
 const result=mapMarkers(cells,[],project);assert.equal(result.prices.length,100);
 for(let i=0;i<result.prices.length;i++)for(let j=0;j<i;j++){const a=project(result.prices[i].coordinates),b=project(result.prices[j].coordinates);assert.ok(Math.abs(a.x-b.x)>=62||Math.abs(a.y-b.y)>=26);}
});
test('duplicate MLS records, offscreen pins and shared coordinates are handled',()=>{
 const a=home('a',40,40),b=home('b',40,40),outside=home('outside',500,500);
 const one=mapMarkers([],[a,a,outside],project,{x:100,y:100});assert.equal(one.prices.length,1);
 const group=mapMarkers([{count:2,coordinates:a.coordinates,listings:[a,b]}],[],project);assert.equal(group.prices.length,0);assert.equal(group.groups.length,1);
});
test('provider cap never triggers a coarser metro-wide replacement',async()=>{
 let calls=0;
 const result=await mapClusters(searchFilters({minPrice:'250000',maxPrice:'400000',mapZoom:'11',mapViewport:'-95.9,29.58,-94.9,30.1'},config),config,'test',async url=>{
  calls++;const q=new URL(url).searchParams;assert.equal(q.get('minPrice'),'250000');assert.equal(q.get('maxPrice'),'400000');assert.ok(q.has('map'));assert.ok(Number(q.get('clusterPrecision'))>=22);assert.equal(q.get('clusterListingsThreshold'),'100');
  return {ok:true,json:async()=>({listings:[],count:20000,aggregates:{map:{clusters:[{count:100,location:{latitude:30,longitude:-95.5},bounds:{top_left:{latitude:30.01,longitude:-95.51},bottom_right:{latitude:29.99,longitude:-95.49}}}]}}})};
 });assert.equal(calls,1);assert.equal(result.mapCoverage,'sampled');assert.equal(result.clusters[0].count,100);
});
