import type { Metadata } from "next";
import { HomeHeroSliderManager } from "@/components/admin/HomeHeroSliderManager";

export const metadata: Metadata = {
  title: "Homepage Hero Slider",
};

export default function HomepageHeroSliderPage() {
  return <HomeHeroSliderManager />;
}
