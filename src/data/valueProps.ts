import { Sparkles, Headphones, Award, Globe2 } from "lucide-react";

export const valueProps = [
  {
    id: "personalized",
    step: "01",
    title: "Bespoke by Design",
    description: "No templates, every route, stay, and moment is shaped around how you travel and what you value.",
    highlight: "Designed around you",
    icon: Sparkles,
  },
  {
    id: "expert",
    step: "02",
    title: "Dedicated Travel Expert",
    description: "One senior designer from first call through departure, plus 24·7 on-ground support when you need it.",
    highlight: "One expert, end to end",
    icon: Headphones,
  },
  {
    id: "expertise",
    step: "03",
    title: "Curated with Intent",
    description: "Properties, guides, and experiences vetted for service, setting, and the quiet excellence discerning travelers expect.",
    highlight: "Vetted for excellence",
    icon: Award,
  },
  {
    id: "network",
    step: "04",
    title: "Preferred Access",
    description: "Relationships with leading hotel groups and local specialists unlock upgrades and invitations rarely available to the public.",
    highlight: "Insider privileges",
    icon: Globe2,
  },
] as const;
