import { getSiteTrustHighlights } from "@/lib/site-trust-stats";
import { isHotelContentVisible } from "@/lib/site-features";

export function TrustBar() {
  const highlights = isHotelContentVisible()
    ? getSiteTrustHighlights()
    : getSiteTrustHighlights().filter((item) => item.label !== "Partner properties");

  return (
    <section aria-label="TRAGUIN credentials" className="trust-bar border-y border-glass-border">
      <div className="home-shell">
        <div
          className={`site-container grid ${
            highlights.length === 3
              ? "grid-cols-1 divide-y divide-glass-border sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              : highlights.length >= 4
                ? "grid-cols-2 divide-x divide-glass-border md:grid-cols-4"
                : "grid-cols-2 divide-x divide-glass-border md:grid-cols-3"
          }`}
        >
          {highlights.map((item) => (
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
