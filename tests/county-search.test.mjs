import test from 'node:test';import assert from 'node:assert/strict';
import {countyFromLocation} from '../src/lib/countyLocation.js';
import {searchFilters} from '../server/repliers.js';
import {projectLocations,locationAutocomplete} from '../server/location-autocomplete.js';
import {savedSearches} from '../src/lib/savedSearchFilters.js';
const config={boards:['147'],mode:'public'};
test('county names are distinct from cities and combine with other criteria',()=>{
 for(const value of ['Montgomery County','Montgomery County, TX','county: Montgomery']){
  const f=searchFilters({location:value,minPrice:'300000',maxPrice:'500000',beds:'4',baths:'3',newConstruction:'true'},config);
  assert.equal(f.area,'Montgomery');assert.equal(f.city,undefined);assert.equal(f.minPrice,300000);assert.equal(f.maxPrice,500000);assert.equal(f.minBedroomsTotal,4);assert.equal(f.minBaths,3);assert.equal(f._newConstruction,true);
 }
 assert.deepEqual(searchFilters({location:'Montgomery'},config).city,['Montgomery']);assert.equal(searchFilters({location:'77304'},config).zip,'77304');assert.equal(countyFromLocation('Harris County, Texas'),'Harris');
});
test('county suggestions are labeled and use an explicit county search value',async()=>{
 const item={name:'Montgomery',type:'area',source:'MLS',boardId:147,address:{state:'TX',area:'Montgomery'}};
 const suggestion=projectLocations([item])[0];assert.equal(suggestion.kind,'area');assert.equal(suggestion.location,'Montgomery County');assert.equal(suggestion.label,'Montgomery County, TX');
 let query;await locationAutocomplete('Montgomery County',config,'synthetic-key',async url=>{query=new URL(url).searchParams;return{ok:true,json:async()=>({locations:[item]})};});assert.deepEqual(query.getAll('type'),['area']);assert.equal(query.get('search'),'Montgomery');
 const reopened=savedSearches(JSON.parse(JSON.stringify([{name:'County homes',filters:{location:suggestion.location,newConstruction:'true',minPrice:'300000',maxPrice:'500000',beds:'4',baths:'3'}}])));assert.equal(searchFilters(reopened[0].filters,config).area,'Montgomery');
});
