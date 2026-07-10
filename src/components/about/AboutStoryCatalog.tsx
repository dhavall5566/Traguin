"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AboutStorySection } from "@/lib/api/about";
import { cn } from "@/lib/utils";

type AboutStoryCatalogProps = {
  sections: AboutStorySection[];
};

function isFounderSection(title: string): boolean {
  return title.toLowerCase().includes("founder");
}

function isPromiseSection(title: string): boolean {
  return title.toLowerCase().includes("promise");
}

export function AboutStoryCatalog({ sections }: AboutStoryCatalogProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback((id: string, node: HTMLElement | null) => {
    if (node) sectionRefs.current.set(id, node);
    else sectionRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const section of sections) {
      const node = sectionRefs.current.get(section.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const node = sectionRefs.current.get(id);
    if (!node) return;
    setActiveId(id);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (sections.length === 0) {
    return (
      <p className="text-sm text-muted">Our story sections are being updated. Please check back soon.</p>
    );
  }

  return (
    <section className="about-catalog" aria-label="Company profile">
      <div className="about-catalog__header">
        <p className="about-catalog__eyebrow">Company profile</p>
        <h2 className="about-catalog__title">How TRAGUIN is built</h2>
        <p className="about-catalog__description">
          Explore our story, capabilities, and operating model — structured for corporates, partners, and
          discerning travelers who expect clarity at every stage.
        </p>
      </div>

      <div className="about-catalog__layout">
        <nav className="about-catalog__nav" aria-label="Story sections">
          <div className="about-catalog__nav-scroll">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-current={activeId === section.id ? "true" : undefined}
                className={cn(
                  "about-catalog__nav-item",
                  activeId === section.id && "about-catalog__nav-item--active"
                )}
              >
                <span className="about-catalog__nav-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="about-catalog__nav-label">{section.title}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="about-catalog__content">
          {sections.map((section, index) => {
            const paragraphs = section.body.split(/\n\n+/).filter(Boolean);
            const founder = isFounderSection(section.title);
            const promise = isPromiseSection(section.title);

            return (
              <article
                key={section.id}
                id={section.id}
                ref={(node) => registerSection(section.id, node)}
                className="about-catalog__section"
              >
                <div className="about-catalog__section-meta">
                  <span className="about-catalog__section-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="about-catalog__section-title">{section.title}</h3>
                </div>

                <div
                  className={cn(
                    "about-catalog__section-body",
                    founder && "about-catalog__section-body--founder",
                    promise && "about-catalog__section-body--promise"
                  )}
                >
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
