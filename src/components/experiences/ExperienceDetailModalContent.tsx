"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ExperienceDetail } from "@/lib/experience-types";
import { iconFromKey } from "@/lib/icons";
import { SafeImage } from "@/components/ui/SafeImage";
import { secondaryCta } from "@/data/site";

type ExperienceDetailModalContentProps = {
  experience: ExperienceDetail;
};

export function ExperienceDetailModalContent({ experience }: ExperienceDetailModalContentProps) {
  return (
    <div className="experience-modal grid h-full min-h-0 grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="relative min-h-[14rem] shrink-0 md:min-h-0">
        <SafeImage
          src={experience.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/35 md:via-transparent md:to-transparent"
          aria-hidden
        />
        {experience.quote && (
        <div className="absolute inset-x-0 bottom-0 hidden p-6 md:block lg:p-8">
          <blockquote className="max-w-sm border-l-2 border-gold/80 pl-4 text-sm leading-relaxed text-white/90 italic">
            &ldquo;{experience.quote}&rdquo;
          </blockquote>
        </div>
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <header className="shrink-0 pr-10 md:pr-12">
            <p className="text-[11px] font-bold tracking-[0.3em] text-gold uppercase">
              {experience.eyebrow}
            </p>
            <h2
              id="experience-detail-title"
              className="mt-3 font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1] font-semibold tracking-tight text-foreground"
            >
              {experience.headline}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
              {experience.intro}
            </p>
          </header>

          {experience.stats.length > 0 && (
          <dl className="experience-modal-stats mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:mt-7 sm:gap-4">
            {experience.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-glass-border bg-[color-mix(in_srgb,var(--bento-warm)_40%,var(--surface))] px-3 py-3 text-center sm:rounded-2xl sm:px-4 sm:py-4"
              >
                <dt className="font-display text-[clamp(1.1rem,2.2vw,1.65rem)] font-semibold tracking-tight text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[10px] leading-snug font-medium tracking-wide text-muted uppercase sm:text-[11px]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
          )}

          {experience.offers.length > 0 && (
          <div className="mt-7 sm:mt-8">
            <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
              What&apos;s included
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {experience.offers.map((offer) => {
                const OfferIcon = iconFromKey(offer.iconKey);
                return (
                <li
                  key={offer.title}
                  className="flex min-h-0 flex-col rounded-2xl border border-glass-border bg-[color-mix(in_srgb,var(--bento-warm)_50%,var(--surface))] p-4 lg:p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                    <OfferIcon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{offer.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-[13px]">
                    {offer.description}
                  </p>
                </li>
                );
              })}
            </ul>
          </div>
          )}

          {experience.process.length > 0 && (
          <div className="experience-modal-mid mt-7 sm:mt-8">
            <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
              How we work
            </p>
            <ol className="experience-modal-process mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {experience.process.map((item, index) => (
                <li
                  key={item.step}
                  className="experience-modal-process-step relative flex flex-col rounded-2xl border border-glass-border bg-surface px-4 py-4 sm:px-5 sm:py-5"
                  data-step={index + 1}
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-gold sm:text-xs">
                    {item.step}
                  </span>
                  <span className="mt-2 text-sm font-semibold text-foreground">{item.title}</span>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          )}

          {experience.quote && (
          <blockquote className="mt-7 rounded-2xl border border-gold/20 bg-[color-mix(in_srgb,var(--gold)_6%,var(--surface))] px-5 py-4 md:hidden">
            <p className="text-sm leading-relaxed text-muted italic">
              &ldquo;{experience.quote}&rdquo;
            </p>
          </blockquote>
          )}
        </div>

        <footer className="shrink-0 border-t border-glass-border bg-[color-mix(in_srgb,var(--bento-warm)_35%,var(--surface))] px-6 py-5 sm:px-8 sm:py-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-foreground lg:text-xl">
                {experience.ctaTitle}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                {experience.ctaDescription}
              </p>
            </div>
            <Link
              href={secondaryCta.href}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-[11px] font-bold tracking-[0.14em] text-on-gold uppercase transition-colors hover:bg-gold-light sm:px-8"
            >
              Request Consultation
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
