import type { Metadata } from "next";
import { ClientStoriesPage } from "@/components/client-stories/ClientStoriesPage";
import { getClientStoriesPageData } from "@/lib/api/client-stories-page";

export const metadata: Metadata = {
  title: "Client Stories",
  description: "Reviews, travel stories, and testimonials from TRAGUIN travelers.",
};

export const revalidate = 60;

export default async function Page() {
  const data = await getClientStoriesPageData();
  return <ClientStoriesPage {...data} />;
}
