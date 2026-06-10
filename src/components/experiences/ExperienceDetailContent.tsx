"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ExperienceDetail } from "@/data/experienceDetails";
import { SafeImage } from "@/components/ui/SafeImage";
import { secondaryCta } from "@/data/site";

type ExperienceDetailContentProps = {
  experience: ExperienceDetail;
};

export function ExperienceDetailContent({ experience }: ExperienceDetailContentProps) {
  return (
    <>
      <section className="grid lg:grid-cols-[2fr_3fr]">
        <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[22rem]">
          <SafeImage
            src={experience.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        </div>

        <div className="flex flex-col justify-center bg-[var(--bento-warm)] px-[clamp(1.75rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)] lg:px-12">
          <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
            {experience.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] font-semibold tracking-tight text-foreground">
            {experience.headline}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {experience.intro}
          </p>
        </div>
      </section>

      <section className="px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(2.5rem,6vw,4rem)]">
        <h2 className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold tracking-tight text-foreground">
          Included for you
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {experience.offers.map((offer) => (
            <div
              key={offer.title}
              className="bento-card bento-card--light rounded-[1.35rem] p-6 md:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-foreground">
                <offer.icon size={20} strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-5 text-sm font-semibold text-foreground">{offer.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{offer.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color-mix(in_srgb,var(--bento-warm)_55%,var(--surface))] px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(2.5rem,6vw,4rem)]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xs font-bold tracking-[0.24em] text-muted uppercase">
              Your path with Traguin
            </h2>
            <ol className="mt-6 space-y-4">
              {experience.process.map((item) => (
                <li
                  key={item.step}
                  className="flex items-center gap-5 border-b border-glass-border pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-gold">{item.step}</span>
                  <span className="text-sm font-semibold text-foreground md:text-base">
                    {item.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[1.75rem] border border-glass-border bg-surface px-7 py-9 md:px-9 md:py-10">
              <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight font-semibold">
                {experience.ctaTitle}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
                {experience.ctaDescription}
              </p>
              <Link
                href={secondaryCta.href}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold tracking-[0.16em] text-on-gold uppercase transition-colors hover:bg-gold-light"
              >
                Request Consultation
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
