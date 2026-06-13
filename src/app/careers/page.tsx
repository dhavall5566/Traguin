import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TRAGUIN as a luxury travel designer, travel expert, or MICE specialist in Ahmedabad.",
};

export default function Page() {
  return <CareersPage />;
}
