export function ringFrom(input) {
  let points;try{points=JSON.parse(input);}catch{throw new Error('Invalid drawn area.');}
  if(!Array.isArray(points)||points.length<4||points.length>81||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v))||Math.abs(p[0])>180||Math.abs(p[1])>85))throw new Error('Invalid drawn area.');
  if(points[0][0]!==points.at(-1)[0]||points[0][1]!==points.at(-1)[1])throw new Error('Close the drawn area before searching.');
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  if(Math.max(...xs)-Math.min(...xs)>3||Math.max(...ys)-Math.min(...ys)>3)throw new Error('Draw a smaller search area.');
  let area=0;for(let i=0;i<points.length-1;i++)area+=points[i][0]*points[i+1][1]-points[i+1][0]*points[i][1];
  if(Math.abs(area)<1e-10)throw new Error('Draw an area with at least three distinct corners.');
  return points;
}
export function intersectBox(ring,[w,s,e,n]) {
  let points=ring.slice(0,-1);
  for(const [axis,edge,sign] of [[0,w,1],[0,e,-1],[1,s,1],[1,n,-1]]){
    const output=[];for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],insideA=(a[axis]-edge)*sign>=0,insideB=(b[axis]-edge)*sign>=0;
      const crossing=()=>{const t=(edge-a[axis])/(b[axis]-a[axis]);return [a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];};
      if(insideA&&insideB)output.push(b);else if(insideA)output.push(crossing());else if(insideB)output.push(crossing(),b);
    }points=output;if(points.length<3)return null;
  }
  return [...points,points[0]];
}
