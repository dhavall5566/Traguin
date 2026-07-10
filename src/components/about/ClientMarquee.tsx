"use client";

import Image from "next/image";
import type { AboutClientLogo } from "@/lib/api/about";

type ClientMarqueeProps = {
  logos: AboutClientLogo[];
};

function LogoCard({ client }: { client: AboutClientLogo }) {
  return (
    <div className="about-partners__logo-card">
      <Image
        src={client.logoSrc}
        alt={`${client.name} logo`}
        width={180}
        height={64}
        className="about-partners__logo-image"
        draggable={false}
      />
    </div>
  );
}

function MarqueeTrack({ logos }: { logos: AboutClientLogo[] }) {
  const items = [...logos, ...logos];

  return (
    <div className="about-partners__track">
      {items.map((client, index) => (
        <LogoCard key={`${client.id}-${index}`} client={client} />
      ))}
    </div>
  );
}

export function ClientMarquee({ logos }: ClientMarqueeProps) {
  const visibleLogos = logos.filter((logo) => logo.logoSrc.trim().length > 0);
  if (visibleLogos.length === 0) return null;

  return (
    <section className="about-partners" aria-label="Corporate client logos">
      <header className="about-enterprise__section-header about-partners__header">
        <p className="about-enterprise__eyebrow">Trusted partners</p>
        <h2 className="about-enterprise__section-title">
          Organizations that travel with TRAGUIN
        </h2>
        <p className="about-enterprise__section-description">
          Corporates and institutions across India and abroad who rely on us for curated journeys
          and dependable delivery.
        </p>
      </header>

      <div className="about-partners__grid">
        {visibleLogos.map((client) => (
          <LogoCard key={client.id} client={client} />
        ))}
      </div>

      <div className="about-partners__marquee">
        <div className="about-partners__fade about-partners__fade--left" />
        <div className="about-partners__fade about-partners__fade--right" />
        <MarqueeTrack logos={visibleLogos} />
      </div>
    </section>
  );
}
