// Repliers documents these sizes on its existing licensed listing-photo CDN.
export function listingImageUrl(source,size='medium'){
 if(typeof source!=='string')return '';
 try{const url=new URL(source);if(url.protocol!=='https:'||url.hostname!=='cdn.repliers.io'||!['small','medium','large'].includes(size))return source;url.searchParams.set('class',size);return url.href;}catch{return source;}
}
export function listingImageSources(source,sizes=['small','medium']){
 if(!source||!source.startsWith('https://cdn.repliers.io/'))return undefined;
 const widths={small:400,medium:800,large:1600};return sizes.map(size=>`${listingImageUrl(source,size)} ${widths[size]}w`).join(', ');
}
