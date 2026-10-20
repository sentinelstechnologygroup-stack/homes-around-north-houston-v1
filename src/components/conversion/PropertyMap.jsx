import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function PropertyMap({ listings, onOpen, onBounds, bounded }) {
  const container=useRef(null), map=useRef(null), layer=useRef(null), leaflet=useRef(null);
  const callbacks=useRef({onOpen,onBounds});
  useEffect(()=>{callbacks.current={onOpen,onBounds};},[onOpen,onBounds]);
  useEffect(()=>{
    let cancelled=false;
    import('leaflet').then(module=>{
      if(cancelled || !container.current)return;
      const L=module.default;leaflet.current=L;
      const instance=L.map(container.current,{scrollWheelZoom:false}).setView([30.31,-95.46],10);
      map.current=instance;layer.current=L.layerGroup().addTo(instance);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
      instance.on('moveend',()=>{const b=instance.getBounds();callbacks.current.onBounds([b.getWest(),b.getSouth(),b.getEast(),b.getNorth()].map(v=>v.toFixed(5)).join(','));});
      instance.fire('moveend');
    });
    return ()=>{cancelled=true;map.current?.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    let cancelled=false;
    import('leaflet').then(module=>{
      if(cancelled || !map.current || !layer.current)return;
      const L=module.default;layer.current.clearLayers();
      const positions=[];
      for(const listing of listings){
        if(!listing.coordinates)continue;
        positions.push(listing.coordinates);
        const label=Number.isFinite(Number(listing.price))?'$'+Math.round(Number(listing.price)/1000)+'k':'Home';
        const button=document.createElement('button');button.type='button';button.textContent=listing.address+' — View property';button.onclick=()=>callbacks.current.onOpen(listing);
        L.marker(listing.coordinates,{icon:L.divIcon({className:'property-map-pin',html:'<span>'+label+'</span>',iconSize:[64,30],iconAnchor:[32,30]}),title:listing.address,keyboard:true}).bindPopup(button).addTo(layer.current);
      }
      if(positions.length && !bounded)map.current.fitBounds(L.latLngBounds(positions),{padding:[36,36],maxZoom:13});
    });
    return ()=>{cancelled=true;};
  },[listings,bounded]);
  return <div ref={container} role="region" aria-label="Property map. Select a price marker to view a home." style={{height:460,width:'100%',borderRadius:16,zIndex:0}} />;
}
