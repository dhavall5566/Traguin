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
      { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
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
    <section className="about-enterprise__section about-catalog" aria-label="Company profile">
      <header className="about-catalog__intro about-enterprise__section-header">
        <p className="about-enterprise__eyebrow">Company profile</p>
        <h2 className="about-enterprise__section-title">Built for discerning travel</h2>
        <p className="about-enterprise__section-description">
          Our story, capabilities, and operating model — structured for corporates, partners, and
          travelers who expect clarity from the first conversation to the final farewell.
        </p>
      </header>

      <div className="about-catalog__shell">
        <aside className="about-catalog__nav-panel" aria-label="Story sections">
          <p className="about-catalog__nav-label">Contents</p>
          <nav className="about-catalog__nav">
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
                  <span className="about-catalog__nav-text">{section.title}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <div className="about-catalog__document">
          {sections.map((section, index) => {
            const paragraphs = section.body.split(/\n\n+/).filter(Boolean);
            const founder = isFounderSection(section.title);
            const promise = isPromiseSection(section.title);

            return (
              <article
                key={section.id}
                id={section.id}
                ref={(node) => registerSection(section.id, node)}
                className="about-catalog__chapter"
              >
                <header className="about-catalog__chapter-head">
                  <span className="about-catalog__chapter-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="about-catalog__chapter-heading">
                    <h3 className="about-catalog__chapter-title">{section.title}</h3>
                    <p className="about-catalog__chapter-rule" aria-hidden />
                  </div>
                </header>

                <div
                  className={cn(
                    "about-catalog__chapter-body",
                    founder && "about-catalog__chapter-body--founder",
                    promise && "about-catalog__chapter-body--promise"
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
