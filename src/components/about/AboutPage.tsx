import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutFaqPanel } from "@/components/about/AboutFaqPanel";
import { AboutStoryCatalog } from "@/components/about/AboutStoryCatalog";
import { ClientMarquee } from "@/components/about/ClientMarquee";
import { PageShell } from "@/components/layout/PageShell";
import { PageCTA } from "@/components/layout/PageCTA";
import { aboutFaq } from "@/data/faq";
import type { AboutPageData } from "@/lib/api/about";

type AboutPageProps = {
  data: AboutPageData;
};

export function AboutPage({ data }: AboutPageProps) {
  return (
    <div className="about-enterprise">
      <AboutHeroSection />

      <PageShell noPaddingTop className="about-enterprise__shell">
        <AboutStoryCatalog sections={data.storySections} />

        {data.clientLogos.length > 0 ? (
          <div className="about-enterprise__band">
            <ClientMarquee logos={data.clientLogos} />
          </div>
        ) : null}

        <AboutFaqPanel items={aboutFaq} />

        <PageCTA />
      </PageShell>
    </div>
  );
}
