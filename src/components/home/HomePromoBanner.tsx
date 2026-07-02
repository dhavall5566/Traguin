"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection } from "@/components/home/HomeSection";
import { contactInfo } from "@/data/contact";
import { primaryCta, secondaryCta } from "@/data/site";
import { iconFromKey } from "@/lib/icons";
import { images } from "@/lib/images";
import type { HomePromoData } from "@/lib/api/homepage";
import { cn } from "@/lib/utils";

function assuranceTitle(
  item: { title?: string; label: string },
  index: number,
  heading?: string
): string | null {
  if (item.title?.trim()) return item.title.trim();
  if (heading) {
    const part = heading.split("|").map((s) => s.trim())[index];
    if (part) return part;
  }
  return null;
}

export function HomePromoBanner({ promo }: { promo: HomePromoData | null }) {
  if (!promo) return null;

  return (
    <HomeSection spacing="compact" tone="muted">
      <div className="home-promo-banner relative overflow-hidden rounded-[1.35rem] border border-gold/20 sm:rounded-[1.85rem]">
        <SafeImage
          src={images.plannerCta}
          alt=""
          className="home-promo-banner__photo absolute inset-0 h-full w-full object-cover opacity-[0.14] saturate-[0.85]"
        />
        <div className="home-promo-banner__veil" aria-hidden />
        <div className="home-promo-banner__lines" aria-hidden />

        <div className="relative flex flex-col gap-6 p-5 sm:gap-8 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,21rem)] lg:items-stretch lg:gap-0 lg:p-0">
          <div className="min-w-0 lg:flex lg:flex-col lg:justify-center lg:p-10 xl:p-12">
            <div className="home-promo-banner__stamp">
              <span className="home-promo-banner__stamp-year">{promo.eyebrow}</span>
              <span className="home-promo-banner__stamp-rule" aria-hidden />
              <span className="home-promo-banner__stamp-studio">{promo.studioLabel}</span>
            </div>

            <h2 className="mt-5 font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-foreground">
              {promo.title}
              {promo.titleAccent ? (
                <>
                  <br />
                  <span className="text-gold">{promo.titleAccent}</span>
                </>
              ) : null}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base sm:leading-7">
              {promo.description}
            </p>

            {promo.assurances.length > 0 && (
              <>
                {promo.assurancesHeading ? (
                  <p className="home-promo-banner__assurances-heading mt-7 sm:mt-8">
                    {promo.assurancesHeading}
                  </p>
                ) : null}
                <ul
                  className={cn(
                    "home-promo-banner__assurances",
                    promo.assurancesHeading ? "mt-3 sm:mt-4" : "mt-7 sm:mt-8"
                  )}
                >
                  {promo.assurances.map((item, index) => {
                    const Icon = iconFromKey(item.iconKey);
                    const title = assuranceTitle(item, index, promo.assurancesHeading);
                    return (
                      <li key={item.label} className="home-promo-banner__assurance">
                        <span className="home-promo-banner__assurance-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="home-promo-banner__assurance-head">
                          <span className="home-promo-banner__assurance-icon" aria-hidden>
                            <Icon size={18} strokeWidth={2.25} />
                          </span>
                          {title ? (
                            <span className="home-promo-banner__assurance-title">{title}</span>
                          ) : null}
                        </div>
                        <span className="home-promo-banner__assurance-label">{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            <p className="mt-6 hidden text-[0.68rem] tracking-[0.18em] text-muted uppercase lg:block">
              {contactInfo.hours}
            </p>
          </div>

          <aside className="home-promo-banner__panel flex w-full flex-col justify-between p-4 sm:p-5 lg:border-l lg:border-gold/15 lg:p-6 xl:p-8">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.65rem] font-bold tracking-[0.22em] text-gold uppercase sm:text-xs">
                  Next step
                </p>
                <span className="rounded-full border border-gold/30 bg-gold/[0.1] px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-gold uppercase">
                  {promo.consultation.badge}
                </span>
              </div>

              <p className="mt-4 font-display text-[clamp(1.5rem,4.5vw,2rem)] leading-tight text-foreground">
                {promo.consultation.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {promo.consultation.description}
              </p>

              <ol className="home-promo-banner__steps mt-5">
                {promo.consultationSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:gap-3">
              <MagneticButton
                as="a"
                href={primaryCta.href}
                variant="primary"
                className="w-full !justify-center"
              >
                {primaryCta.label}
                <ArrowUpRight size={14} />
              </MagneticButton>
              <MagneticButton
                as="a"
                href={secondaryCta.href}
                variant="secondary"
                className="w-full !justify-center"
              >
                {secondaryCta.label}
              </MagneticButton>
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 py-2 text-[0.65rem] tracking-[0.16em] text-gold uppercase transition-colors hover:text-foreground sm:text-xs sm:tracking-[0.18em]"
              >
                Browse Destinations
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </HomeSection>
  );
}
