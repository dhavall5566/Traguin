import { ArrowUpRight, MapPin } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { contactInfo } from "@/data/contact";
import { pageHeroes } from "@/data/pageContent";
import { getSiteTrustHighlights } from "@/lib/site-trust-stats";
import { isHotelContentVisible } from "@/lib/site-features";

export function AboutHeroSection() {
  const hero = pageHeroes.about;
  const trustHighlights = isHotelContentVisible()
    ? getSiteTrustHighlights()
    : getSiteTrustHighlights().filter((item) => item.label !== "Partner properties");

  return (
    <div className="about-hero-wrap">
      <section className="about-hero page-hero page-hero--banner" aria-labelledby="about-hero-heading">
        <div className="about-hero__media" aria-hidden>
          <SafeImage
            src={hero.image ?? ""}
            alt=""
            className="page-hero__image about-hero__image"
            loading="eager"
          />
        </div>
        <div className="page-hero__scrim" aria-hidden />

        <div className="home-shell relative z-10">
          <div className="site-container page-hero__content about-hero__content">
            <div className="about-hero__copy">
              <div className="about-hero__eyebrow-row">
                <p className="about-hero__eyebrow">{hero.eyebrow}</p>
                {hero.badge ? <span className="about-hero__badge">{hero.badge}</span> : null}
              </div>
              <h1 id="about-hero-heading" className="about-hero__title">
                {hero.title}
              </h1>
              <p className="about-hero__description">{hero.description}</p>
              <div className="about-hero__actions">
                {hero.primaryAction ? (
                  <MagneticButton as="a" href={hero.primaryAction.href} variant="primary" className="!text-xs">
                    {hero.primaryAction.label}
                    <ArrowUpRight size={14} />
                  </MagneticButton>
                ) : null}
                {hero.secondaryAction ? (
                  <MagneticButton
                    as="a"
                    href={hero.secondaryAction.href}
                    variant="secondary"
                    className="about-hero__secondary !text-xs"
                  >
                    {hero.secondaryAction.label}
                  </MagneticButton>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-hero-stats page-x-padding" aria-label="TRAGUIN credentials and company overview">
        <div className="site-container">
          <article className="about-hero-stats__card">
            <header className="about-hero-stats__header">
              <p className="about-hero-stats__eyebrow">At a glance</p>
            </header>

            <div className="about-hero-stats__metrics" role="list">
              {trustHighlights.map((item) => (
                <article key={item.label} className="about-hero-stats__metric" role="listitem">
                  <p className="about-hero-stats__metric-label">{item.label}</p>
                  <p className="about-hero-stats__metric-value">{item.value}</p>
                </article>
              ))}
            </div>

            <footer className="about-hero-stats__office" aria-label="Registered office">
              <MapPin size={15} strokeWidth={1.75} aria-hidden className="about-hero-stats__office-icon" />
              <div className="about-hero-stats__office-copy">
                <p className="about-hero-stats__office-label">Registered office</p>
                <address className="about-hero-stats__office-address not-italic">
                  {contactInfo.aboutRegisteredAddressLines.join(", ")}
                </address>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}
