import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, DollarSign, MapPin, Home, ChevronDown } from "lucide-react";

const HERO_IMG = "/images/hero/north-houston-hero.webp";

const priceRanges = [
  "Any Price",
  "$100k – $250k",
  "$250k – $500k",
  "$500k – $750k",
  "$750k – $1M",
  "$1M+",
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [playVideo, setPlayVideo] = useState(false);
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [priceRange, setPriceRange] = useState("Any Price");
  const search = (event) => {
    event.preventDefault();
    const prices = { "$100k – $250k": [100000, 250000], "$250k – $500k": [250000, 500000], "$500k – $750k": [500000, 750000], "$750k – $1M": [750000, 1000000], "$1M+": [1000000, ""] };
    const [minPrice, maxPrice] = prices[priceRange] || ["", ""];
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ city, zip, neighborhood, minPrice, maxPrice })) if (value) params.set(key, String(value));
    navigate(`/homes?${params}`);
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
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
            className="text-white/60 font-body text-base leading-relaxed mb-8 max-w-xl"
          >
            Search homes across North Houston and talk with Golden Cross Realty about buying, selling, or exploring investment properties. Start with the properties, neighborhoods, and market information that fit your goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button
              onClick={() => navigate("/homes")}
              className="px-8 py-3.5 bg-[#C5A059] text-[#0A192F] font-body font-semibold text-base rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              <Search className="w-4 h-4" />
              Search Homes
            </button>
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 md:p-6 max-w-4xl"
        >
          <form onSubmit={search} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <input
                type="text"
                placeholder="City"
                aria-label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <input
                type="text"
                placeholder="Zip Code"
                aria-label="ZIP code"
                inputMode="numeric"
                pattern="[0-9]{5}"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <input
                type="text"
                placeholder="Neighborhood"
                aria-label="Neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <select
                aria-label="Price range"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors appearance-none"
              >
                {priceRanges.map((p) => (
                  <option key={p} value={p} className="bg-[#0A192F] text-white">
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#C5A059] text-[#0A192F] font-body font-semibold rounded-lg hover:bg-[#B08A3E] transition-all duration-300 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </motion.div>
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
