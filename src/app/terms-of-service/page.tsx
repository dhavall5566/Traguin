import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Service | TRAGUIN Luxury Travel",
  },
  description: termsOfService.description,
};

export default function TermsOfServicePage() {
  return <LegalPage pageKey="terms-of-service" content={termsOfService} />;
}
