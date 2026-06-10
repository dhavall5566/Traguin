import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, philosophy, and expertise since 2024 — TRAGUIN luxury travel experts.",
};

export default function Page() {
  return <AboutPage />;
}
