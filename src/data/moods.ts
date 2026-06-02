import type { MoodOption } from "@/types";
import { images, galleryImages } from "@/lib/images";

export const moods: MoodOption[] = [
  {
    id: "luxury",
    label: "Luxury",
    description: "Uncompromising elegance at every touchpoint",
    image: images.luxury,
  },
  {
    id: "adventure",
    label: "Adventure",
    description: "Push boundaries in extraordinary landscapes",
    image: images.adventure,
  },
  {
    id: "romantic",
    label: "Romantic",
    description: "Intimate moments crafted for two",
    image: images.romantic,
  },
  {
    id: "family",
    label: "Family",
    description: "Memories that span generations",
    image: images.family,
  },
  {
    id: "wildlife",
    label: "Wildlife",
    description: "Encounter nature's most magnificent creatures",
    image: images.wildlife,
  },
  {
    id: "beach",
    label: "Beach",
    description: "Where turquoise waters meet golden sands",
    image: images.beach,
  },
  {
    id: "nature",
    label: "Nature",
    description: "Reconnect with the earth's raw beauty",
    image: images.nature,
  },
  {
    id: "spiritual",
    label: "Spiritual",
    description: "Journeys that nourish the soul",
    image: images.spiritual,
  },
];

export const journeySteps = [
  {
    id: "discover",
    title: "Discover",
    description: "Explore curated destinations and experiences tailored to your vision.",
    icon: "compass",
  },
  {
    id: "consult",
    title: "Consult",
    description: "Connect with our travel architects for a personalized discovery call.",
    icon: "message-circle",
  },
  {
    id: "customize",
    title: "Customize",
    description: "Every detail refined until your journey feels unmistakably yours.",
    icon: "sliders",
  },
  {
    id: "book",
    title: "Book",
    description: "Seamless reservations with exclusive rates and VIP privileges.",
    icon: "check-circle",
  },
  {
    id: "travel",
    title: "Travel",
    description: "Embark with 24/7 concierge support at every step.",
    icon: "plane",
  },
  {
    id: "support",
    title: "Support",
    description: "Dedicated assistance before, during, and after your return.",
    icon: "heart-handshake",
  },
];

export const stats = [
  { label: "Curated Destinations", value: 120, suffix: "+" },
  { label: "Luxury Hotels", value: 850, suffix: "+" },
  { label: "Happy Travelers", value: 15000, suffix: "+" },
  { label: "Years of Excellence", value: 18, suffix: "" },
];

export const testimonials = [
  {
    id: "1",
    name: "Priya & Arjun Sharma",
    destination: "Bali",
    quote: "Traguin transformed our honeymoon into a cinematic love story. Every moment felt personally orchestrated.",
    image: images.couple1,
  },
  {
    id: "2",
    name: "Rajesh Mehta",
    destination: "Switzerland",
    quote: "The attention to detail was extraordinary. From private transfers to hidden alpine restaurants — flawless.",
    image: images.man1,
  },
  {
    id: "3",
    name: "Ananya Desai",
    destination: "Kerala",
    quote: "Our family backwater journey was magical. The kids still talk about the houseboat every day.",
    image: images.woman1,
  },
  {
    id: "4",
    name: "Vikram & Neha Kapoor",
    destination: "Dubai",
    quote: "Corporate retreat turned luxury escape. Traguin handled everything with white-glove precision.",
    image: images.couple2,
  },
];

export { galleryImages };
