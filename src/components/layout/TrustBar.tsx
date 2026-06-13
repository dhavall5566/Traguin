import { trustHighlights } from "@/data/pageContent";

export function TrustBar() {
  return (
    <section aria-label="TRAGUIN credentials" className="trust-bar border-y border-glass-border">
      <div className="home-shell">
        <div className="site-container grid grid-cols-2 divide-x divide-glass-border md:grid-cols-4">
          {trustHighlights.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 px-4 py-5 text-center sm:px-6">
              <p className="font-display text-xl leading-none tracking-tight text-foreground sm:text-2xl">
                {item.value}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase sm:text-[11px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
