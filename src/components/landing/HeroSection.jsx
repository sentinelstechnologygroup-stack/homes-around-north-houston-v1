import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, DollarSign, MapPin, ChevronDown } from "lucide-react";

const HERO_IMG = "/images/hero/north-houston-hero.webp";

const priceOptions = [150000, 200000, 250000, 300000, 350000, 400000, 500000, 600000, 750000, 1000000, 1500000, 2000000];
const priceLabel = value => '$' + value.toLocaleString('en-US');

export default function HeroSection() {
  const navigate = useNavigate();
  const [playVideo, setPlayVideo] = useState(false);
  const [filters, setFilters] = useState({location:'',minPrice:'',maxPrice:'',beds:'',baths:''});
  const [searchError, setSearchError] = useState('');
  const update = (key,value) => { setFilters(current=>({...current,[key]:value}));setSearchError(''); };
  const search = event => {
    event.preventDefault();
    if(filters.minPrice && filters.maxPrice && Number(filters.minPrice)>Number(filters.maxPrice)) {
      setSearchError('Choose a maximum price that is at least the minimum price.');return;
    }
    const params = new URLSearchParams();
    const incoming = new URLSearchParams(window.location.search);
    for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid','campaign']) if(incoming.has(key)) params.set(key,incoming.get(key));
    for(const [key,value] of Object.entries(filters)) if(value.trim()) params.set(key,value.trim());
    navigate(`/homes${params.size?'?'+params:''}`);
  };


  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {playVideo ? <video autoPlay muted loop playsInline preload="none" className="w-full h-full object-cover" poster={HERO_IMG}>
          <source src="/videos/hero/north-houston-hero.mp4" type="video/mp4" />
        </video> : <img src={HERO_IMG} alt="" width="1600" height="900" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/70 via-[#0A192F]/50 to-[#0A192F]/90" />
      </div>

      <button type="button" onClick={() => setPlayVideo(current => !current)} aria-pressed={playVideo} className="absolute bottom-3 right-4 z-20 text-white/80 text-xs underline underline-offset-4">{playVideo ? "Pause background video" : "Play background video"}</button>
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid items-center gap-8 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          >
            Buy, Sell & Invest in North Houston
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6"
          >
            North Houston
            <br />
            Real Estate
            <br />
            <span className="text-[#C5A059]">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 font-body text-lg md:text-xl leading-relaxed mb-4 max-w-xl"
          >
            Find your next home, plan your sale, or explore an investment property.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden sm:block text-white/60 font-body text-base leading-relaxed mb-8 max-w-xl"
          >
            Search homes across North Houston and talk with Golden Cross Realty about buying, selling, or exploring investment properties. Start with the properties, neighborhoods, and market information that fit your goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden flex-wrap items-center gap-4 lg:flex"
          >
            <button
              onClick={() => navigate("/?interest=selling#contact")}
              className="px-8 py-3.5 border-2 border-white/30 text-white font-body font-semibold text-base rounded hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Request Home Value Analysis
            </button>
            <button onClick={() => navigate("/?interest=investing#contact")} className="text-white/85 underline underline-offset-4 font-body text-sm hover:text-[#C5A059]">Explore Investment Properties</button>
          </motion.div>
        </div>

        <div className="max-w-5xl rounded-2xl bg-white p-5 text-[#0A192F] shadow-2xl sm:p-7" aria-labelledby="hero-search-heading">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#C5A059]/15"><Search className="h-5 w-5" aria-hidden="true" /></span>
            <div><h2 id="hero-search-heading" className="font-display text-2xl font-semibold">Find your next home</h2><p className="mt-1 text-sm text-[#0A192F]/70">Explore homes for sale across North Houston.</p></div>
          </div>
          <form onSubmit={search} aria-label="Search homes for sale" className="space-y-4">
            <div className="grid gap-3 xl:grid-cols-[1fr_auto]">
              <label className="block text-sm font-semibold">City, ZIP code or MLS number
                <span className="relative mt-2 block"><MapPin aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0A192F]/50" /><input type="search" value={filters.location} onChange={e=>update('location',e.target.value)} placeholder="Try Conroe, 77304 or an MLS number" maxLength={100} className="min-h-14 w-full rounded-lg border border-[#0A192F]/25 bg-white py-3 pl-12 pr-4 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#C5A059]" /></span>
              </label>
              <button type="submit" className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#C5A059] px-8 py-3 font-semibold text-[#0A192F] transition-colors hover:bg-[#B08A3E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A192F] xl:self-end"><Search aria-hidden="true" className="h-5 w-5" />Search Homes</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['minPrice','Min price','No minimum'],['maxPrice','Max price','No maximum'],['beds','Beds','Any beds'],['baths','Baths','Any baths']].map(([key,label,placeholder])=><label key={key} className="block min-w-0 text-sm font-semibold">{label}<select value={filters[key]} onChange={e=>update(key,e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-[#0A192F]/25 bg-white px-3 py-3 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#C5A059]"><option value="">{placeholder}</option>{(key.endsWith('Price')?priceOptions:[1,2,3,4,5]).map(value=><option key={value} value={value}>{key.endsWith('Price')?priceLabel(value):`${value}+`}</option>)}</select></label>)}
            </div>
            {searchError && <p role="alert" className="text-sm font-medium text-red-700">{searchError}</p>}
            <p className="text-xs leading-relaxed text-[#0A192F]/65">Browse the map and property details, then ask the Golden Cross Realty office team for help.</p>
          </form>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:hidden">
          <button type="button" onClick={()=>navigate('/?interest=selling#contact')} className="rounded border border-white/40 px-5 py-3 text-sm font-semibold text-white">Request Home Value Analysis</button>
          <button type="button" onClick={()=>navigate('/?interest=investing#contact')} className="text-sm text-white underline underline-offset-4">Explore Investment Properties</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-6 h-6 text-[#C5A059]" />
      </motion.div>
    </section>
  );
}
