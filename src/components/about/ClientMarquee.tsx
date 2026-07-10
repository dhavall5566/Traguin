"use client";

import Image from "next/image";
import type { AboutClientLogo } from "@/lib/api/about";

type ClientMarqueeProps = {
  logos: AboutClientLogo[];
};

function MarqueeTrack({ logos }: { logos: AboutClientLogo[] }) {
  const items = [...logos, ...logos];

  return (
    <div className="about-partners__track flex w-max items-center gap-3 sm:gap-4">
      {items.map((client, index) => (
        <div
          key={`${client.id}-${index}`}
          className="about-partners__logo-card flex h-[4.75rem] w-[10.5rem] shrink-0 items-center justify-center rounded-xl border px-4 py-3 sm:h-[5rem] sm:w-[11rem]"
        >
          <Image
            src={client.logoSrc}
            alt={`${client.name} logo`}
            width={180}
            height={64}
            className="block max-h-[2.75rem] w-auto max-w-full object-contain sm:max-h-[3rem]"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export function ClientMarquee({ logos }: ClientMarqueeProps) {
  const visibleLogos = logos.filter((logo) => logo.logoSrc.trim().length > 0);
  if (visibleLogos.length === 0) return null;

  return (
    <section className="about-partners" aria-label="Corporate client logos">
      <div className="about-partners__header">
        <p className="about-partners__eyebrow">Trusted partners</p>
        <h2 className="about-partners__title">Organizations that travel with TRAGUIN</h2>
        <p className="about-partners__description">
          Corporates and institutions across India and abroad who rely on us for curated journeys and
          dependable delivery.
        </p>
      </div>

      <div className="about-partners__marquee">
        <div className="about-partners__fade about-partners__fade--left" aria-hidden />
        <div className="about-partners__fade about-partners__fade--right" aria-hidden />
        <MarqueeTrack logos={visibleLogos} />
      </div>
    </section>
  );
}
