import { contactInfo } from "@/data/contact";
import { curatedDestinationCount } from "@/data/pageContent";
import { primaryCta, secondaryCta } from "@/data/site";
import { isLuxuryStaysVisible } from "@/lib/site-features";
import { images } from "@/lib/images";

export const nikiAgent = {
  name: "Navanya",
  role: "Travel Expert",
  greeting: "How can I help you?",
  avatar: images.nikiAvatar,
  status: "Online now",
} as const;

export type NikiQuickReply = {
  id: string;
  label: string;
  response: string;
  href?: string;
  external?: boolean;
};

export const nikiWelcomeMessages = [
  "Hi, I'm Navanya, your TRAGUIN travel expert.",
  "We design bespoke luxury journeys across India and the world, with handpicked stays and white-glove coordination.",
  "Pick a topic below or message us on WhatsApp. I respond within 2 working hours.",
] as const;

export const nikiQuickReplies: NikiQuickReply[] = [
  {
    id: "destinations",
    label: "Destinations",
    response:
      `We curate ${curatedDestinationCount}+ destinations across two collections. Domestic (India): heritage circuits, Himalayan escapes, and coastal retreats across Rajasthan, Kerala, Kashmir, Himachal, Goa, and more. International: island escapes, alpine lodges, and iconic cities across Thailand, Bali, Singapore, Australia, Switzerland, Japan, and 40+ countries. Each destination includes day-by-day itineraries, partner hotels, and transparent pricing.`,
    href: "/destinations",
  },
  {
    id: "plan",
    label: "Plan my journey",
    response:
      "Share your dates, style, and budget. Our designers draft a bespoke itinerary within 2 hrs. Consultation is complimentary.",
    href: primaryCta.href,
  },
  {
    id: "stays",
    label: "Luxury stays",
    response:
      "Browse 28+ vetted palace hotels, cliffside resorts, and private villas, each selected for service, setting, and quiet excellence.",
    href: "/luxury-stays",
  },
  {
    id: "expert",
    label: "Speak with an expert",
    response:
      "I'll connect you with a senior travel designer right away. WhatsApp is fastest, or leave your details on our contact page.",
    href: contactInfo.whatsappHref,
    external: true,
  },
  {
    id: "consultation",
    label: "Free consultation",
    response:
      "Every great trip starts with a conversation. Request a complimentary planning session, no obligation, no generic quotes.",
    href: secondaryCta.href,
  },
  {
    id: "cancellation",
    label: "Cancellation",
    response:
      "Cancellation and refund terms depend on your booking and supplier policies. Share your booking reference on WhatsApp or our contact page and our team will guide you through amendments, penalties, and next steps.",
    href: contactInfo.whatsappHref,
    external: true,
  },
  {
    id: "query",
    label: "Query",
    response:
      "Have a question about an itinerary, payment, visa, or an existing booking? Message us on WhatsApp or submit your query on our contact page. We typically respond within 2 working hours.",
    href: "/contact",
  },
  {
    id: "about",
    label: "About TRAGUIN",
    response:
      "TRAGUIN is a luxury travel studio based in Ahmedabad. Since 2024 we've crafted personalized itineraries, never off-the-shelf packages, with dedicated experts from first call to homecoming.",
    href: "/about",
  },
];

export function getNikiQuickReplies(): NikiQuickReply[] {
  if (isLuxuryStaysVisible()) return nikiQuickReplies;
  return nikiQuickReplies.filter((reply) => reply.id !== "stays");
}
