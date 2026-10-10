import React from "react";
import { motion } from "framer-motion";
import { Home, TrendingUp, Building2, Users } from "lucide-react";
import SectionDivider from "./SectionDivider";

const blocks = [
  {
    icon: Home,
    title: "Buy a Home",
    desc: "Find homes, neighborhoods, schools, and financing resources.",
  },
  {
    icon: TrendingUp,
    title: "Sell Your Home",
    desc: "Get market insights and connect with trusted real estate professionals.",
  },
  {
    icon: Building2,
    title: "Invest in Property",
    desc: "Explore investment opportunities throughout North Houston.",
  },
  {
    icon: Users,
    title: "Local Resources",
    desc: "Explore home-service categories on this GMS Pro-powered website.",
  },
];

export default function TrustSection() {
  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F] leading-tight">
            Your Local Real Estate
            <br className="hidden sm:block" /> Resource Network
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-[#F1F3F5] rounded-xl p-8 hover:bg-[#0A192F] transition-all duration-500 cursor-default"
            >
              <div className="w-14 h-14 rounded-lg bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 flex items-center justify-center mb-6 transition-colors duration-500">
                <block.icon className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#0A192F] group-hover:text-white mb-3 transition-colors duration-500">
                {block.title}
              </h3>
              <p className="font-body text-[#0A192F]/60 group-hover:text-white/70 text-base leading-relaxed transition-colors duration-500">
                {block.desc}
              </p>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-[#C5A059] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
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
