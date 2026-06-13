import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy | TRAGUIN Luxury Travel",
  },
  description: privacyPolicy.description,
};

export default function PrivacyPolicyPage() {
  return <LegalPage pageKey="privacy-policy" content={privacyPolicy} />;
}
