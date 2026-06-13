import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pageCta } from "@/data/pageContent";

export function PageCTA() {
  const { eyebrow, title, description, primary, secondary } = pageCta.default;

  return (
    <section className="page-cta mt-16 md:mt-20">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/20 px-6 py-10 sm:px-10 sm:py-12 md:px-14">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.28em] text-gold uppercase">{eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight text-foreground">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <MagneticButton as="a" href={primary.href} variant="primary" className="!text-xs">
              {primary.label}
              <ArrowUpRight size={14} />
            </MagneticButton>
            <MagneticButton as="a" href={secondary.href} variant="secondary" className="!text-xs">
              {secondary.label}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
