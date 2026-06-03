import { Sparkles, Headphones, Award, Globe2 } from "lucide-react";

export const valueProps = [
  {
    id: "personalized",
    title: "Personalized Planning",
    description: "Every itinerary is handcrafted to reflect your pace, preferences, and passions.",
    icon: Sparkles,
  },
  {
    id: "concierge",
    title: "Concierge Service",
    description: "Dedicated support before, during, and after every journey you take with us.",
    icon: Headphones,
  },
  {
    id: "expertise",
    title: "Trusted Expertise",
    description: "Luxury travel specialists curating exceptional experiences since 2008.",
    icon: Award,
  },
  {
    id: "network",
    title: "Global Network",
    description: "Preferred access to premium hotels, partners, and experiences worldwide.",
    icon: Globe2,
  },
] as const;
