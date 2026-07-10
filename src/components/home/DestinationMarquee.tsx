"use client";

function MarqueeTrack({ names }: { names: string[] }) {
  const items = [...names, ...names];

  return (
    <div className="destination-marquee-track">
      {items.map((name, i) => (
        <span key={`${name}-${i}`} className="destination-marquee-item">
          <span className="destination-marquee-item__label">{name}</span>
          <span className="destination-marquee-item__dot" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export function DestinationMarquee({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  return (
    <section aria-hidden className="destination-marquee">
      <div className="destination-marquee__fade destination-marquee__fade--left" />
      <div className="destination-marquee__fade destination-marquee__fade--right" />
      <MarqueeTrack names={names} />
    </section>
  );
}
