import React from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { HAR_SEARCH, buildHarSearchUrl } from "@/lib/siteConfig";
export default function Homes() {
  const [params] = useSearchParams();
  const keys = ["city", "zip", "neighborhood", "minPrice", "maxPrice"];
  const src = keys.some(key => params.get(key)) ? buildHarSearchUrl(Object.fromEntries(keys.map(key => [key, params.get(key) || ""]))) : HAR_SEARCH;
  return <PageShell title="Search North Houston Homes" intro="Find your next home in North Houston. Narrow your search by location, price, and the features that matter to you.">
    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block mb-6 px-6 py-3 rounded bg-[#0A192F] text-white font-semibold">Open Home Search in a New Tab ↗</a>
    <iframe key={src} title="Search homes with Golden Cross Realty" src={src} className="w-full h-[900px] bg-white rounded-xl border border-[#0A192F]/20" />
    <p className="mt-4 text-sm text-[#0A192F]/75">If home search does not load, open it in a new tab using the link above.</p>
  </PageShell>;
}
