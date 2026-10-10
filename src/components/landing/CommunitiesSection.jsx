import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionDivider from "./SectionDivider";

const communities = [
  {
    name: "The Woodlands",
    img: "/images/communities/the-woodlands.webp",
    desc: "Master-planned luxury living with top-rated schools, nature trails, and vibrant town center.",
    large: true,
  },
  {
    name: "Magnolia",
    img: "/images/communities/magnolia.webp",
    desc: "Texas charm meets modern living with sprawling estates and family-friendly neighborhoods.",
  },
  {
    name: "Tomball",
    img: "/images/communities/tomball.webp",
    desc: "Historic downtown charm, excellent schools, and a thriving local community.",
  },
  {
    name: "Conroe",
    img: "/images/communities/conroe.webp",
    desc: "Lakeside living, growing economy, and affordable luxury on Lake Conroe.",
    large: true,
  },
  {
    name: "Spring",
    img: "/images/communities/spring.webp",
    desc: "Central location, diverse neighborhoods, and easy access to Houston.",
  },
  {
    name: "Cypress",
    img: "/images/communities/cypress.webp",
    desc: "Resort-style communities, top schools, and master-planned neighborhoods.",
  },
  {
    name: "Montgomery",
    img: "/images/communities/montgomery.webp",
    desc: "Country estate living with Texas ranch charm and scenic landscapes.",
  },
  {
    name: "Klein",
    img: "/images/communities/klein.webp",
    desc: "Family-friendly neighborhoods with acclaimed schools and community parks.",
  },
];

export default function CommunitiesSection() {
  return (
    <section id="communities" className="relative bg-[#F1F3F5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Discover Your Neighborhood
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0A192F]">
            Explore North Houston Communities
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {communities.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative rounded-xl overflow-hidden cursor-pointer ${
                c.large ? "md:col-span-2 lg:col-span-2 aspect-[16/10]" : "aspect-[4/5]"
              }`}
            >
              <img
                loading="lazy" decoding="async"
                src={c.img}
                alt={`${c.name} community North Houston`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Inset border frame */}
              <div className="absolute inset-3 border border-white/20 rounded-lg pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="font-display text-2xl font-semibold text-white mb-2">
                  {c.name}
                </h3>
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4 max-w-md">
                  {c.desc}
                </p>
                <Link to={`/homes?${new URLSearchParams(c.name === "Klein" ? { zip: "77379" } : { city: c.name })}`} className="inline-flex items-center gap-2 text-[#C5A059] font-body text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  View Listings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
