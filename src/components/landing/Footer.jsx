import React from 'react';
import { Link } from 'react-router-dom';
import { BROKERAGE, TECHNOLOGY_DISCLOSURE } from '@/lib/siteConfig';
const links=[['Home','/'],['Buy','/#buyers'],['Sell','/#sellers'],['Search Homes','/homes'],['Market Reports','/market-reports'],['Local Resources','/#services'],['Contact','/#contact']];
export default function Footer(){
 return <footer className="bg-[#0A192F] text-white pt-14 pb-8"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid md:grid-cols-3 gap-10 mb-10">
   <div><h2 className="font-display text-2xl text-[#C5A059] font-semibold">Homes Around North Houston</h2><p className="mt-3 text-white/80 leading-relaxed">Explore North Houston homes and connect with Jonathan Currey at Golden Cross Realty.</p><p className="mt-4 text-white/80 text-sm">Website technology by <a href="https://www.goldenmarketingservices.com/" className="underline underline-offset-4">Golden Marketing Services</a>.</p></div>
   <nav aria-label="Footer navigation"><h2 className="font-semibold mb-4">Explore</h2><ul className="space-y-2">{links.map(([label,to])=><li key={to}><Link to={to} className="text-white/80 hover:text-[#C5A059]">{label}</Link></li>)}</ul></nav>
   <div><h2 className="font-display text-2xl font-semibold">{BROKERAGE.name}</h2><p className="mt-3">{BROKERAGE.broker}, Broker</p><a href={BROKERAGE.phoneHref} className="block mt-3 text-white/80">{BROKERAGE.phone}</a><a href={`mailto:${BROKERAGE.email}`} className="block mt-2 text-white/80 break-words">{BROKERAGE.email}</a></div>
  </div>
  <div className="border-t border-white/20 pt-8 space-y-5">
   <div className="flex flex-col gap-3 text-base"><a href={BROKERAGE.iabs} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Texas Real Estate Commission Information About Brokerage Services</a><a href={BROKERAGE.consumerNotice} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Texas Real Estate Commission Consumer Protection Notice</a></div>
   <p className="text-sm text-white/80 leading-relaxed"><strong className="text-white">Technology &amp; Service Disclosure: </strong>{TECHNOLOGY_DISCLOSURE}</p>
   <p className="text-sm text-white/80 leading-relaxed">Home search is provided through Golden Cross Realty’s HAR IDX tools. Listing information is for consumers’ personal, non-commercial use to identify properties they may be interested in purchasing. Information is deemed reliable but is not guaranteed and should be independently verified. HAR is the listing data provider; brokerage services are provided by Golden Cross Realty.</p>
   <p className="text-sm text-white/80">Equal Housing Opportunity.</p>
   <div className="flex flex-col sm:flex-row gap-4 sm:justify-between text-sm text-white/70"><p>© {new Date().getFullYear()} Homes Around North Houston. All rights reserved.</p><div className="flex gap-5"><Link to="/privacy" className="underline">Privacy Policy</Link><Link to="/terms" className="underline">Terms &amp; Disclosures</Link></div></div>
  </div>
 </div></footer>;
}
