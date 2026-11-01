import assert from 'node:assert/strict';
import {searchFilters} from '../server/repliers.js';
import {newConstructionFilter} from '../server/new-construction.js';
import {countyFromLocation} from '../src/lib/countyLocation.js';
if(process.env.VERCEL_ENV==='production'){
 const key=process.env.REPLIERS_API_KEY;assert.ok(key,'Provider credential is required for county acceptance.');
 const config={boards:String(process.env.GCR_IDX_BOARD_IDS||'').split(',').filter(Boolean),mode:'public'};
 const report=[];
 for(const location of ['Montgomery County','Harris County','montgomery county','Montgomery County, TX']){
  const input={location,minPrice:'300000',maxPrice:'500000',beds:'3',baths:'2',newConstruction:'true'};
  const filters=searchFilters(input,config);const native=await newConstructionFilter(filters,key);const flag=Object.keys(native)[0];
  const params=new URLSearchParams();for(const[k,v]of Object.entries({...filters,...native,resultsPerPage:100,fields:'mlsNumber,address.area,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,raw.NewConstructionYN,raw.NewConstruction'}))if(!k.startsWith('_'))for(const item of Array.isArray(v)?v:[v])params.append(k,String(item));
  const response=await fetch('https://api.repliers.io/listings?'+params,{method:'POST',headers:{'REPLIERS-API-KEY':key,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(25000)});assert.equal(response.status,200);const data=await response.json();assert.ok(!data.unrecognizedParams?.length);assert.ok(data.listings?.length>0,'County search must return real matches.');
  for(const l of data.listings){assert.equal(String(l.address?.area).replace(/\s+county$/i,'').toLowerCase(),countyFromLocation(location).toLowerCase());assert.ok(Number(l.listPrice)>=300000&&Number(l.listPrice)<=500000);assert.ok(Number(l.details?.numBedrooms)+Number(l.details?.numBedroomsPlus||0)>=3);assert.ok(Number(l.details?.numBathrooms)>=2);assert.ok(native[flag].includes(String(l.raw?.[flag.slice(4)])));}
  report.push({location,total:data.count,checked:data.listings.length,countyAndOtherFiltersPassed:true});
 }
 console.log('COUNTY_ACCEPTANCE '+JSON.stringify(report));
}else console.log('Live county acceptance runs in the production build environment.');
