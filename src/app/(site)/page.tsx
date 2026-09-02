import { HomePageContent } from "@/components/home/HomePageContent";
import { getHomepageData } from "@/lib/api/homepage";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepageData();

  return <HomePageContent data={data} />;
}
