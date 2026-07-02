import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, GraduationCap, Landmark, Truck, ArrowRight, CheckCircle } from "lucide-react";
import SectionDivider from "./SectionDivider";

const BUYERS_IMG = "/images/buyers/luxury-home-interior.png";

const features = [
  { icon: Search, label: "Home Search Tools" },
  { icon: MapPin, label: "Neighborhood Guides" },
  { icon: GraduationCap, label: "School Information" },
  { icon: Landmark, label: "Mortgage Resources" },
  { icon: Truck, label: "Relocation Assistance" },
];

export default function BuyersSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="buyers" className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={BUYERS_IMG}
                alt="Luxury home interior for buyers"
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Inset frame */}
              <div className="absolute inset-4 border border-[#C5A059]/30 rounded-lg pointer-events-none" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-[#0A192F] text-white p-6 rounded-xl shadow-2xl">
              <p className="text-[#C5A059] font-display text-3xl font-semibold">2,500+</p>
              <p className="font-body text-white/70 text-sm">Homes Available</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              For Buyers
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0A192F] leading-tight mb-6">
              Find the Right Home
              <br />with Confidence
            </h2>
            <p className="font-body text-[#0A192F]/60 text-lg leading-relaxed mb-8">
              Access comprehensive tools and resources to navigate the North Houston real estate market with ease.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <span className="font-body text-[#0A192F] font-medium">{f.label}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => scrollTo("#communities")}
              className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              Start Your Home Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}