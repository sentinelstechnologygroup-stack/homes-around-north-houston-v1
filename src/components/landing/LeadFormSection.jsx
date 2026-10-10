import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { BROKERAGE } from "@/lib/siteConfig"

const interests = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "investing", label: "Rental Property Investing" },
  { value: "buying_and_selling", label: "Buying & Selling" },
]

const CONTACT_EMAIL = BROKERAGE.email

export default function LeadFormSection() {
  const [params] = useSearchParams()
  const requestedInterest = params.get("interest")
  useEffect(() => {
    if (interests.some(item => item.value === requestedInterest)) {
      setForm(current => ({ ...current, interested_in: requestedInterest }))
      setSubmitted(false)
    }
  }, [requestedInterest])
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interested_in: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()

    const selectedInterest = interests.find((item) => item.value === form.interested_in)?.label || form.interested_in
    const subject = encodeURIComponent(`Website inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}
Phone: ${form.phone || "Not provided"}
Email: ${form.email}
Interested In: ${selectedInterest}

Message:
${form.message || "No message provided."}`
    )

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="relative bg-[#F1F3F5] py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 shadow-xl"
          >
            <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto mb-6" />
            <h3 className="font-display text-2xl font-semibold text-[#0A192F] mb-3">Your Email Draft Is Ready</h3>
            <p className="font-body text-[#0A192F]/60 text-lg">
              Your email app should open with the inquiry details filled in. Send that message and we will be in touch shortly.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block mt-5 underline">Email Golden Cross Realty</a>
            <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 underline">Return to inquiry form</button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="relative bg-[#F1F3F5] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C5A059] font-body text-sm font-semibold tracking-[0.2em] uppercase mb-3">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0A192F] leading-tight mb-6">
              Buy, Sell, or Invest
              <br />in North Houston
            </h2>
            <p className="font-body text-[#0A192F]/60 text-lg leading-relaxed mb-8">
              Tell Golden Cross Realty about the home you want to buy, the property you plan to sell, or your rental-property investment goals. Share your budget, timeline, and questions to start the conversation.
            </p>

            <div className="space-y-4">
              {[
                "Personalized home search assistance",
                "Free market analysis for sellers",
                "Rental-property purchase guidance",
                "A plan for buying and selling together",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="font-body text-[#0A192F]/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-[#0A192F]/5 space-y-5"
            >
              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Name *</label>
                <input
                  required
                  aria-label="Name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Phone</label>
                  <input
                    aria-label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Email *</label>
                  <input
                    required
                    aria-label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Interested In *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interests.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      aria-pressed={form.interested_in === opt.value}
                      onClick={() => update("interested_in", opt.value)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-body font-medium transition-all duration-300 ${
                        form.interested_in === opt.value
                          ? "bg-[#0A192F] text-white border-[#0A192F]"
                          : "border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#C5A059]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Message</label>
                <textarea
                  aria-label="Message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#0A192F]/10 font-body text-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                  placeholder="Tell us about your real estate goals..."
                />
              </div>

              <button
                type="submit"
                disabled={!form.name || !form.email || !form.interested_in}
                className="w-full py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded-lg hover:bg-[#B08A3E] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C5A059]/20"
              >
                <Send className="w-4 h-4" />
                Prepare Email to Golden Cross Realty
              </button>
              <p className="text-sm text-[#0A192F]/75 leading-relaxed">This form opens your email application with a draft to Golden Cross Realty. Review and send the email to submit your inquiry. GMS Pro supplies the website technology.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
