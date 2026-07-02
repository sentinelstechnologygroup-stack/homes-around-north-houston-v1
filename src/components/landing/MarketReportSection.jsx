import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Home, Clock, BarChart3, LineChart, ArrowRight } from "lucide-react";
import SectionDivider from "./SectionDivider";

const widgets = [
  { icon: Home, label: "Average Home Values", value: "$425,000", change: "+8.2%" },
  { icon: BarChart3, label: "New Listings", value: "1,245", change: "+12%" },
  { icon: TrendingUp, label: "Price Trends", value: "Rising", change: "+5.4%" },
  { icon: Clock, label: "Days on Market", value: "28 Days", change: "-15%" },
  { icon: LineChart, label: "Market Forecast", value: "Strong", change: "Bullish" },
];

export default function MarketReportSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="market" className="relative bg-[#F1F3F5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Data-Driven Decisions
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F]">
            North Houston Market Insights
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {widgets.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-xl p-6 border border-[#0A192F]/5 hover:shadow-xl hover:shadow-[#C5A059]/5 transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#0A192F] flex items-center justify-center mb-4 group-hover:bg-[#C5A059] transition-colors duration-500">
                <w.icon className="w-5 h-5 text-[#C5A059] group-hover:text-white transition-colors duration-500" />
              </div>
              <p className="font-body text-xs text-[#0A192F]/50 uppercase tracking-wider mb-1">{w.label}</p>
              <p className="font-display text-2xl font-semibold text-[#0A192F] mb-1">{w.value}</p>
              <p className="font-body text-sm text-[#C5A059] font-semibold">{w.change}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3.5 bg-[#0A192F] text-white font-body font-semibold rounded hover:bg-[#0A192F]/90 transition-all duration-300 inline-flex items-center gap-2"
          >
            View Market Reports
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