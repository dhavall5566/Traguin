import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import type { LegalPageContent } from "@/data/legal";

type LegalPageProps = {
  content: LegalPageContent;
  pageKey: string;
};

export function LegalPage({ content, pageKey }: LegalPageProps) {
  return (
    <div key={pageKey}>
      <PageHero
        variant="banner"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
      />
      <TrustBar />
      <PageShell noPaddingTop>
        <LegalDocumentBody content={content} />
        <div className="mt-8 flex flex-wrap gap-4 border-t border-glass-border pt-6 text-xs tracking-[0.14em] uppercase">
          <Link href="/privacy-policy" className="text-muted transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-muted transition-colors hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
