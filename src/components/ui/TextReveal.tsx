"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = children.split(" ");
    el.innerHTML = words
      .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}</span></span>`)
      .join(" ");

    const spans = el.querySelectorAll("span > span");

    gsap.to(spans, {
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, [children, delay]);

  return (
    <Tag ref={ref as never} className={cn("font-display", className)} suppressHydrationWarning>
      {children}
    </Tag>
  );
}
