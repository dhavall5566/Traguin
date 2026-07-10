import { ArrowUpRight, MapPin } from "lucide-react";
import { AboutFaqPanel } from "@/components/about/AboutFaqPanel";
import { AboutMetricsBar } from "@/components/about/AboutMetricsBar";
import { AboutStoryCatalog } from "@/components/about/AboutStoryCatalog";
import { ClientMarquee } from "@/components/about/ClientMarquee";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { contactInfo } from "@/data/contact";
import { aboutFaq } from "@/data/faq";
import { pageHeroes } from "@/data/pageContent";
import { primaryCta, secondaryCta } from "@/data/site";
import type { AboutPageData } from "@/lib/api/about";

type AboutPageProps = {
  data: AboutPageData;
};

export function AboutPage({ data }: AboutPageProps) {
  return (
    <div className="about-enterprise">
      <PageHero {...pageHeroes.about} />
      <TrustBar />
      <AboutMetricsBar />

      <PageShell noPaddingTop>
        <section className="about-intro">
          <div className="about-intro__grid">
            <div className="about-intro__lead">
              <p className="about-intro__eyebrow">{data.header.eyebrow}</p>
              <h2 className="about-intro__title">{data.header.title}</h2>
              <p className="about-intro__description">{data.header.description}</p>
              <div className="about-intro__actions">
                <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
                  {primaryCta.label}
                  <ArrowUpRight size={14} aria-hidden />
                </MagneticButton>
                <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
                  {secondaryCta.label}
                </MagneticButton>
              </div>
            </div>

            <address className="about-office about-intro__aside not-italic">
              <p className="about-office__label">
                <MapPin size={14} aria-hidden />
                Registered office
              </p>
              {contactInfo.aboutRegisteredAddressLines.map((line) => (
                <p key={line} className="about-office__line">
                  {line}
                </p>
              ))}
            </address>
          </div>
        </section>

        <AboutStoryCatalog sections={data.storySections} />

        {data.clientLogos.length > 0 ? <ClientMarquee logos={data.clientLogos} /> : null}

        <AboutFaqPanel items={aboutFaq} />

        <PageCTA />
      </PageShell>
    </div>
  );
}
