import React from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { HAR_SEARCH, buildHarSearchUrl } from "@/lib/siteConfig";
export default function Homes() {
  const [params] = useSearchParams();
  const keys = ["city", "zip", "neighborhood", "minPrice", "maxPrice"];
  const src = keys.some(key => params.get(key)) ? buildHarSearchUrl(Object.fromEntries(keys.map(key => [key, params.get(key) || ""]))) : HAR_SEARCH;
  return <PageShell title="Search North Houston Homes" intro="Browse listings through Jonathan Currey’s HAR IDX search for Golden Cross Realty. Use HAR’s filters to refine the area, price, and property features.">
    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block mb-6 px-6 py-3 rounded bg-[#0A192F] text-white font-semibold">Open HAR Search in a New Tab ↗</a>
    <iframe key={src} title="Golden Cross Realty HAR IDX home search" src={src} className="w-full h-[900px] bg-white rounded-xl border border-[#0A192F]/20" />
    <p className="mt-4 text-sm text-[#0A192F]/75">If the embedded search does not load, use the link above. Listing details, attribution, and availability are supplied by HAR.</p>
  </PageShell>;
}
