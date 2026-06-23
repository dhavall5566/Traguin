import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalPageData } from "@/lib/api/legal";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLegalPageData("terms-of-service");
  if (!content) return { title: "Terms of Service" };

  return {
    title: { absolute: "Terms of Service | TRAGUIN Luxury Travel" },
    description: content.description,
  };
}

export default async function TermsOfServicePage() {
  const content = await getLegalPageData("terms-of-service");
  if (!content) notFound();

  return <LegalPage pageKey="terms-of-service" content={content} />;
}
