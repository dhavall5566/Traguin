"use client";

function MarqueeTrack({ names }: { names: string[] }) {
  const items = [...names, ...names];

  return (
    <div className="destination-marquee-track flex w-max items-center gap-4 sm:gap-8 md:gap-12">
      {items.map((name, i) => (
        <span key={`${name}-${i}`} className="inline-flex shrink-0 items-center gap-4 sm:gap-8 md:gap-12">
          <span className="whitespace-nowrap font-display text-[clamp(0.72rem,2.4vw,1.75rem)] tracking-[0.08em] text-foreground/75 uppercase sm:tracking-[0.12em]">
            {name}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-gold/60 sm:h-1.5 sm:w-1.5" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export function DestinationMarquee({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-b border-glass-border py-[clamp(1.25rem,3vw,1.75rem)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <MarqueeTrack names={names} />
    </section>
  );
}
