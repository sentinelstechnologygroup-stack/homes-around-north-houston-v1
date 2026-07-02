import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = ["Home", "Buy", "Sell", "Market Reports", "Local Services", "About", "Contact"];
const communities = ["The Woodlands", "Magnolia", "Tomball", "Conroe", "Spring", "Cypress", "Montgomery", "Klein"];

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const linkMap = {
  Home: "#hero",
  Buy: "#buyers",
  Sell: "#sellers",
  "Market Reports": "#market",
  "Local Services": "#services",
  About: "#why-us",
  Contact: "#contact",
};

export default function Footer() {
  return (
    <footer className="bg-[#0A192F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              Homes Around
              <br />
              <span className="text-[#C5A059]">North Houston</span>
            </h3>
            <p className="font-body text-white/50 text-sm leading-relaxed mt-4 mb-6">
              Connecting North Houston homeowners, buyers, sellers, investors, and businesses through one trusted community network.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(linkMap[link])}
                    className="font-body text-white/50 text-sm hover:text-[#C5A059] transition-colors duration-300"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Communities
            </h4>
            <ul className="space-y-2.5">
              {communities.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => scrollTo("#communities")}
                    className="font-body text-white/50 text-sm hover:text-[#C5A059] transition-colors duration-300"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <p className="font-body text-white/50 text-sm">
                  North Houston, Texas
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a href="tel:+18005551234" className="font-body text-white/50 text-sm hover:text-[#C5A059] transition-colors">
                  (800) 555-1234
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a href="mailto:info@homesaroundnorthhouston.com" className="font-body text-white/50 text-sm hover:text-[#C5A059] transition-colors">
                  info@homesaroundnorthhouston.com
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="font-body text-xs text-[#C5A059] font-semibold uppercase tracking-wider mb-1">
                Link Business Alliance
              </p>
              <p className="font-body text-white/40 text-xs">
                Proudly connecting businesses and homeowners across North Houston.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-white/30 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Homes Around North Houston. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-body text-white/30 text-xs hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-body text-white/30 text-xs hover:text-white/60 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="font-body text-white/30 text-xs hover:text-white/60 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}