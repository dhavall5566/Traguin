"use client";

import { Briefcase, MapPin, Users } from "lucide-react";
<<<<<<< HEAD
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { contactInfo } from "@/data/contact";
=======
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { contactInfo } from "@/data/contact";
import { pageHeroes } from "@/data/pageContent";
>>>>>>> dhaval

const openings = [
  {
    title: "Luxury Travel Designer",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    description:
<<<<<<< HEAD
      "Craft bespoke itineraries for discerning travelers — from Himalayan retreats to global luxury escapes.",
=======
      "Craft bespoke itineraries for discerning travelers, from Himalayan retreats to global luxury escapes. You will own the guest relationship from discovery through homecoming.",
>>>>>>> dhaval
  },
  {
    title: "Corporate & MICE Specialist",
    location: "Ahmedabad · On-site",
    type: "Full-time",
    description:
<<<<<<< HEAD
      "Lead corporate retreats, incentive travel, and meetings programs with white-glove coordination.",
  },
  {
    title: "Travel Expert — Client Relations",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    description:
      "Be the dedicated point of contact for VIP clients before, during, and after every journey.",
=======
      "Lead executive retreats, incentive travel, and meetings programs with white-glove coordination and flawless on-ground execution.",
  },
  {
    title: "Travel Expert, Client Relations",
    location: "Ahmedabad · Hybrid",
    type: "Full-time",
    description:
      "Serve as the dedicated point of contact for VIP clients before, during, and after every journey, anticipatory, discreet, and always available.",
>>>>>>> dhaval
  },
] as const;

export function CareersPage() {
  return (
<<<<<<< HEAD
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="left"
            eyebrow="Join TRAGUIN"
            title="Careers"
            description="Help us redefine luxury travel with craftsmanship, empathy, and impeccable service."
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Briefcase, label: "Bespoke travel studio" },
              { icon: Users, label: "Collaborative team" },
              { icon: MapPin, label: "Ahmedabad headquarters" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass flex items-center gap-3 rounded-2xl border border-glass-border px-5 py-4"
              >
                <item.icon size={18} className="shrink-0 text-gold" aria-hidden />
                <p className="text-sm text-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-5">
            {openings.map((role) => (
              <article
                key={role.title}
                className="glass rounded-2xl border border-glass-border p-6 md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-foreground">{role.title}</h2>
                    <p className="mt-1 text-sm text-gold">
                      {role.location} · {role.type}
                    </p>
                  </div>
                  <MagneticButton
                    as="a"
                    href={`${contactInfo.inquiryEmailHref}?subject=Career%20Application%20—%20${encodeURIComponent(role.title)}`}
                    variant="secondary"
                    className="!text-xs"
                  >
                    Apply Now
                  </MagneticButton>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{role.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-16 glass rounded-3xl border border-glass-border p-8 text-center md:p-12">
            <h2 className="font-display text-2xl text-foreground md:text-3xl">Don&apos;t see your role?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
              Send your résumé and a short note on what you&apos;d bring to TRAGUIN. We review every application.
            </p>
            <MagneticButton
              as="a"
              href={`${contactInfo.inquiryEmailHref}?subject=General%20Career%20Inquiry`}
              variant="primary"
              className="mt-6"
            >
              Email {contactInfo.inquiryEmail}
            </MagneticButton>
          </section>
        </div>
      </div>
    </div>
=======
    <>
      <PageHero {...pageHeroes.careers} />
      <TrustBar />
      <PageShell noPaddingTop>
        <div className="page-content-grid sm:grid-cols-3">
          {[
            { icon: Briefcase, label: "Bespoke travel studio" },
            { icon: Users, label: "Collaborative expert team" },
            { icon: MapPin, label: "Ahmedabad headquarters" },
          ].map((item) => (
            <div
              key={item.label}
              className="glass flex items-center gap-3 rounded-2xl border border-glass-border px-5 py-4"
            >
              <item.icon size={18} className="shrink-0 text-gold" aria-hidden />
              <p className="text-sm text-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div id="open-roles" className="mt-12 scroll-mt-28 space-y-5">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Open positions</h2>
          {openings.map((role) => (
            <article
              key={role.title}
              className="glass rounded-2xl border border-glass-border p-6 md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-foreground">{role.title}</h3>
                  <p className="mt-1 text-sm text-gold">
                    {role.location} · {role.type}
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
          ))}
        </div>

        <section className="mt-16 glass rounded-3xl border border-glass-border p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Don&apos;t see your role?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            Send your résumé and a short note on what you would bring to TRAGUIN. We review every application personally.
          </p>
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
>>>>>>> dhaval
  );
}
