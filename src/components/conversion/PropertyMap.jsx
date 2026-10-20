import {useEffect,useRef,useState} from 'react';
import 'leaflet/dist/leaflet.css';
export default function PropertyMap({listings,clusters=[],onOpen,onBounds,onSearchArea,onPolygon,bounds='',polygon='',boundary=null,fitKey=''}) {
 const container=useRef(null),map=useRef(null),pins=useRef(null),outlines=useRef(null),drawingLayer=useRef(null),L=useRef(null),callbacks=useRef({onOpen,onBounds,onSearchArea,onPolygon});
 const [ready,setReady]=useState(false),[auto,setAuto]=useState(false),[drawing,setDrawing]=useState(false),[points,setPoints]=useState([]);
 const drawingRef=useRef(false),autoRef=useRef(false),programmatic=useRef(false),lastFit=useRef(null),timer=useRef(null);
 useEffect(()=>{callbacks.current={onOpen,onBounds,onSearchArea,onPolygon};},[onOpen,onBounds,onSearchArea,onPolygon]);
 useEffect(()=>{autoRef.current=auto;},[auto]);
 useEffect(()=>{drawingRef.current=drawing;if(map.current){if(drawing)map.current.doubleClickZoom.disable();else map.current.doubleClickZoom.enable();}},[drawing]);
 useEffect(()=>{let cancelled=false;import('leaflet').then(module=>{
  if(cancelled||!container.current)return;L.current=module.default;const lib=L.current;
  const instance=lib.map(container.current,{scrollWheelZoom:true}).setView([30.31,-95.46],10);map.current=instance;
  pins.current=lib.layerGroup().addTo(instance);outlines.current=lib.layerGroup().addTo(instance);drawingLayer.current=lib.layerGroup().addTo(instance);
  lib.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
  instance.on('click',e=>{if(drawingRef.current)setPoints(p=>p.length<80?[...p,[Number(e.latlng.lng.toFixed(5)),Number(e.latlng.lat.toFixed(5))]]:p);});
  instance.on('movestart',()=>clearTimeout(timer.current));
  instance.on('moveend',()=>{const b=instance.getBounds(),value=[b.getWest(),b.getSouth(),b.getEast(),b.getNorth()].map(v=>v.toFixed(5)).join(',');callbacks.current.onBounds(value);if(programmatic.current){programmatic.current=false;return;}if(autoRef.current&&!drawingRef.current)timer.current=setTimeout(()=>callbacks.current.onSearchArea(value,instance.getZoom()),850);});
  setReady(true);
 });return()=>{cancelled=true;clearTimeout(timer.current);map.current?.remove();map.current=null;};},[]);
 useEffect(()=>{if(!ready)return;const lib=L.current;pins.current.clearLayers();const positions=[];
  for(const cluster of clusters){positions.push(cluster.coordinates);const single=cluster.listing;
   const label=single&&Number.isFinite(Number(single.price))?'$'+Math.round(Number(single.price)/1000)+'k':cluster.count.toLocaleString()+' homes';
   L.current.marker(cluster.coordinates,{icon:lib.divIcon({className:'property-map-pin',html:'<span>'+label+'</span>',iconSize:[86,30],iconAnchor:[43,30]}),title:single?single.address:cluster.count.toLocaleString()+' matching properties',keyboard:true}).on('click',()=>{
    if(single){callbacks.current.onOpen(single);return;}const [w,s,e,n]=cluster.bounds;const pad=.0003;const value=[w===e?w-pad:w,s===n?s-pad:s,w===e?e+pad:e,s===n?n+pad:n];programmatic.current=true;map.current.fitBounds([[value[1],value[0]],[value[3],value[2]]],{padding:[24,24],maxZoom:17,animate:false});callbacks.current.onSearchArea(value.map(v=>v.toFixed(5)).join(','),map.current.getZoom());
   }).addTo(pins.current);
  }
  for(const home of (clusters.length?[]:listings)){if(!home.coordinates)continue;positions.push(home.coordinates);const button=document.createElement('button');button.type='button';button.textContent=home.address+' — View property';button.onclick=()=>callbacks.current.onOpen(home);
   lib.marker(home.coordinates,{icon:lib.divIcon({className:'property-map-pin',html:'<span>'+(Number.isFinite(Number(home.price))?'$'+Math.round(Number(home.price)/1000)+'k':'Home')+'</span>',iconSize:[64,30],iconAnchor:[32,30]}),title:home.address,keyboard:true}).bindPopup(button).addTo(pins.current);
  }
  const targetFitKey=fitKey+"|"+Boolean(boundary); if(lastFit.current!==targetFitKey&&(positions.length||boundary)) {lastFit.current=targetFitKey;programmatic.current=true;const b=bounds.split(',').map(Number);if(bounds&&b.length===4&&b.every(Number.isFinite))map.current.fitBounds([[b[1],b[0]],[b[3],b[2]]],{animate:false});else if(polygon)map.current.fitBounds(lib.latLngBounds(JSON.parse(polygon).map(([lng,lat])=>[lat,lng])),{padding:[24,24],maxZoom:15,animate:false});else if(boundary)map.current.fitBounds(lib.geoJSON(boundary).getBounds(),{padding:[24,24],maxZoom:13,animate:false});else map.current.fitBounds(lib.latLngBounds(positions),{padding:[36,36],maxZoom:13,animate:false});}
 },[ready,listings,clusters,fitKey,boundary,bounds]);
 useEffect(()=>{if(!ready)return;const lib=L.current;outlines.current.clearLayers();if(boundary)lib.geoJSON(boundary,{style:{color:'#b58d44',weight:2,fillOpacity:.05,dashArray:'6 5'}}).addTo(outlines.current);
  if(polygon){try{lib.polygon(JSON.parse(polygon).map(([lng,lat])=>[lat,lng]),{color:'#176f78',weight:3,fillOpacity:.09}).addTo(outlines.current);}catch{/* Invalid stored shapes are rejected by the API. */}}
  if(bounds){const b=bounds.split(',').map(Number);if(b.length===4&&b.every(Number.isFinite))lib.rectangle([[b[1],b[0]],[b[3],b[2]]],{color:'#176f78',weight:2,fillOpacity:.025}).addTo(outlines.current);}
 },[ready,boundary,polygon,bounds]);
 useEffect(()=>{if(!ready)return;drawingLayer.current.clearLayers();if(points.length)L.current.polyline(points.map(([lng,lat])=>[lat,lng]),{color:'#176f78',weight:3}).addTo(drawingLayer.current);},[ready,points]);
 function finish(){if(points.length<3)return;callbacks.current.onPolygon(JSON.stringify([...points,points[0]]));setDrawing(false);setPoints([]);}
 return <><div className="ps-map-controls"><label className="ps-check"><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/>Search as I move the map</label><button type="button" onClick={()=>{setDrawing(!drawing);setPoints([]);}}>{drawing?'Cancel drawing':'Draw search area'}</button>{drawing&&<><button type="button" disabled={points.length<3} onClick={finish}>Finish area ({points.length} corners)</button><button type="button" disabled={!points.length} onClick={()=>setPoints(p=>p.slice(0,-1))}>Undo corner</button></>}</div><div ref={container} role="region" tabIndex={0} onKeyDown={e=>{if(drawing&&e.key==='Enter')finish();if(e.key==='Escape'){setDrawing(false);setPoints([]);}}} aria-label="Property map. Scroll to zoom, drag to move, or select a price marker." style={{height:'clamp(300px,42vh,480px)',width:'100%',borderRadius:16,zIndex:0}}/><p className="ps-small">{drawing?'Click at least three corners on the map, then select Finish area. Escape cancels.':'Scroll to zoom and drag to explore. Your city, ZIP and other search filters stay applied.'}</p></>;
}
