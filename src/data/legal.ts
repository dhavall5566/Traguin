import { images } from "@/lib/images";
import { contactInfo } from "@/data/contact";

export type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  heroImage: string;
  heroImageAlt: string;
  sections: readonly LegalSection[];
};

export const privacyPolicy: LegalPageContent = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  description:
    "This Privacy Policy explains how TRAGUIN Luxury Travel collects, uses, stores, and protects your personal information when you visit our website, submit an inquiry, or use our travel planning services.",
  effectiveDate: "June 2026",
  heroImage: images.travel,
  heroImageAlt: "Luxury travel landscape",
  sections: [
    {
      title: "1. Who We Are",
      paragraphs: [
        "TRAGUIN Luxury Travel (“TRAGUIN”, “we”, “us”, or “our”) is a bespoke luxury travel studio based in Ahmedabad, India. We design and coordinate premium travel experiences across India and internationally.",
        `Our registered studio address is available on our Contact page. For privacy-related requests, email us at ${contactInfo.email}.`,
      ],
    },
    {
      title: "2. Scope of This Policy",
      paragraphs: [
        "This policy applies to personal information collected through our website (traguin.com and related domains), inquiry forms, phone calls, email, WhatsApp, social media messages, in-person consultations, and any other channel where you interact with TRAGUIN.",
        "By using our website or submitting your details, you acknowledge that you have read this Privacy Policy. If you do not agree, please do not use our services or submit personal information.",
      ],
    },
    {
      title: "3. Information We Collect",
      paragraphs: ["We may collect the following categories of information:"],
      list: [
        "Identity & contact details: name, email address, phone number, WhatsApp number, city, and country",
        "Travel preferences: destinations, travel dates, budget range, number of travelers, travel style, special occasions, and accessibility or dietary requirements",
        "Booking information: passport details, visa information, frequent-flyer numbers, hotel preferences, and insurance details when required to confirm an itinerary",
        "Payment-related information: billing details and transaction references (payments are typically processed through secure third-party gateways; we do not store full card numbers on our servers)",
        "Communications: messages, call notes, feedback, and documents you share with our travel designers",
        "Technical data: IP address, browser type, device identifiers, pages visited, referral source, and cookies when you browse our website",
        "Marketing preferences: whether you have opted in to receive promotional communications from us",
      ],
    },
    {
      title: "4. How We Collect Information",
      paragraphs: ["We collect information when you:"],
      list: [
        "Complete forms on our website (Plan My Journey, contact forms, itinerary inquiries, hotel booking requests, and similar)",
        "Call, email, or message us on WhatsApp or social platforms",
        "Meet with our travel designers in person or via video consultation",
        "Subscribe to updates or request a brochure or proposal",
        "Browse our website (through cookies and analytics tools, where enabled)",
      ],
    },
    {
      title: "5. How We Use Your Information",
      paragraphs: ["We use your personal information to:"],
      list: [
        "Respond to inquiries and prepare bespoke travel proposals and itineraries",
        "Confirm bookings with hotels, airlines, DMCs, experience providers, and other partners on your behalf",
        "Coordinate transfers, visas, insurance, and on-ground support before and during travel",
        "Send service-related communications such as itinerary updates, vouchers, payment reminders, and travel documents",
        "Provide post-trip follow-up and customer support",
        "Improve our website, services, and client experience through internal analysis",
        "Send marketing communications about offers, destinations, and events where you have given consent or where permitted by law",
        "Comply with legal, tax, accounting, and regulatory obligations",
        "Prevent fraud, misuse, and unauthorized access to our systems",
      ],
    },
    {
      title: "6. Legal Basis for Processing",
      paragraphs: [
        "Depending on applicable law, we process your information based on one or more of the following grounds: your consent; performance of a contract or steps taken at your request before entering a contract; our legitimate interests in operating and improving our business; and compliance with legal obligations.",
      ],
    },
    {
      title: "7. Marketing & Communications",
      paragraphs: [
        "With your consent, we may contact you via SMS, email, WhatsApp, phone, RCS, or other messaging channels about TRAGUIN services, promotions, and travel inspiration relevant to your interests.",
        "You may withdraw marketing consent at any time by replying STOP to SMS messages, using the unsubscribe link in emails, or contacting us at sales@traguin.in. Service-related messages about active bookings or inquiries may still be sent even if you opt out of marketing.",
      ],
    },
    {
      title: "8. Sharing of Information",
      paragraphs: [
        "We do not sell or rent your personal information to third parties.",
        "We may share relevant details with trusted partners strictly as needed to deliver the services you request, including:",
      ],
      list: [
        "Hotels, resorts, airlines, cruise lines, and accommodation providers",
        "Destination management companies (DMCs), guides, and experience operators",
        "Visa consultants, insurance providers, and payment processors",
        "Technology vendors that host our website, CRM, or communication tools (under confidentiality obligations)",
        "Professional advisers such as lawyers or accountants where reasonably required",
        "Law enforcement, regulators, or courts when required by applicable law",
      ],
    },
    {
      title: "9. International Data Transfers",
      paragraphs: [
        "Because we arrange international travel, your information may be transferred to and processed in countries outside India, including destinations you plan to visit. We take reasonable steps to ensure that such transfers are subject to appropriate safeguards where required by law.",
      ],
    },
    {
      title: "10. Data Retention",
      paragraphs: [
        "We retain personal information only for as long as necessary to fulfill the purposes described in this policy, including managing active inquiries, confirmed bookings, post-travel support, dispute handling, and legal or accounting record-keeping.",
        "When information is no longer required, we securely delete or anonymize it unless a longer retention period is mandated by law.",
      ],
    },
    {
      title: "11. Security",
      paragraphs: [
        "We implement reasonable administrative, technical, and organizational measures to protect your information against unauthorized access, loss, misuse, or alteration. These include access controls, secure hosting, and staff training.",
        "No method of transmission over the internet or electronic storage is completely secure. Please share sensitive documents only through channels we approve, and protect your own devices and account credentials.",
      ],
    },
    {
      title: "12. Your Rights",
      paragraphs: [
        "Subject to applicable law (including India’s Digital Personal Data Protection Act, 2023, where applicable), you may have the right to:",
      ],
      list: [
        "Request access to the personal information we hold about you",
        "Request correction of inaccurate or incomplete information",
        "Request deletion of your information where legally permitted",
        "Withdraw consent for processing that relies on consent",
        "Object to or restrict certain processing activities",
        "Lodge a complaint with a relevant data protection authority",
      ],
    },
    {
      title: "12a. Exercising Your Rights",
      paragraphs: [
        `To exercise these rights, contact us at ${contactInfo.email}. We may need to verify your identity before fulfilling a request.`,
      ],
    },
    {
      title: "13. Children’s Privacy",
      paragraphs: [
        "Our services are not directed at children under 18. We do not knowingly collect personal information from children without appropriate parental or guardian consent. If you believe we have collected information from a child improperly, please contact us and we will take steps to delete it.",
      ],
    },
    {
      title: "14. Cookies & Analytics",
      paragraphs: [
        "Our website may use cookies, pixels, and similar technologies to remember preferences, maintain sessions, measure traffic, and understand how visitors use our pages.",
        "You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.",
      ],
    },
    {
      title: "15. Third-Party Links",
      paragraphs: [
        "Our website may contain links to partner hotels, airlines, social media platforms, or payment providers. Their privacy practices are governed by their own policies. We encourage you to review those policies before providing information to third parties.",
      ],
    },
    {
      title: "16. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Material updates will be posted on this page with a revised effective date. Continued use of our website after changes constitutes acceptance of the updated policy.",
      ],
    },
    {
      title: "17. Contact Us",
      paragraphs: [
        `For privacy questions, access requests, or complaints, contact us at ${contactInfo.email}, call ${contactInfo.phone}, or write to our Ahmedabad studio at the address listed on our Contact page.`,
      ],
    },
  ],
};

export const termsOfService: LegalPageContent = {
  eyebrow: "Legal",
  title: "Terms of Service",
  description:
    "These Terms of Service govern your use of the TRAGUIN website and your engagement with our luxury travel planning, booking coordination, and advisory services.",
  effectiveDate: "June 2026",
  heroImage: images.experienceCorporate,
  heroImageAlt: "Travel expert at work",
  sections: [
    {
      title: "1. Agreement to Terms",
      paragraphs: [
        "By accessing our website, submitting an inquiry, communicating with our team, or engaging TRAGUIN Luxury Travel (“TRAGUIN”, “we”, “us”) for travel services, you agree to these Terms of Service (“Terms”). If you do not agree, please do not use our website or services.",
        "These Terms apply together with any proposal, booking confirmation, invoice, or service agreement we issue for a specific journey. Where there is a conflict, the terms of your confirmed booking documentation will prevail for that booking.",
      ],
    },
    {
      title: "2. About Our Services",
      paragraphs: [
        "TRAGUIN provides luxury travel design, itinerary planning, booking coordination, concierge support, and related advisory services. Unless expressly agreed in writing, we act as an intermediary between you and third-party suppliers such as hotels, airlines, transfer operators, cruise lines, and experience providers.",
        "Proposals, quotes, and sample itineraries are indicative and subject to availability, supplier confirmation, seasonal pricing, and your final approval.",
      ],
    },
    {
      title: "3. Eligibility",
      paragraphs: [
        "You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use our services. If you book on behalf of others, you confirm that you are authorized to provide their information and accept these Terms on their behalf.",
      ],
    },
    {
      title: "4. Inquiries & Proposals",
      paragraphs: [
        "Submitting a form or speaking with our team does not create a confirmed booking. A journey is confirmed only after you approve the final itinerary and satisfy the deposit and payment requirements we specify.",
        "We aim to respond to inquiries promptly and provide first itinerary drafts within the timelines communicated at the time of inquiry, but timelines may vary based on complexity and supplier response times.",
      ],
    },
    {
      title: "5. Bookings, Pricing & Payments",
      paragraphs: [
        "Quoted prices may change before confirmation due to currency fluctuations, fuel surcharges, taxes, supplier rate changes, or availability. We will communicate material changes before proceeding.",
        "Payment schedules, accepted methods, and currency will be stated in your booking documentation. Failure to pay according to the agreed schedule may result in cancellation of reservations and forfeiture of deposits as per supplier rules.",
        "All prices are quoted in the currency specified in your proposal unless otherwise stated. You are responsible for any bank charges, foreign exchange fees, or transfer costs unless we agree otherwise in writing.",
      ],
    },
    {
      title: "6. Cancellations, Changes & Refunds",
      paragraphs: [
        "Cancellation and amendment policies depend on the terms of each supplier involved in your itinerary (airlines, hotels, DMCs, etc.). We will help facilitate change requests, but penalties imposed by suppliers may apply and are typically non-refundable.",
        "TRAGUIN planning or service fees, where charged, are disclosed before confirmation and are generally non-refundable once work has commenced, unless otherwise stated in writing.",
        "Refunds, where eligible, are processed only after we receive funds back from suppliers and may take several weeks depending on banking and supplier timelines.",
      ],
    },
    {
      title: "7. Travel Documents & Client Responsibilities",
      paragraphs: ["You are responsible for:"],
      list: [
        "Valid passports, visas, permits, vaccinations, and health certificates required for your journey",
        "Arriving at airports, hotels, and experiences on time with correct documentation",
        "Reviewing itinerary details, spelling of names, dates, and inclusions before final payment",
        "Purchasing adequate travel insurance covering medical emergencies, cancellation, baggage, and trip interruption",
        "Complying with local laws, customs, and supplier rules at destinations",
        "Informing us of medical conditions, mobility needs, dietary restrictions, or other requirements that may affect your trip",
      ],
    },
    {
      title: "7a. Visa & Entry Assistance",
      paragraphs: [
        "TRAGUIN may assist with visa guidance and documentation support but does not guarantee visa approvals, entry permissions, or immigration outcomes.",
      ],
    },
    {
      title: "8. Travel Insurance",
      paragraphs: [
        "We strongly recommend comprehensive travel insurance for every journey. Insurance can be arranged through us or independently. Without adequate insurance, you may bear the full cost of cancellations, medical emergencies, delays, or lost baggage.",
      ],
    },
    {
      title: "9. Supplier Conduct & Third Parties",
      paragraphs: [
        "Hotels, airlines, guides, and other suppliers are independent parties. TRAGUIN is not responsible for their acts, omissions, delays, overbookings, service quality, or failure to perform, except where liability cannot be excluded under applicable law.",
        "Any dispute with a supplier should be reported to us promptly so we can attempt to assist, but we cannot guarantee a particular outcome.",
      ],
    },
    {
      title: "10. Force Majeure",
      paragraphs: [
        "We are not liable for failure or delay in performing obligations due to events beyond our reasonable control, including natural disasters, pandemics, war, civil unrest, government restrictions, strikes, technical failures, or severe weather. In such cases, supplier cancellation policies and insurance coverage will typically apply.",
      ],
    },
    {
      title: "11. Website Use",
      paragraphs: ["When using our website, you agree not to:"],
      list: [
        "Misuse the site, attempt unauthorized access, or interfere with its security or operation",
        "Copy, scrape, reproduce, or redistribute content without our written permission",
        "Submit false, misleading, fraudulent, or defamatory information",
        "Use the site for unlawful purposes or to harass our team or other users",
        "Introduce viruses, malware, or harmful code",
      ],
    },
    {
      title: "12. Intellectual Property",
      paragraphs: [
        "All website content, branding, logos, photography, itineraries, proposals, and materials produced by TRAGUIN are protected by intellectual property laws and remain our property or that of our licensors. You may not reuse, publish, or distribute them without prior written consent.",
      ],
    },
    {
      title: "13. Privacy & Communications",
      paragraphs: [
        "Your use of our services is also governed by our Privacy Policy. By submitting forms or contacting us, you consent to our use of your information as described there, including service-related communications via email, phone, SMS, and WhatsApp.",
        "To Communicate with You: We may use your information to respond to your inquiries, provide customer service support, send you important information about the services, and send you marketing communications (with your consent) via different channels, including but not limited to SMS, Email, WhatsApp, RCS and Voice.",
        "Marketing communications are sent only where permitted by law and, where required, with your consent. You may opt out at any time as described in our Privacy Policy.",
      ],
    },
    {
      title: "14. Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by law, TRAGUIN shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, enjoyment, or opportunity, arising from your use of our website or services.",
        "Our total liability for any claim relating to a specific booking is limited to the professional fees actually paid to TRAGUIN for that booking, unless a higher limit is required by applicable consumer protection law.",
        "Nothing in these Terms excludes liability that cannot be excluded under applicable law, including liability for fraud or willful misconduct.",
      ],
    },
    {
      title: "15. Indemnity",
      paragraphs: [
        "You agree to indemnify and hold TRAGUIN harmless from claims, losses, or expenses arising from your breach of these Terms, your violation of applicable law, or inaccurate information you provide to us or suppliers.",
      ],
    },
    {
      title: "16. Dispute Resolution",
      paragraphs: [
        "We encourage you to contact us first at sales@traguin.in so we can attempt to resolve concerns amicably. If a dispute cannot be resolved informally, it shall be subject to the governing law and jurisdiction below.",
      ],
    },
    {
      title: "17. Governing Law & Jurisdiction",
      paragraphs: [
        "These Terms are governed by the laws of India. Subject to applicable consumer protection laws, disputes shall fall under the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.",
      ],
    },
    {
      title: "18. Changes to These Terms",
      paragraphs: [
        "We may update these Terms from time to time. Updated Terms will be posted on this page with a revised effective date. Continued use of our website after changes constitutes acceptance of the updated Terms.",
      ],
    },
    {
      title: "19. Contact",
      paragraphs: [
        `Questions about these Terms may be directed to ${contactInfo.email}, ${contactInfo.phone}, or through the contact details on our website.`,
      ],
    },
  ],
};
