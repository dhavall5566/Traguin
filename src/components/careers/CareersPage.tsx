"use client";

import { Briefcase, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { contactInfo } from "@/data/contact";
import { pageHeroes } from "@/data/pageContent";
import type { CareersPageData } from "@/lib/api/careers";

const CULTURE_ICONS: LucideIcon[] = [Briefcase, Users, MapPin];

type CareersPageProps = {
  data: CareersPageData;
};

export function CareersPage({ data }: CareersPageProps) {
  return (
    <>
      <PageHero {...pageHeroes.careers} />
      <TrustBar />
      <PageShell noPaddingTop>
        {data.cultureChips.length > 0 && (
          <div className="page-content-grid sm:grid-cols-3">
            {data.cultureChips.map((chip, index) => {
              const Icon = CULTURE_ICONS[index % CULTURE_ICONS.length];
              return (
                <div
                  key={`${chip.label}-${index}`}
                  className="glass flex items-center gap-3 rounded-2xl border border-glass-border px-5 py-4"
                >
                  <Icon size={18} className="shrink-0 text-gold" aria-hidden />
                  <p className="text-sm text-foreground">{chip.label}</p>
                </div>
              );
            })}
          </div>
        )}

        <div id="open-roles" className="mt-12 scroll-mt-28 space-y-5">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Open positions</h2>
          {data.openings.length > 0 ? (
            data.openings.map((role) => (
              <article
                key={role.id}
                className="glass rounded-2xl border border-glass-border p-6 md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-foreground">{role.title}</h3>
                    <p className="mt-1 text-sm text-gold">
                      {role.location} · {role.employmentType}
                    </p>
                  </div>
                  <MagneticButton
                    as="a"
                    href={`${contactInfo.inquiryEmailHref}?subject=Career%20Application%20, %20${encodeURIComponent(role.title)}`}
                    variant="secondary"
                    className="!text-xs"
                  >
                    Apply Now
                  </MagneticButton>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{role.description}</p>
              </article>
            ))
          ) : (
            <p className="glass rounded-2xl border border-glass-border p-6 text-sm leading-relaxed text-muted md:p-8">
              No open positions are posted right now. We&apos;re always interested in meeting exceptional
              travel professionals — use the form below to introduce yourself.
            </p>
          )}
        </div>

        <section className="mt-16 glass rounded-3xl border border-glass-border p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">{data.fallback.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">{data.fallback.description}</p>
          <MagneticButton
            as="a"
            href={`${contactInfo.inquiryEmailHref}?subject=General%20Career%20Inquiry`}
            variant="primary"
            className="mt-6"
          >
            Email {contactInfo.inquiryEmail}
          </MagneticButton>
        </section>

        <PageCTA />
      </PageShell>
    </>
  );
}
