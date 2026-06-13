import { images } from "@/lib/images";

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
    "How TRAGUIN collects, uses, and protects your personal information when you plan and book luxury travel with us.",
  effectiveDate: "June 2026",
  heroImage: images.travel,
  heroImageAlt: "Luxury travel landscape",
  sections: [
    {
      title: "Introduction",
      paragraphs: [
        "TRAGUIN Luxury Travel (“TRAGUIN”, “we”, “us”) respects your privacy and is committed to protecting the personal information you share when using our website, inquiry forms, WhatsApp communications, and travel planning services.",
        "This Privacy Policy explains what data we collect, why we collect it, how we use it, and the choices available to you.",
      ],
    },
    {
      title: "Information We Collect",
      paragraphs: ["We may collect the following categories of information:"],
      list: [
        "Contact details such as name, email address, phone number, and WhatsApp number",
        "Travel preferences including destinations, dates, budget, companions, and special requests",
        "Booking and payment-related information required to confirm itineraries (processed through secure partners where applicable)",
        "Communications you send us via forms, email, phone, or messaging platforms",
        "Technical data such as browser type, device information, and approximate location derived from IP address when you visit our website",
      ],
    },
    {
      title: "How We Use Your Information",
      paragraphs: ["We use your information to:"],
      list: [
        "Respond to inquiries and prepare bespoke travel proposals",
        "Design, confirm, and manage itineraries, accommodations, and experiences",
        "Coordinate with hotels, airlines, DMCs, and other trusted travel partners on your behalf",
        "Provide customer support before, during, and after your journey",
        "Send service-related updates, documents, and itinerary changes",
        "Improve our website, services, and client experience",
        "Comply with applicable laws, regulations, and contractual obligations",
      ],
    },
    {
      title: "Sharing of Information",
      paragraphs: [
        "We do not sell your personal information. We may share relevant details with hotels, airlines, insurance providers, visa agents, and other partners strictly as needed to deliver the services you request.",
        "We may also disclose information when required by law, to protect our rights, or to prevent fraud or misuse of our services.",
      ],
    },
    {
      title: "Data Retention",
      paragraphs: [
        "We retain personal information for as long as necessary to fulfill the purposes described in this policy, including maintaining records of completed journeys, handling post-travel support, and meeting legal or accounting requirements.",
      ],
    },
    {
      title: "Security",
      paragraphs: [
        "We implement reasonable administrative, technical, and organizational measures to safeguard your information. No method of transmission over the internet is completely secure, and we encourage you to share sensitive documents through approved channels only.",
      ],
    },
    {
      title: "Your Rights",
      paragraphs: ["Depending on applicable law, you may have the right to:"],
      list: [
        "Request access to the personal information we hold about you",
        "Request correction of inaccurate or incomplete information",
        "Request deletion of information where legally permitted",
        "Withdraw consent for marketing communications at any time",
      ],
    },
    {
      title: "Cookies & Analytics",
      paragraphs: [
        "Our website may use cookies and similar technologies to remember preferences, maintain sessions, and understand how visitors use our pages. You can adjust cookie settings through your browser.",
      ],
    },
    {
      title: "Third-Party Links",
      paragraphs: [
        "Our website may contain links to partner properties, social platforms, or payment providers. Their privacy practices are governed by their own policies, and we encourage you to review them separately.",
      ],
    },
    {
      title: "Updates to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. Material changes will be reflected on this page with a revised effective date.",
      ],
    },
    {
      title: "Contact Us",
      paragraphs: [
        "For privacy-related questions or requests, contact us at inquiry@traguin.com or write to our Ahmedabad studio at the address listed on our Contact page.",
      ],
    },
  ],
};

export const termsOfService: LegalPageContent = {
  eyebrow: "Legal",
  title: "Terms of Service",
  description:
    "The terms governing your use of TRAGUIN’s website and luxury travel planning services.",
  effectiveDate: "June 2026",
  heroImage: images.experienceCorporate,
  heroImageAlt: "Travel expert at work",
  sections: [
    {
      title: "Agreement",
      paragraphs: [
        "By accessing our website, submitting an inquiry, or engaging TRAGUIN Luxury Travel for travel planning services, you agree to these Terms of Service. If you do not agree, please do not use our website or services.",
      ],
    },
    {
      title: "Our Services",
      paragraphs: [
        "TRAGUIN provides luxury travel design, itinerary planning, booking coordination, and related advisory services. We act as an intermediary between you and third-party suppliers such as hotels, airlines, transfer operators, and experience providers unless otherwise agreed in writing.",
        "Proposals, quotes, and itineraries are subject to availability and confirmation by relevant suppliers.",
      ],
    },
    {
      title: "Bookings & Payments",
      paragraphs: [
        "A booking is confirmed only after you approve the final itinerary and required deposits or payments are received according to the payment schedule we provide.",
        "Prices may change before confirmation due to currency fluctuations, supplier rate changes, taxes, or availability. We will communicate material changes before proceeding.",
        "Payment terms, cancellation charges, and refund eligibility vary by supplier and will be disclosed in your booking documentation.",
      ],
    },
    {
      title: "Travel Documents & Compliance",
      paragraphs: [
        "You are responsible for valid passports, visas, health certificates, insurance, and any other documentation required for your journey. TRAGUIN may assist with guidance but does not guarantee visa approvals or entry permissions.",
      ],
    },
    {
      title: "Changes & Cancellations",
      paragraphs: [
        "Change and cancellation policies depend on the terms of each supplier involved in your itinerary. We will help facilitate requests, but fees imposed by airlines, hotels, or partners may apply.",
        "TRAGUIN service fees, where applicable, are non-refundable unless otherwise stated in writing.",
      ],
    },
    {
      title: "Travel Insurance",
      paragraphs: [
        "We strongly recommend comprehensive travel insurance covering cancellation, medical emergencies, baggage loss, and trip interruption. Insurance can be arranged upon request.",
      ],
    },
    {
      title: "Limitation of Liability",
      paragraphs: [
        "TRAGUIN is not liable for acts, errors, omissions, or failures of third-party suppliers, force majeure events, travel disruptions, personal injury, loss, or damage except where liability cannot be excluded under applicable law.",
        "Our liability for any claim relating to our services is limited to the fees paid to TRAGUIN for the specific booking in question, unless a higher limit is required by law.",
      ],
    },
    {
      title: "Website Use",
      paragraphs: ["When using our website, you agree not to:"],
      list: [
        "Misuse the site, attempt unauthorized access, or interfere with its operation",
        "Copy, scrape, or reproduce content without permission",
        "Submit false, misleading, or fraudulent information",
      ],
    },
    {
      title: "Intellectual Property",
      paragraphs: [
        "All website content, branding, itineraries, photography, and materials produced by TRAGUIN remain our intellectual property or that of our licensors and may not be reused without written consent.",
      ],
    },
    {
      title: "Governing Law",
      paragraphs: [
        "These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, unless otherwise required by applicable consumer protection law.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "Questions about these Terms may be directed to inquiry@traguin.com or through the contact details on our website.",
      ],
    },
  ],
};
