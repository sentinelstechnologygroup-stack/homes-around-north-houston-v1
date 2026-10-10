import React from "react";
import { motion } from "framer-motion";
import { MapPin, Handshake, LayoutGrid } from "lucide-react";
import SectionDivider from "./SectionDivider";

const columns = [
  {
    icon: MapPin,
    title: "Local Expertise",
    desc: "Deep knowledge of North Houston communities, market trends, and neighborhood insights that only locals can provide.",
  },
  {
    icon: Handshake,
    title: "Connected Resources",
    desc: "Golden Marketing Services brings home search and local resources together; Golden Cross Realty provides the brokerage services.",
  },
  {
    icon: LayoutGrid,
    title: "One Resource Hub",
    desc: "Everything homeowners, buyers, sellers, and investors need in one place. No more searching across dozens of sites.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="why-us" className="relative bg-[#0A192F] py-20 lg:py-28 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            The Difference
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            More Than Just Real Estate
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#C5A059]/30 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-6">
                <col.icon className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{col.title}</h3>
              <p className="font-body text-white/60 text-base leading-relaxed">{col.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}
