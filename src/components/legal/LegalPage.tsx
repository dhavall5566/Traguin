import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import type { LegalPageContent } from "@/data/legal";
import { contactInfo } from "@/data/contact";

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
      <PageShell noPaddingTop containerClassName="site-container--content">
        <div className="legal-page">
          <p className="text-xs tracking-[0.22em] text-muted uppercase">
            Effective {content.effectiveDate}
          </p>

          <div className="mt-10 space-y-10">
            {content.sections.map((section) => (
              <section key={section.title} className="legal-section">
                <h2 className="font-display text-xl text-foreground md:text-2xl">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-sm leading-relaxed text-foreground/78 sm:text-[0.9375rem]">
                    {paragraph}
                  </p>
                ))}
                {section.list && section.list.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="relative pl-5 text-sm leading-relaxed text-foreground/78 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold sm:text-[0.9375rem]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="legal-page__footer mt-14 rounded-2xl border border-glass-border bg-surface/60 p-6 md:p-8">
            <p className="text-sm leading-relaxed text-foreground/78">
              Questions about this document? Contact us at{" "}
              <a href={contactInfo.emailHref} className="text-gold hover:underline">
                {contactInfo.email}
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-gold hover:underline">
                Contact page
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs tracking-[0.14em] uppercase">
              <Link href="/privacy-policy" className="text-muted transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-muted transition-colors hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
