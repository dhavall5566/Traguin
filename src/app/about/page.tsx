import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, philosophy, and expertise since 2008 — Traguin luxury travel concierge.",
};

export default function Page() {
  return <AboutPage />;
}
