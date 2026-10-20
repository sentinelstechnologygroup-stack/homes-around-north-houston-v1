import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import CommunitiesSection from "@/components/landing/CommunitiesSection";
import BuyersSection from "@/components/landing/BuyersSection";
import SellersSection from "@/components/landing/SellersSection";
import InvestmentSection from "@/components/landing/InvestmentSection";
import MarketReportSection from "@/components/landing/MarketReportSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";

import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
      <HeroSection />
      <TrustSection />
      <CommunitiesSection />
      <BuyersSection />
      <SellersSection />
      <InvestmentSection />
      <MarketReportSection />
      <WhyChooseUsSection />
      <section className="bg-[#F1F3F5] py-16 text-center"><h2 className="font-display text-3xl text-[#0A192F] mb-5">Find your place in North Houston</h2><a href="#contact" className="inline-block bg-[#C5A059] text-[#0A192F] rounded-lg px-8 py-4 font-semibold">Get Started</a></section>
      </main>
      <Footer />
    </div>
  );
}
