// Spread the first price from every provider cell before filling in dense cells.
// Labels compete in screen pixels so zooming reveals more homes without overlaps.
export function mapMarkers(clusters, listings, project, size=null) {
  const coincident=c=>c.listings?.length>1&&c.listings.every(h=>String(h.coordinates)===String(c.listings[0].coordinates));
  const pools=clusters.map(c=>c.listing?[c.listing]:coincident(c)?[]:(c.listings||[]));
  pools.push(listings);
  const prices=[],groups=[],seen=new Set(),occupied=[];
  const reserve=(point,width,height)=>{
    const p=project(point);
    if(size&&(p.x<0||p.y<0||p.x>size.x||p.y>size.y))return false;
    if(occupied.some(b=>Math.abs(p.x-b.x)<(width+b.width)/2 && Math.abs(p.y-b.y)<(height+b.height)/2))return false;
    occupied.push({x:p.x,y:p.y,width,height});return true;
  };
  const depth=Math.max(0,...pools.map(p=>p.length));
  for(let i=0;i<depth;i++)for(const pool of pools){
    const home=pool[i];if(!home?.coordinates)continue;
    const id=home.boardId+':'+home.mlsNumber;if(seen.has(id))continue;seen.add(id);
    if(prices.length<250&&reserve(home.coordinates,62,26))prices.push(home);
  }
  for(const c of clusters)if(!c.listing && (!(c.listings?.length)||coincident(c)) && reserve(c.coordinates,38,38))groups.push(c);
  return {prices,groups};
}
