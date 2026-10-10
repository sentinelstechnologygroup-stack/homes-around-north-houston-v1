import React from "react";
import { motion } from "framer-motion";
import {
  Home, Landmark, ClipboardCheck, Shield, Hammer, HardHat,
  Paintbrush, Zap, Droplets, Wind, Trees, Waves,
  Building2, Scale, Calculator, ArrowRight,
} from "lucide-react";
import SectionDivider from "./SectionDivider";

const categories = [
  { icon: Home, label: "Realtors" },
  { icon: Landmark, label: "Mortgage Lenders" },
  { icon: ClipboardCheck, label: "Home Inspectors" },
  { icon: Shield, label: "Insurance Agents" },
  { icon: Hammer, label: "Contractors" },
  { icon: HardHat, label: "Roofers" },
  { icon: Paintbrush, label: "Painters" },
  { icon: Zap, label: "Electricians" },
  { icon: Droplets, label: "Plumbers" },
  { icon: Wind, label: "HVAC" },
  { icon: Trees, label: "Landscapers" },
  { icon: Waves, label: "Pool Companies" },
  { icon: Building2, label: "Property Managers" },
  { icon: Scale, label: "Attorneys" },
  { icon: Calculator, label: "Accountants" },
];

export default function LocalServicesSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="relative bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Golden Marketing Services
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F] mb-4">
            Local Homeowner Resources
          </h2>
          <p className="font-body text-[#0A192F]/60 text-lg max-w-xl mx-auto">
            Explore services you may need before buying or selling. Ask Jonathan about local resources and independently verify each provider’s qualifications, licensing, and insurance.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-[#F1F3F5] hover:bg-[#0A192F] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 flex items-center justify-center transition-colors duration-500 resource-pulse">
                <cat.icon className="w-5 h-5 text-[#C5A059]" />
              </div>
              <span className="font-body text-sm font-medium text-[#0A192F] group-hover:text-white text-center transition-colors duration-500">
                {cat.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded hover:bg-[#B08A3E] transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
          >
            Ask About Local Resources
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
