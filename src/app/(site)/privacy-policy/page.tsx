import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalPageData } from "@/lib/api/legal";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLegalPageData("privacy-policy");
  if (!content) return { title: "Privacy Policy" };

  return {
    title: { absolute: "Privacy Policy | TRAGUIN Luxury Travel" },
    description: content.description,
  };
}

export default async function PrivacyPolicyPage() {
  const content = await getLegalPageData("privacy-policy");
  if (!content) notFound();

  return <LegalPage pageKey="privacy-policy" content={content} />;
}
