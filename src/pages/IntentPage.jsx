import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
const content = {
  buying: {
    title: 'Find Your Next Home in North Houston', intro: 'Start with your preferred area, budget and timeline. Our local team can help you compare available homes and understand the next steps in your purchase.',
    action: 'Get Buying Guidance', heading: 'A search built around your priorities',
    points: ['Choose the communities, commute and property features that matter to you.', 'Discuss your purchase budget and financing preparation before scheduling tours.', 'Compare property details and confirm condition, taxes, restrictions and other costs before making a decision.'],
    note: 'You can search available homes without sending an inquiry. When you are ready for assistance, share your priorities below.',
  },
  selling: {
    title: 'Plan Your North Houston Home Sale', intro: 'Request a comparative market analysis and discuss your property, selling timeline and next move with our local team.',
    action: 'Request Home Value Analysis', heading: 'Understand your options before you list',
    points: ['Review relevant comparable properties and your home’s current condition.', 'Discuss pricing, presentation and a showing plan that fits your timeline.', 'Consider offers, closing costs and the timing of your next purchase with your brokerage.'],
    note: 'A comparative market analysis is an estimate of market positioning, not an appraisal or a guarantee of sale price.',
  },
  investing: {
    title: 'Explore North Houston Investment Properties', intro: 'Whether you are considering your first investment property or adding to a portfolio, start with a clear purchase budget and the areas you want to explore.',
    action: 'Discuss Investment Properties', heading: 'Compare the property and the responsibilities',
    points: ['Identify your intended use, purchase budget and preferred ownership timeline.', 'Review available homes and verify property condition, restrictions, taxes and insurance considerations.', 'Discuss due diligence with our local team and consult appropriate financing, tax and legal professionals for your plans.'],
    note: 'Property performance varies. No income, return, appreciation or investment outcome is guaranteed.',
  },
};
export default function IntentPage({ interest }) {
  const page = content[interest];
  return <PageShell title={page.title} intro={page.intro}>
    <div className="grid lg:grid-cols-2 gap-8">
      <section className="bg-white rounded-xl p-7 sm:p-10 border border-[#0A192F]/10">
        <h2 className="font-display text-2xl mb-6">{page.heading}</h2>
        <ul className="space-y-5 list-disc pl-5 text-[#0A192F]/80 leading-relaxed">{page.points.map(point => <li key={point}>{point}</li>)}</ul>
        <p className="mt-7 text-sm leading-relaxed text-[#0A192F]/70">{page.note}</p>
      </section>
      <section className="bg-[#0A192F] text-white rounded-xl p-7 sm:p-10">
        <h2 className="font-display text-2xl mb-5">Take the next step</h2>
        <p className="text-white/80 leading-relaxed mb-7">Share your real estate goals so we can help you plan your next move.</p>
        <Link to={`/?interest=${interest}#contact`} className="inline-flex rounded bg-[#C5A059] text-[#0A192F] font-semibold px-5 py-4">{page.action}</Link>
        {interest !== 'selling' && <Link to="/homes" className="block mt-6 underline underline-offset-4">Browse Available Homes</Link>}

      </section>
    </div>
  </PageShell>;
}
