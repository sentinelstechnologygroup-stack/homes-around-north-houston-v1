export function closeStroke(points){
 const clean=points.filter((p,i)=>!i||p[0]!==points[i-1][0]||p[1]!==points[i-1][1]);
 if(clean.length<3)throw Error('Draw an area, or click at least three corners.');
 const step=Math.max(1,Math.ceil(clean.length/78)),ring=clean.filter((_,i)=>i%step===0);
 if(ring.length<3)throw Error('Draw a larger area.');
 if(ring[0][0]!==ring.at(-1)[0]||ring[0][1]!==ring.at(-1)[1])ring.push(ring[0]);
 return ring;
}
