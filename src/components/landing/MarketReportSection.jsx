import React from 'react';
import { Link } from 'react-router-dom';
export default function MarketReportSection(){
 return <section id="market" className="bg-[#F1F3F5] py-20"><div className="max-w-4xl mx-auto px-6 text-center">
  <p className="text-[#9A7437] font-semibold tracking-widest uppercase mb-4">Market Reports</p>
  <h2 className="font-display text-3xl md:text-5xl text-[#0A192F] mb-6">Understand the market before you move</h2>
  <p className="text-[#0A192F]/75 text-lg leading-relaxed mb-8">Explore published Houston housing reports and ask our team for an analysis of your neighborhood, price range, or property.</p>
  <Link to="/market-reports" className="inline-block rounded bg-[#0A192F] text-white px-7 py-4 font-semibold">View Market Reports →</Link>
 </div></section>;
}
