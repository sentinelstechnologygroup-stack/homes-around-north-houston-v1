import { WEEKLY_LISTING_EMAIL_LABEL } from '@/lib/listingEmailPreference';
import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { CONTACT_CONSENT_TEXT, CONTACT_CONSENT_VERSION } from "@/lib/contactConsent"
import { captureLeadAttribution } from "@/lib/leadAttribution"

const interests = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "investing", label: "Investment Properties" },
  { value: "buying_and_selling", label: "Buying & Selling" },
]


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
    area: "", budgetRange: "", timeline: "", workingWithAgent: "",
    consentAccepted: false, website_check: "", weeklyListingEmailsRequested: true,
  })
  const submissionId = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [reference, setReference] = useState("")
  const [attribution] = useState(captureLeadAttribution)
  const [formStartedAt] = useState(() => new Date().toISOString())

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (step === 1) { setStep(2); return }
    submissionId.current ||= crypto.randomUUID()
    setSending(true)
    setError("")
    try {
      const response = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId.current, name: form.name, email: form.email, phone: form.phone, interested_in: form.interested_in,
          weeklyListingEmailsRequested: form.weeklyListingEmailsRequested, weeklyListingPreferencePresented: step === 2,
          message: form.message, website_check: form.website_check, formStartedAt,
          consentAccepted: form.consentAccepted, consentVersion: CONTACT_CONSENT_VERSION,
          funnelProfile: { area: form.area, budgetRange: form.budgetRange, timeline: form.timeline, workingWithAgent: form.workingWithAgent },
          attribution,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.accepted !== true || !result.reference) throw new Error(result.error || "We could not confirm receipt. Please contact GMS Pro before submitting again.")
      setReference(result.reference)
      setSubmitted(true)
    } catch (failure) {
      setError(failure.message || "We could not confirm receipt. Please contact GMS Pro before submitting again.")
    } finally { setSending(false) }
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
            <h3 className="font-display text-2xl font-semibold text-[#0A192F] mb-3">Your Inquiry Has Been Received</h3>
            <p className="font-body text-[#0A192F]/60 text-lg">
              GMS Pro will review your request and contact you to verify your details before connecting you with Golden Cross Realty.
            </p>
            <p className="mt-5 text-sm text-[#0A192F]/70">Inquiry reference: {reference}</p>

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
              Tell us about the home you want to buy, the property you plan to sell, or your investment property goals. GMS Pro will review your request and verify your details before connecting you with Golden Cross Realty.
            </p>

            <div className="space-y-4">
              {[
                "Personalized home search assistance",
                "Free market analysis for sellers",
                "Investment property purchase guidance",
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
              <p className="text-sm font-semibold text-[#0A192F]" aria-live="polite">Step {step} of 2 · {step === 1 ? "Your contact details" : "Your real estate goals"}</p>
              {step === 1 && <>
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
                  <label className="block font-body text-sm font-medium text-[#0A192F] mb-1.5">Phone *</label>
                  <input
                    required
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

              </>}
              {step === 2 && <>
                <p className="text-sm text-[#0A192F]/70">{form.name} · {form.email} · {form.phone}</p>
                {[
                  ["area", "Preferred area", "City or neighborhood"],
                  ["budgetRange", "Budget or estimated property value", "Your approximate range"],
                ].map(([field, label, placeholder]) => <label key={field} className="block text-sm font-medium text-[#0A192F]">{label}<input aria-label={label} value={form[field]} onChange={e => update(field, e.target.value)} placeholder={placeholder} maxLength={200} className="mt-2 w-full px-4 py-3 rounded-lg border border-[#0A192F]/10" /></label>)}
                <label className="block text-sm font-medium text-[#0A192F]">When are you planning to move or purchase?<select aria-label="Timeline" value={form.timeline} onChange={e => update("timeline", e.target.value)} className="mt-2 w-full px-4 py-3 rounded-lg border border-[#0A192F]/10"><option value="">Select a timeframe (optional)</option>{["Within 3 months", "3–6 months", "6–12 months", "Just exploring"].map(value => <option key={value}>{value}</option>)}</select></label>
                <label className="block text-sm font-medium text-[#0A192F]">Are you already working with a real estate agent?<select aria-label="Working with an agent" value={form.workingWithAgent} onChange={e => update("workingWithAgent", e.target.value)} className="mt-2 w-full px-4 py-3 rounded-lg border border-[#0A192F]/10"><option value="">Select an answer (optional)</option><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Not sure</option></select></label>
              <label className="flex items-start gap-3 text-sm text-[#0A192F]/75 leading-relaxed"><input type="checkbox" checked={form.weeklyListingEmailsRequested} onChange={e => update("weeklyListingEmailsRequested", e.target.checked)} className="mt-1" />{WEEKLY_LISTING_EMAIL_LABEL}</label>
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

                <label className="flex items-start gap-3 text-sm text-[#0A192F]/75 leading-relaxed"><input required type="checkbox" checked={form.consentAccepted} onChange={e => update("consentAccepted", e.target.checked)} className="mt-1" />{CONTACT_CONSENT_TEXT}</label>
                <button type="button" disabled={sending} onClick={() => { setStep(1); setError("") }} className="text-sm underline">Edit contact details</button>
              </>}
              <div className="hidden" aria-hidden="true"><input aria-label="Leave this field empty" tabIndex={-1} autoComplete="off" value={form.website_check} onChange={e => update("website_check", e.target.value)} /></div>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={sending || !form.name || !form.email || !form.phone || !form.interested_in || (step === 2 && !form.consentAccepted)}
                className="w-full py-3.5 bg-[#C5A059] text-white font-body font-semibold rounded-lg hover:bg-[#B08A3E] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C5A059]/20"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending your inquiry…" : step === 1 ? "Continue to Your Goals" : "Submit Your Inquiry"}
              </button>
              <p className="text-sm text-[#0A192F]/75 leading-relaxed">GMS Pro reviews your inquiry and verifies your details before connecting you with Golden Cross Realty. <a href="/privacy" className="underline">Privacy Policy</a></p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
