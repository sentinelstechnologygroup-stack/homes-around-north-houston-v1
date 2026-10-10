import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Hammer, Paintbrush, Trees, Droplets, Wrench, Sparkles, ClipboardCheck } from "lucide-react";
import SectionDivider from "./SectionDivider";

const SELLERS_IMG = "/images/sellers/home-curb-appeal.png";

const services = [
  { icon: Hammer, label: "Roofing" },
  { icon: Paintbrush, label: "Painting" },
  { icon: Trees, label: "Landscaping" },
  { icon: Droplets, label: "Pool Repairs" },
  { icon: Wrench, label: "Remodeling" },
  { icon: Sparkles, label: "Cleaning Services" },
  { icon: ClipboardCheck, label: "Home Inspections" },
];

export default function SellersSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="sellers" className="relative bg-[#0A192F] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              For Sellers
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
              Maximize Your
              <br />Home's Value
            </h2>
            <p className="font-body text-white/70 text-lg leading-relaxed mb-4">
              Discuss your listing plan with Golden Cross Realty and consider which preparation tasks make sense for your property:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {services.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <s.icon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span className="font-body text-white/80 text-sm">{s.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-5 mb-8">
              <p className="font-body text-white/90 text-sm leading-relaxed">
                <span className="text-[#C5A059] font-semibold">Golden Marketing Services</span> powers this website. Golden Cross Realty provides the brokerage guidance for preparing, pricing, and listing your home.
              </p>
            </div>

            <button
              onClick={() => scrollTo("#contact")}
              className="px-8 py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded hover:bg-[#B08A3E] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
            >
              Request Home Value Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={SELLERS_IMG}
                alt="Home prepared for sale with curb appeal"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-4 border border-[#C5A059]/30 rounded-lg pointer-events-none" />
            </div>
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-white text-[#0A192F] p-6 rounded-xl shadow-2xl">
              <p className="text-[#9A7437] font-display text-2xl font-semibold">Prepare to Sell</p>
              <p className="font-body text-[#0A192F]/75 text-sm">Plan with Golden Cross Realty</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
