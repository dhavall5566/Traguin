import { FaqItem } from "@/components/ui/FaqItem";
import type { FaqEntry } from "@/data/faq";

type AboutFaqPanelProps = {
  items: FaqEntry[];
};

export function AboutFaqPanel({ items }: AboutFaqPanelProps) {
  if (items.length === 0) return null;

  return (
    <section className="about-enterprise__section about-faq" aria-labelledby="about-faq-heading">
      <div className="about-faq__layout">
        <header className="about-enterprise__section-header about-faq__header">
          <p className="about-enterprise__eyebrow">FAQ</p>
          <h2 id="about-faq-heading" className="about-enterprise__section-title">
            TRAGUIN — Frequently Asked Questions
          </h2>
          <p className="about-faq__meta">
            {items.length} {items.length === 1 ? "topic" : "topics"}
          </p>
        </header>

        <div className="about-faq__card">
          {items.map((item, index) => (
            <FaqItem
              key={item.question}
              variant="embedded"
              index={index}
              question={item.question}
              answer={item.answer}
              className={index < items.length - 1 ? "about-faq__item--divider" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
