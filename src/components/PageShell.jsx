import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
export default function PageShell({ title, intro, children }) {
  useEffect(() => { document.title = `${title} | Homes Around North Houston`; }, [title]);
  return <><Navbar /><main className="min-h-screen bg-[#F1F3F5] pt-36 pb-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p className="text-[#9A7437] font-semibold uppercase tracking-widest mb-4">Golden Cross Realty</p>
    <h1 className="font-display text-4xl md:text-5xl text-[#0A192F] mb-6">{title}</h1>
    <p className="text-lg leading-relaxed text-[#0A192F]/75 max-w-3xl mb-10">{intro}</p>{children}
  </div></main><Footer /></>;
}
