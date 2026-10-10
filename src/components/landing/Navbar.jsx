import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
const links = [['Home','/'],['Buy','/#buyers'],['Sell','/#sellers'],['Invest','/#investing'],['Market Reports','/market-reports']];
export default function Navbar() {
  const [open,setOpen] = useState(false);
  return <nav aria-label="Main navigation" className="fixed top-0 inset-x-0 z-50 bg-[#0A192F]/95 backdrop-blur-xl shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-20 lg:h-24">
      <Link to="/" onClick={()=>setOpen(false)}><span className="block text-[#C5A059] font-display text-lg sm:text-2xl font-semibold">Homes Around North Houston</span><span className="block text-white text-base font-semibold">Golden Cross Realty</span></Link>
      <div className="hidden lg:flex items-center gap-1">{links.map(([label,to])=><Link key={label} to={to} className="px-3 py-2 text-sm text-white/90 hover:text-[#C5A059]">{label}</Link>)}<Link to="/#contact" className="ml-3 px-5 py-2 rounded bg-[#C5A059] text-[#0A192F] font-semibold text-sm">Contact Us</Link></div>
      <button onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation" className="lg:hidden text-white p-2">{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<div id="mobile-navigation" className="lg:hidden bg-[#0A192F] border-t border-white/10 p-4">{[...links,['Contact Us','/#contact']].map(([label,to])=><Link key={label} to={to} onClick={()=>setOpen(false)} className="block px-4 py-3 text-white hover:text-[#C5A059]">{label}</Link>)}</div>}
  </nav>;
}
