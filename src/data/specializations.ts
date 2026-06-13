import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type Specialization = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const specializations: Specialization[] = [
  {
    id: "solo",
    title: "Solo",
    description: "Curated independent journeys with private guides, seamless logistics, and complete peace of mind.",
    icon: User,
  },
  {
    id: "school-trips",
    title: "School Trips",
    description: "Educational and adventure programs designed for student groups with safety-first planning.",
    icon: GraduationCap,
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    description: "Executive retreats, offsites, and incentive travel executed with precision and polish.",
    icon: Briefcase,
  },
  {
    id: "divine-travel",
    title: "Divine Travel",
    description: "Pilgrimage and spiritual journeys with respectful pacing, comfort, and meaningful immersion.",
    icon: Sparkles,
  },
  {
    id: "mice",
    title: "MICE",
<<<<<<< HEAD
    description: "Meetings, incentives, conferences, and exhibitions — end-to-end destination management.",
=======
    description: "Meetings, incentives, conferences, and exhibitions, end-to-end destination management.",
>>>>>>> dhaval
    icon: Building2,
  },
];
