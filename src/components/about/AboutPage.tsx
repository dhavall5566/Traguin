import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { primaryCta, secondaryCta } from "@/data/site";
import { images } from "@/lib/images";
import { SafeImage } from "@/components/ui/SafeImage";

const sections = [
  {
    title: "Our Story",
    body: "Founded in Ahmedabad, TRAGUIN began with simple belief: luxury travel should feel personal, not transactional. What started as bespoke domestic journeys has grown into a global concierge practice trusted by families, executives, and celebrants alike.",
  },
  {
    title: "Since 2008",
    body: "For nearly two decades we have refined our craft — pairing discerning travelers with properties, experiences, and specialists that reflect their standards, not a brochure.",
  },
  {
    title: "Philosophy",
    body: "We design around how you wish to feel. Every itinerary balances beauty, comfort, and authenticity — never overcrowded schedules or generic packages.",
  },
  {
    title: "Team",
    body: "Our travel designers, concierge leads, and on-ground partners operate as one studio. You work with specialists who know your preferences before you need to repeat them.",
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
    <div className="min-h-screen pt-24 pb-20 md:pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SectionHeader
              align="left"
              eyebrow="TRAGUIN"
              title="About Us"
              description="A luxury travel concierge studio devoted to extraordinary journeys."
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <SafeImage src={images.luxury} alt="Luxury travel" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {sections.map((s) => (
              <article key={s.title} className="glass rounded-2xl border border-glass-border p-8">
                <h2 className="font-display text-2xl text-foreground">{s.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
