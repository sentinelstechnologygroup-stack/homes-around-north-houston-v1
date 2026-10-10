import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import CommunitiesSection from "@/components/landing/CommunitiesSection";
import BuyersSection from "@/components/landing/BuyersSection";
import SellersSection from "@/components/landing/SellersSection";
import InvestmentSection from "@/components/landing/InvestmentSection";
import MarketReportSection from "@/components/landing/MarketReportSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import LeadFormSection from "@/components/landing/LeadFormSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  useEffect(() => { document.title = "Homes Around North Houston | Golden Cross Realty"; }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CommunitiesSection />
      <BuyersSection />
      <SellersSection />
      <InvestmentSection />
      <MarketReportSection />
      <WhyChooseUsSection />
      <LeadFormSection />
      <Footer />
    </div>
  );
}
