import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionDivider from "./SectionDivider";

const testimonials = [
  {
    quote: "Homes Around North Houston made finding our dream home in The Woodlands effortless. The neighborhood guides were incredibly detailed and helped us make the right decision for our family.",
    name: "Sarah & Michael R.",
    role: "Home Buyers — The Woodlands",
  },
  {
    quote: "Thanks to the Link Business Alliance network, we connected with a fantastic contractor and painter before listing. Our home sold above asking price within a week!",
    name: "David T.",
    role: "Home Seller — Magnolia",
  },
  {
    quote: "As a local roofer, being part of the Alliance has connected me with homeowners who need quality work. It's been a game-changer for my business.",
    name: "Carlos M.",
    role: "Business Owner — Tomball",
  },
  {
    quote: "The market reports gave me confidence to invest in Conroe rental properties. I've since expanded my portfolio to three properties, all found through this platform.",
    name: "Jennifer L.",
    role: "Real Estate Investor — Conroe",
  },
  {
    quote: "We relocated from California and had no idea where to start. The community guides and local professional network made our Texas transition smooth and stress-free.",
    name: "The Peterson Family",
    role: "Home Buyers — Spring",
  },
  {
    quote: "I've been a realtor in North Houston for 15 years, and this platform has become an invaluable resource for connecting with clients and fellow professionals.",
    name: "Amanda K.",
    role: "Realtor — Cypress",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F]">
            Helping Families and
            <br className="hidden sm:block" /> Businesses Connect
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="w-10 h-10 text-[#C5A059]/30 mx-auto mb-6" />
              <blockquote className="font-display text-xl md:text-2xl text-[#0A192F] leading-relaxed mb-8 italic">
                "{testimonials[current].quote}"
              </blockquote>
              <p className="font-body font-semibold text-[#0A192F] text-base">
                {testimonials[current].name}
              </p>
              <p className="font-body text-[#C5A059] text-sm mt-1">
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#0A192F]/20 flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#C5A059] w-6" : "bg-[#0A192F]/20"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#0A192F]/20 flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <SectionDivider />
      </div>
    </section>
  );
}