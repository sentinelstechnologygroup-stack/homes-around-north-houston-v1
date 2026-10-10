import React from 'react';
import PageShell from '@/components/PageShell';
import { BROKERAGE, TECHNOLOGY_DISCLOSURE } from '@/lib/siteConfig';
export default function Legal({type}){
 const privacy=type==='privacy';
 const sections=privacy?[
 ['Information you choose to send','The inquiry form prepares an email containing the name, email address, optional phone number, interest, and message you enter. Your email application opens a draft addressed to Golden Cross Realty. You must send that email yourself; opening the draft does not confirm delivery.'],
 ['How inquiries are used','Information you send is used to respond to your inquiry and discuss the real estate assistance you requested. Golden Cross Realty provides brokerage services; GMS Pro provides this website’s technology.'],
 ['Third-party services','HAR supplies the embedded property search. Interacting with HAR’s tools is subject to HAR’s privacy practices and terms. Website hosting, embedded content, and externally loaded fonts may process technical information such as IP addresses and browser details under their providers’ policies.'],
 ['Privacy questions','Contact Golden Cross Realty using the email below to ask about information you have sent or request a correction. Do not include financial account details or other sensitive documents in this inquiry form.']
 ]:[
 ['Technology and brokerage services',TECHNOLOGY_DISCLOSURE],
 ['Property information','The Houston Association of REALTORS® (HAR) supplies home search and listing details. Listing information is intended for consumers’ personal, non-commercial use to identify properties they may be interested in purchasing. Information is deemed reliable but not guaranteed; independently verify price, availability, dimensions, school assignments, and other details.'],
 ['Market information','Published market reports describe a particular reporting period and geography. A comparative market analysis is not an appraisal, and no market report guarantees a transaction outcome.'],
 ['Independent service providers','Local resource categories are informational. Consumers should independently check a provider’s licensing, insurance, qualifications, availability, and terms before engaging them.'],
 ['Representation and fair housing','Using this website or sending an inquiry does not by itself establish a brokerage representation agreement. Discuss representation directly with Golden Cross Realty. Equal Housing Opportunity.']
 ];
 return <PageShell title={privacy?'Privacy Policy':'Terms & Disclosures'} intro="Homes Around North Houston · Updated October 9, 2026">
  <div className="max-w-3xl rounded-xl bg-white p-6 sm:p-10 space-y-8">{sections.map(([heading,text])=><section key={heading}><h2 className="font-display text-2xl mb-3">{heading}</h2><p className="leading-relaxed text-[#0A192F]/80">{text}</p></section>)}<a href={`mailto:${BROKERAGE.email}`} className="block underline break-words">{BROKERAGE.email}</a>{privacy&&<a href="https://cms.har.com/termsofuse/" target="_blank" rel="noopener noreferrer" className="block underline">HAR Terms and Privacy Information</a>}</div>
 </PageShell>;
}
