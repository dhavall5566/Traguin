import { Sparkles, Headphones, Award, Globe2 } from "lucide-react";

export const valueProps = [
  {
    id: "personalized",
    title: "Bespoke by Design",
    description: "No templates, every route, stay, and moment is shaped around how you travel and what you value.",
    icon: Sparkles,
  },
  {
    id: "expert",
    title: "Dedicated Travel Expert",
    description: "One senior designer from first call through departure, plus 24·7 on-ground support when you need it.",
    icon: Headphones,
  },
  {
    id: "expertise",
    title: "Curated with Intent",
    description: "Properties, guides, and experiences vetted for service, setting, and the quiet excellence discerning travelers expect.",
    icon: Award,
  },
  {
    id: "network",
    title: "Preferred Access",
    description: "Relationships with leading hotel groups and local specialists unlock upgrades and invitations rarely available to the public.",
    icon: Globe2,
  },
] as const;
