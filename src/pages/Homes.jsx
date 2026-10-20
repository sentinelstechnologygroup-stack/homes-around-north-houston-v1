import React, { useEffect, useState } from "react";
import PropertySearchPreview from "@/components/PropertySearchPreview";
import PropertySearch from "@/components/conversion/PropertySearch";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { HAR_SEARCH, buildHarSearchUrl } from "@/lib/siteConfig";
export default function Homes() {
  const [params] = useSearchParams();
  const [previewEnabled, setPreviewEnabled] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/idx?action=config', { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(config => setPreviewEnabled(config?.enabled === true)).catch(error => { if (error.name !== "AbortError") setPreviewEnabled(false); });
    return () => controller.abort();
  }, []);
  const keys = ["city", "zip", "neighborhood", "minPrice", "maxPrice"];
  const src = keys.some(key => params.get(key)) ? buildHarSearchUrl(Object.fromEntries(keys.map(key => [key, params.get(key) || ""]))) : HAR_SEARCH;
  if (previewEnabled === null) return <><Navbar /><main id="main-content" className="pt-24 property-search"><header className="ps-hero"><p className="ps-eyebrow">GOLDEN CROSS REALTY</p><h1>Find your North Houston home.</h1><p role="status">Loading home search…</p></header></main><Footer /></>;
  if (previewEnabled) return <><Navbar /><main id="main-content" className="pt-24"><PropertySearch compact searchPath="/homes" /></main><Footer /></>;
  return <PageShell title="Search North Houston Homes" intro="Find your next home in North Houston. Narrow your search by location, price, and the features that matter to you.">
    {previewEnabled && <PropertySearchPreview />}
    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block mb-6 px-6 py-3 rounded bg-[#0A192F] text-white font-semibold">Open Home Search in a New Tab ↗</a>
    <iframe key={src} title="Search homes with Golden Cross Realty" src={src} className="w-full h-[900px] bg-white rounded-xl border border-[#0A192F]/20" />
    <p className="mt-4 text-sm text-[#0A192F]/75">If home search does not load, open it in a new tab using the link above.</p>
  </PageShell>;
}

