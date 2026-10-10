import React from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

export default function InvestmentSection() {
  return <section id="investing" className="bg-white py-20 lg:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-[#9A7437] font-semibold text-sm uppercase tracking-[0.18em] mb-4">Rental Property Investing</p>
        <h2 className="font-display text-3xl md:text-4xl text-[#0A192F] mb-6">Find a property that fits your investment goals</h2>
        <p className="text-lg text-[#0A192F]/75 leading-relaxed mb-7">Considering your first rental property or adding to an existing portfolio? Talk with Golden Cross Realty about available homes, your budget, and the areas you want to explore.</p>
        <Link to="/?interest=investing#contact" className="inline-flex items-center gap-2 rounded bg-[#0A192F] text-white font-semibold px-6 py-4">Discuss a Rental Property Purchase <ArrowRight size={18} /></Link>
      </div>
      <div className="bg-[#F1F3F5] border border-[#0A192F]/10 rounded-xl p-8">
        <Building2 className="text-[#9A7437] mb-5" size={32} />
        <h3 className="font-display text-2xl mb-5 text-[#0A192F]">Start with your priorities</h3>
        <ul className="space-y-4 text-[#0A192F]/80">
          <li>Share your purchase budget and preferred timeline.</li>
          <li>Compare properties and neighborhoods that interest you.</li>
          <li>Discuss property condition, intended rental use, and questions to verify before buying.</li>
        </ul>
        <Link to="/homes" className="inline-flex items-center gap-2 mt-7 font-semibold text-[#0A192F] underline underline-offset-4">Explore Available Homes <ArrowRight size={16} /></Link>
      </div>
    </div>
  </section>;
}
