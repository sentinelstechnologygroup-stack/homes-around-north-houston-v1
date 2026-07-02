# Copy/Paste Replacements
These are the full replacement files changed during the cleanup.

**Updated fix:** Added Vite `@` alias directly in `vite.config.js` and removed unused `react-quill` after audit. `npm audit` now reports 0 vulnerabilities in this cleaned package lock.


## `package.json`
```json
{
  "name": "homes-around-north-houston",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --quiet",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc -p ./jsconfig.json",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hello-pangea/dnd": "^17.0.0",
    "@hookform/resolvers": "^4.1.2",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@stripe/react-stripe-js": "^3.0.0",
    "@stripe/stripe-js": "^5.2.0",
    "@tanstack/react-query": "^5.84.1",
    "canvas-confetti": "^1.9.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.5.2",
    "framer-motion": "^11.16.4",
    "html2canvas": "^1.4.1",
    "input-otp": "^1.4.2",
    "jspdf": "^4.2.1",
    "lodash": "^4.17.21",
    "lucide-react": "^0.475.0",
    "moment": "^2.30.1",
    "next-themes": "^0.4.4",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.54.2",
    "react-hot-toast": "^2.6.0",
    "react-leaflet": "^4.2.1",
    "react-markdown": "^9.0.1",
    "react-resizable-panels": "^2.1.7",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.15.4",
    "sonner": "^2.0.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.171.0",
    "vaul": "^1.1.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/node": "^22.13.5",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "baseline-browser-mapping": "^2.8.32",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "eslint-plugin-unused-imports": "^4.3.0",
    "globals": "^15.14.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vite": "^6.1.0"
  }
}

```

## `vite.config.js`
```javascript
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

```

## `README.md`
```markdown
# Homes Around North Houston

Static Vite/React landing site for Homes Around North Houston.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in `dist/`.

## Media assets

Local media should be stored under:

- `public/images/...`
- `public/videos/...`

The app references public assets with root-relative paths such as `/images/hero/north-houston-hero.png`.
```

## `src/App.jsx`
```jsx
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
```

## `src/lib/PageNotFound.jsx`
```jsx
import { useLocation } from 'react-router-dom'

export default function PageNotFound() {
  const location = useLocation()
  const pageName = location.pathname.substring(1) || 'unknown'

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">Page Not Found</h2>
            <p className="text-slate-600 leading-relaxed">
              The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => { window.location.href = '/' }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## `src/components/landing/HeroSection.jsx`
```jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, MapPin, Home, ChevronDown } from "lucide-react";

const HERO_IMG = "/images/hero/north-houston-hero.png";

const priceRanges = [
  "Any Price",
  "$100k – $250k",
  "$250k – $500k",
  "$500k – $750k",
  "$750k – $1M",
  "$1M+",
];

export default function HeroSection() {
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [priceRange, setPriceRange] = useState("Any Price");

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero/north-houston-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/70 via-[#0A192F]/50 to-[#0A192F]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          >
            North Houston's Trusted Resource
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
            Buy, Sell, Invest, and Connect with Trusted Local Professionals Across North Houston.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/60 font-body text-base leading-relaxed mb-8 max-w-xl"
          >
            Whether you're looking for your next home, preparing to sell, relocating to Texas, or searching for trusted local service providers, Homes Around North Houston connects you with the resources and professionals you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button
              onClick={() => scrollTo("#communities")}
              className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold text-base rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              <Search className="w-4 h-4" />
              Search Homes
            </button>
            <button
              onClick={() => scrollTo("#sellers")}
              className="px-8 py-3.5 border-2 border-white/30 text-white font-body font-semibold text-base rounded hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Get Home Value
            </button>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 md:p-6 max-w-4xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <input
                type="text"
                placeholder="City"
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
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <select
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
            <button className="w-full py-3 bg-[#C5A059] text-white font-body font-semibold rounded-lg hover:bg-[#B08A3E] transition-all duration-300 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
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
```

## `src/components/landing/BuyersSection.jsx`
```jsx
import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, GraduationCap, Landmark, Truck, ArrowRight, CheckCircle } from "lucide-react";
import SectionDivider from "./SectionDivider";

const BUYERS_IMG = "/images/buyers/luxury-home-interior.png";

const features = [
  { icon: Search, label: "Home Search Tools" },
  { icon: MapPin, label: "Neighborhood Guides" },
  { icon: GraduationCap, label: "School Information" },
  { icon: Landmark, label: "Mortgage Resources" },
  { icon: Truck, label: "Relocation Assistance" },
];

export default function BuyersSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="buyers" className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={BUYERS_IMG}
                alt="Luxury home interior for buyers"
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Inset frame */}
              <div className="absolute inset-4 border border-[#C5A059]/30 rounded-lg pointer-events-none" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-[#0A192F] text-white p-6 rounded-xl shadow-2xl">
              <p className="text-[#C5A059] font-display text-3xl font-semibold">2,500+</p>
              <p className="font-body text-white/70 text-sm">Homes Available</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              For Buyers
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0A192F] leading-tight mb-6">
              Find the Right Home
              <br />with Confidence
            </h2>
            <p className="font-body text-[#0A192F]/60 text-lg leading-relaxed mb-8">
              Access comprehensive tools and resources to navigate the North Houston real estate market with ease.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <span className="font-body text-[#0A192F] font-medium">{f.label}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => scrollTo("#communities")}
              className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              Start Your Home Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
```

## `src/components/landing/SellersSection.jsx`
```jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Hammer, Paintbrush, Trees, Droplets, Wrench, Sparkles, ClipboardCheck } from "lucide-react";
import SectionDivider from "./SectionDivider";

const SELLERS_IMG = "/images/sellers/home-curb-appeal.png";

const services = [
  { icon: Hammer, label: "Roofing" },
  { icon: Paintbrush, label: "Painting" },
  { icon: Trees, label: "Landscaping" },
  { icon: Droplets, label: "Pool Repairs" },
  { icon: Wrench, label: "Remodeling" },
  { icon: Sparkles, label: "Cleaning Services" },
  { icon: ClipboardCheck, label: "Home Inspections" },
];

export default function SellersSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="sellers" className="relative bg-[#0A192F] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              For Sellers
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
              Maximize Your
              <br />Home's Value
            </h2>
            <p className="font-body text-white/70 text-lg leading-relaxed mb-4">
              Before listing your home, connect with our network of trusted professionals who can help increase market value through:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {services.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <s.icon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span className="font-body text-white/80 text-sm">{s.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-5 mb-8">
              <p className="font-body text-white/90 text-sm leading-relaxed">
                <span className="text-[#C5A059] font-semibold">The Link Business Alliance</span> network helps homeowners prepare their properties to attract stronger offers and maximize selling potential.
              </p>
            </div>

            <button
              onClick={() => scrollTo("#contact")}
              className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              Request Home Value Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={SELLERS_IMG}
                alt="Home prepared for sale with curb appeal"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-4 border border-[#C5A059]/30 rounded-lg pointer-events-none" />
            </div>
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-white text-[#0A192F] p-6 rounded-xl shadow-2xl">
              <p className="text-[#C5A059] font-display text-3xl font-semibold">+18%</p>
              <p className="font-body text-[#0A192F]/60 text-sm">Avg. Value Increase</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
```

## `src/components/landing/CommunitiesSection.jsx`
```jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionDivider from "./SectionDivider";

const communities = [
  {
    name: "The Woodlands",
    img: "/images/communities/the-woodlands.png",
    desc: "Master-planned luxury living with top-rated schools, nature trails, and vibrant town center.",
    large: true,
  },
  {
    name: "Magnolia",
    img: "/images/communities/magnolia.png",
    desc: "Texas charm meets modern living with sprawling estates and family-friendly neighborhoods.",
  },
  {
    name: "Tomball",
    img: "/images/communities/tomball.png",
    desc: "Historic downtown charm, excellent schools, and a thriving local community.",
  },
  {
    name: "Conroe",
    img: "/images/communities/conroe.png",
    desc: "Lakeside living, growing economy, and affordable luxury on Lake Conroe.",
    large: true,
  },
  {
    name: "Spring",
    img: "/images/communities/spring.png",
    desc: "Central location, diverse neighborhoods, and easy access to Houston.",
  },
  {
    name: "Cypress",
    img: "/images/communities/cypress.png",
    desc: "Resort-style communities, top schools, and master-planned neighborhoods.",
  },
  {
    name: "Montgomery",
    img: "/images/communities/montgomery.png",
    desc: "Country estate living with Texas ranch charm and scenic landscapes.",
  },
  {
    name: "Klein",
    img: "/images/communities/klein.png",
    desc: "Family-friendly neighborhoods with acclaimed schools and community parks.",
  },
];

export default function CommunitiesSection() {
  return (
    <section id="communities" className="relative bg-[#F1F3F5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Discover Your Neighborhood
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F]">
            Explore North Houston Communities
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {communities.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative rounded-xl overflow-hidden cursor-pointer ${
                c.large ? "md:col-span-2 lg:col-span-2 aspect-[16/10]" : "aspect-[4/5]"
              }`}
            >
              <img
                src={c.img}
                alt={`${c.name} community North Houston`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Inset border frame */}
              <div className="absolute inset-3 border border-white/20 rounded-lg pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="font-display text-2xl font-semibold text-white mb-2">
                  {c.name}
                </h3>
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4 max-w-md">
                  {c.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-[#C5A059] font-body text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  View Listings <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
```

## `src/components/landing/LeadFormSection.jsx`
```jsx
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"

const interests = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "investing", label: "Investing" },
  { value: "local_services", label: "Local Services" },
]

const CONTACT_EMAIL = "info@homesaroundnorthhouston.com"

export default function LeadFormSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interested_in: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()

    const selectedInterest = interests.find((item) => item.value === form.interested_in)?.label || form.interested_in
    const subject = encodeURIComponent(`Website inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}
Phone: ${form.phone || "Not provided"}
Email: ${form.email}
Interested In: ${selectedInterest}

Message:
${form.message || "No message provided."}`
    )

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="relative bg-[#F1F3F5] py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 shadow-xl"
          >
            <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto mb-6" />
            <h3 className="font-display text-2xl font-semibold text-[#0A192F] mb-3">Thank You!</h3>
            <p className="font-body text-[#0A192F]/60 text-lg">
              Your email app should open with the inquiry details filled in. Send that message and we will be in touch shortly.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="relative bg-[#F1F3F5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0A192F] leading-tight mb-6">
              Let&apos;s Talk About
              <br />Your Goals
            </h2>
            <p className="font-body text-[#0A192F]/60 text-lg leading-relaxed mb-8">
              Whether you&apos;re ready to buy, sell, invest, or connect with local professionals, we&apos;re here to help you navigate every step of the journey.
            </p>

            <div className="space-y-4">
              {[
                "Personalized home search assistance",
                "Free market analysis for sellers",
                "Investment property guidance",
                "Vetted local professional referrals",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="font-body text-[#0A192F]/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-[#0A192F]/5 space-y-5"
            >
              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Interested In *</label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => update("interested_in", opt.value)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-body font-medium transition-all duration-300 ${
                        form.interested_in === opt.value
                          ? "bg-[#0A192F] text-white border-[#0A192F]"
                          : "border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#C5A059]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                  placeholder="Tell us about your real estate goals..."
                />
              </div>

              <button
                type="submit"
                disabled={!form.name || !form.email || !form.interested_in}
                className="w-full py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded-lg hover:bg-[#B08A3E] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C5A059]/20"
              >
                <Send className="w-4 h-4" />
                Request Information
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```
