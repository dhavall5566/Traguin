"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyHomeSectionProps = {
  children: ReactNode;
};

export function LazyHomeSection({ children }: LazyHomeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-px">
      {visible ? children : null}
    </div>
  );
}
