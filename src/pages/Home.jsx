import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import CommunitiesSection from "@/components/landing/CommunitiesSection";
import BuyersSection from "@/components/landing/BuyersSection";
import SellersSection from "@/components/landing/SellersSection";
import LocalServicesSection from "@/components/landing/LocalServicesSection";
import MarketReportSection from "@/components/landing/MarketReportSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LeadFormSection from "@/components/landing/LeadFormSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CommunitiesSection />
      <BuyersSection />
      <SellersSection />
      <LocalServicesSection />
      <MarketReportSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <LeadFormSection />
      <Footer />
    </div>
  );
}