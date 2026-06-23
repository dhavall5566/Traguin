import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";
import { getCareersPageData } from "@/lib/api/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TRAGUIN as a luxury travel designer, travel expert, or MICE specialist in Ahmedabad.",
};

export default async function Page() {
  const data = await getCareersPageData();
  return <CareersPage data={data} />;
}
