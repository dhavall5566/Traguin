import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqSection } from "@/components/ui/FaqSection";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { aboutFaq } from "@/data/faq";
import { pageHeroes } from "@/data/pageContent";

const sections = [
  {
    title: "Our Story",
    body: "Founded in Ahmedabad, TRAGUIN began with a simple belief: luxury travel should feel personal, not transactional. What started as bespoke domestic journeys has grown into a global travel expert practice trusted by families, executives, and celebrants alike.",
  },
  {
    title: "Since 2024",
    body: "We refined our craft from day one, pairing discerning travelers with properties, experiences, and specialists that reflect their standards, never a catalogue.",
  },
  {
    title: "Philosophy",
    body: "We design around how you wish to feel. Every itinerary balances beauty, comfort, and authenticity, never overcrowded schedules or generic packages.",
  },
  {
    title: "Team",
    body: "Travel designers, travel expert leads, and on-ground partners operate as one studio. You work with specialists who know your preferences before you need to repeat them.",
  },
  {
    title: "Partnerships",
    body: "Preferred relationships with leading hotel groups, DMCs, and aviation partners give our clients access, upgrades, and experiences rarely available to the public.",
  },
  {
    title: "Expertise",
    body: "From Indian heritage circuits to Alpine retreats and Indian Ocean sanctuaries, regional depth with international polish on every journey we craft.",
  },
] as const;

export function AboutPage() {
  return (
    <>
      <PageHero {...pageHeroes.about} />
      <TrustBar />
      <PageShell noPaddingTop>
        <SectionHeader
          align="left"
          eyebrow="Who We Are"
          title="Crafted for discerning travelers"
          description="Like the world's finest travel houses, we combine deep destination knowledge with white-glove service, so every journey feels effortless and entirely yours."
          titleClassName="text-[clamp(1.75rem,4vw,3rem)]"
          className="mb-10 md:mb-12"
        />

        <div className="page-content-grid md:grid-cols-2">
          {sections.map((s) => (
            <article key={s.title} className="glass rounded-2xl border border-glass-border p-7 md:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-glass-border bg-surface/60 px-4 py-10 sm:px-8 md:mt-20 md:py-12">
          <FaqSection items={aboutFaq} titleClassName="font-semibold" />
        </section>

        <PageCTA />
      </PageShell>
    </>
  );
}
