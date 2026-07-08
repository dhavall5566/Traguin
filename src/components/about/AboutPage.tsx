import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqSection } from "@/components/ui/FaqSection";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { ClientMarquee } from "@/components/about/ClientMarquee";
import { aboutFaq } from "@/data/faq";
import { pageHeroes } from "@/data/pageContent";
import type { AboutPageData } from "@/lib/api/about";

type AboutPageProps = {
  data: AboutPageData;
};

export function AboutPage({ data }: AboutPageProps) {
  return (
    <>
      <PageHero {...pageHeroes.about} />
      <TrustBar />
      <PageShell noPaddingTop>
        <SectionHeader
          align="left"
          eyebrow={data.header.eyebrow}
          title={data.header.title}
          description={data.header.description}
          titleClassName="text-[clamp(1.75rem,4vw,3rem)]"
          className="mb-10 md:mb-12"
        />

        {data.storySections.length > 0 ? (
          <div className="page-content-grid md:grid-cols-2">
            {data.storySections.map((section) => (
              <article key={section.id} className="glass rounded-2xl border border-glass-border p-7 md:p-8">
                <h2 className="font-display text-2xl font-semibold text-foreground">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.split(/\n\n+/).map((paragraph, index) => (
                    <p key={index} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Our story sections are being updated. Please check back soon.</p>
        )}

        {data.clientLogos.length > 0 ? <ClientMarquee logos={data.clientLogos} /> : null}

        <section
          className={`rounded-3xl border border-glass-border bg-surface/60 px-4 py-10 sm:px-8 md:py-12 ${
            data.clientLogos.length > 0 ? "mt-16 md:mt-20" : "mt-14 md:mt-16"
          }`}
        >
          <FaqSection items={aboutFaq} titleClassName="font-semibold" />
        </section>

        <PageCTA />
      </PageShell>
    </>
  );
}
