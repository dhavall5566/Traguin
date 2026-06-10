import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqSection } from "@/components/ui/FaqSection";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { aboutFaq } from "@/data/faq";
import { primaryCta, secondaryCta } from "@/data/site";

const sections = [
  {
    title: "Our Story",
    body: "Founded in Ahmedabad, TRAGUIN began with simple belief: luxury travel should feel personal, not transactional. What started as bespoke domestic journeys has grown into a global travel expert practice trusted by families, executives, and celebrants alike.",
  },
  {
    title: "Since 2024",
    body: "We have refined our craft from day one — pairing discerning travelers with properties, experiences, and specialists that reflect their standards, not a brochure.",
  },
  {
    title: "Philosophy",
    body: "We design around how you wish to feel. Every itinerary balances beauty, comfort, and authenticity — never overcrowded schedules or generic packages.",
  },
  {
    title: "Team",
    body: "Our travel designers, travel expert leads, and on-ground partners operate as one studio. You work with specialists who know your preferences before you need to repeat them.",
  },
  {
    title: "Partnerships",
    body: "Preferred relationships with leading hotel groups, DMCs, and aviation partners give our clients access, upgrades, and experiences rarely available to the public.",
  },
  {
    title: "Expertise",
    body: "From Indian heritage circuits to Alpine retreats and Indian Ocean sanctuaries — we bring regional depth with international polish.",
  },
];

export function AboutPage() {
  return (
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SectionHeader
              align="left"
              eyebrow="TRAGUIN"
              title="About Us"
              description="A luxury travel expert studio devoted to extraordinary journeys."
              titleClassName="font-semibold"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {sections.map((s) => (
              <article key={s.title} className="glass rounded-2xl border border-glass-border p-8">
                <h2 className="font-display text-2xl font-semibold text-foreground">{s.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
              </article>
            ))}
          </div>

          <section className="mt-16 rounded-3xl border border-glass-border bg-surface/60 px-4 py-10 sm:px-8 md:mt-20 md:py-12">
            <FaqSection items={aboutFaq} titleClassName="font-semibold" />
          </section>
        </div>
      </div>
    </div>
  );
}
