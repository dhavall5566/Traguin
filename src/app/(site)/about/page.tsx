import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";
import { getAboutPageData } from "@/lib/api/about";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, philosophy, and expertise since 2024, TRAGUIN luxury travel experts.",
};

export default async function Page() {
  const data = await getAboutPageData();
  return <AboutPage data={data} />;
}
