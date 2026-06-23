import type { Metadata } from "next";
import { ClientStoriesPage } from "@/components/client-stories/ClientStoriesPage";

export const metadata: Metadata = {
  title: "Client Stories",
  description: "Reviews, travel stories, and testimonials from TRAGUIN travelers.",
};

export default function Page() {
  return <ClientStoriesPage />;
}
