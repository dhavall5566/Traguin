"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domesticStates, internationalCountries } from "@/data/destinations";
import { domesticSplitImages, internationalSplitImages } from "@/lib/images";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function DomesticInternationalSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<"domestic" | "international" | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".split-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="section-padding pb-16 text-center">
        <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Choose Your Journey</p>
        <h2 className="split-title font-display text-4xl text-foreground md:text-6xl">
          Where Will Your Next Story Begin?
        </h2>
      </div>

      <div className="relative flex min-h-[70vh] flex-col md:flex-row">
        <SplitPanel
          region="domestic"
          title="India"
          subtitle="Domestic"
          packageCount="48 curated packages"
          tags={domesticStates}
          images={domesticSplitImages}
          hovered={hovered}
          mousePos={mousePos}
          onHover={setHovered}
          accentClass="bg-ocean/10"
        />

        <SplitPanel
          region="international"
          title="World"
          subtitle="International"
          packageCount="72 curated packages"
          tags={internationalCountries}
          images={internationalSplitImages}
          hovered={hovered}
          mousePos={mousePos}
          onHover={setHovered}
          accentClass="bg-gold/10"
        />
      </div>
    </section>
  );
}

function SplitPanel({
  region,
  title,
  subtitle,
  packageCount,
  tags,
  images,
  hovered,
  mousePos,
  onHover,
  accentClass,
}: {
  region: "domestic" | "international";
  title: string;
  subtitle: string;
  packageCount: string;
  tags: string[];
  images: { label: string; subtitle: string; src: string }[];
  hovered: "domestic" | "international" | null;
  mousePos: { x: number; y: number };
  onHover: (v: "domestic" | "international" | null) => void;
  accentClass: string;
}) {
  const other = region === "domestic" ? "international" : "domestic";
  const isHovered = hovered === region;

  return (
    <div
      className={cn(
        "group relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[70vh]",
        hovered === other ? "md:w-[35%]" : isHovered ? "md:w-[65%]" : "md:w-1/2",
        "h-[50vh] w-full"
      )}
      onMouseEnter={() => onHover(region)}
      onMouseLeave={() => onHover(null)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePos.x * 0.05}deg) rotateX(${-mousePos.y * 0.05}deg)`
          : undefined,
      }}
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {images.map((item) => (
          <div key={item.label} className="relative overflow-hidden">
            <SafeImage
              src={item.src}
              alt={`${item.label} — ${item.subtitle}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="font-display text-sm text-foreground md:text-base">{item.label}</p>
              <p className="text-[10px] text-sand md:text-xs">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", accentClass)} />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <span className="text-xs tracking-[0.3em] text-gold uppercase">{subtitle}</span>
        <h3 className="mt-2 font-display text-5xl text-foreground md:text-7xl">{title}</h3>
        <p className="mt-2 text-sm text-muted md:hidden">{packageCount}</p>
        <div className="mt-4 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-44 md:group-hover:max-h-40">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="glass rounded-full px-3 py-1 text-xs text-foreground">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 hidden text-sm text-muted md:block">{packageCount}</p>
        </div>
        <MagneticButton
          as="a"
          href={`/packages/${region}`}
          variant="primary"
          className="relative z-10 mt-6 w-fit !px-6 !py-3"
        >
          Explore {subtitle}
        </MagneticButton>
      </div>
    </div>
  );
}
