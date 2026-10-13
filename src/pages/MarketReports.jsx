import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { HAR_MARKET_REPORTS, BROKERAGE } from '@/lib/siteConfig';
export default function MarketReports(){
 return <PageShell title="North Houston Market Reports" intro="Start with the latest published housing reports, then look closer at the communities and properties that matter to you.">
  <div className="grid md:grid-cols-2 gap-6">
   <article className="rounded-xl bg-white border border-[#0A192F]/10 p-8"><h2 className="font-display text-2xl mb-4">Houston housing reports</h2><p className="leading-relaxed text-[#0A192F]/75 mb-6">Explore monthly housing updates and affordability releases. Each report identifies its reporting period; Houston-wide figures may differ from your neighborhood.</p><a href={HAR_MARKET_REPORTS} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0A192F] text-white px-6 py-3 rounded font-semibold">Read Housing Reports ↗</a><p className="mt-4 text-sm text-[#0A192F]/65">Source: Houston Association of REALTORS® (HAR).</p></article>
   <article className="rounded-xl bg-white border border-[#0A192F]/10 p-8"><h2 className="font-display text-2xl mb-4">Your neighborhood, your price range</h2><p className="leading-relaxed text-[#0A192F]/75 mb-6">Ask Golden Cross Realty for a property-specific comparative market analysis or a neighborhood report covering recent sales, available inventory, and time on market.</p><Link to="/#contact" className="inline-block bg-[#C5A059] text-[#0A192F] px-6 py-3 rounded font-semibold">Request a Local Report</Link><a href={BROKERAGE.phoneHref} className="block mt-4 underline">Call {BROKERAGE.phone}</a></article>
  </div>
  <section className="mt-10 bg-white p-8 rounded-xl"><h2 className="font-display text-2xl mb-6">What to look for</h2><dl className="grid sm:grid-cols-2 gap-6">
   {[["Prices","Compare median and average sale prices within the same geography, property type, and reporting period."],["Inventory","Available homes and months of supply help describe the choices buyers have."],["Time on market","Review days on market alongside pricing, condition, and recent comparable sales."],["Closed sales","Completed transactions show recent activity; asking prices alone do not establish a property’s value."]].map(([term,text])=><div key={term}><dt className="font-semibold mb-2">{term}</dt><dd className="text-[#0A192F]/75 leading-relaxed">{text}</dd></div>)}
  </dl><p className="mt-7 text-sm text-[#0A192F]/75">A comparative market analysis is not an appraisal. Market information and past performance do not guarantee a sale price or future result.</p></section>
 </PageShell>;
}
