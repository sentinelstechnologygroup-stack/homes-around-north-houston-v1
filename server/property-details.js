// Consumer-facing listing fields only; never forward raw MLS/private remarks.
const value=v=>typeof v==='number'&&Number.isFinite(v)?String(v):typeof v==='string'?v.trim().slice(0,700):'';
const list=v=>Array.isArray(v)?v.map(value).filter(Boolean).slice(0,30).join(', '):value(v);
export function propertyDetails(l){
 const d=l.details||{},lot=l.lot||{},c=l.condominium||{},tax=l.taxes||{};
 const rows=entries=>entries.map(([label,v])=>({label,value:list(v)})).filter(r=>r.value!=='');
 const currency=v=>value(v)!==''&&Number.isFinite(Number(v))?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v)):'';
 return {
  locality:l.permissions?.displayAddressOnInternet==='Y'?[l.address?.city,l.address?.state,l.address?.zip].filter(Boolean).join(', '):value(l.address?.city),
  sections:[
   {title:'Property overview',rows:rows([['Property type',d.propertyType],['Style',d.style],['Year built',d.yearBuilt],['Stories',c.stories],['Subdivision',l.permissions?.displayAddressOnInternet==='Y'?l.address?.neighborhood:''],['County',l.address?.area],['Living area',d.sqft?`${value(d.sqft)} sq ft`:''],['Lot size',lot.acres!=null?`${value(lot.acres)} acres`:''],['Lot dimensions',lot.dimensions]])},
   {title:'Interior features',rows:rows([['Bedrooms',d.numBedrooms],['Bathrooms (total)',d.numBathrooms],['Half bathrooms',d.numBathroomsHalf],['Heating',d.heating],['Cooling',d.airConditioning],['Flooring',d.flooringType],['Fireplaces',d.numFireplaces],['Appliances & features',d.extras],['Energy features',d.energuideRating]])},
   {title:'Exterior & utilities',rows:rows([['Construction',list([d.exteriorConstruction1,d.exteriorConstruction2])],['Foundation',d.foundationType],['Roof',d.roofMaterial],['Garage spaces',d.numGarageSpaces],['Parking spaces',d.numParkingSpaces],['Parking',c.parkingType],['Patio / porch',d.patio],['Pool',d.swimmingPool],['Waterfront',d.waterfront],['Lot features',lot.features],['Community amenities',c.amenities],['Water source',d.waterSource],['Sewer',d.sewer||d.landSewer]])},
   {title:'HOA & property taxes',rows:rows([['HOA fee',d.HOAFee!=null?`${currency(d.HOAFee)} · payment frequency not supplied`:''],['Annual property tax',currency(tax.annualAmount)],['Tax / assessment year',tax.assessmentYear]])},
  ].filter(s=>s.rows.length),
  rooms:(Array.isArray(l.rooms)?l.rooms:[]).slice(0,60).map(r=>({name:value(r.description),level:value(r.level),dimensions:[value(r.length),value(r.width)].filter(Boolean).join(' × '),features:list([r.features,r.features2,r.features3])})).filter(r=>r.name),
 };
}
