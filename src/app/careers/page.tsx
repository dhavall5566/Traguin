import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TRAGUIN — luxury travel designers, travel experts, and MICE specialists in Ahmedabad.",
};

export default function Page() {
  return <CareersPage />;
}
