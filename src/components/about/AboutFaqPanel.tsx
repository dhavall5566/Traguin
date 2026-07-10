import { FaqItem } from "@/components/ui/FaqItem";
import type { FaqEntry } from "@/data/faq";

type AboutFaqPanelProps = {
  items: FaqEntry[];
};

export function AboutFaqPanel({ items }: AboutFaqPanelProps) {
  if (items.length === 0) return null;

  return (
    <section className="about-faq" aria-labelledby="about-faq-heading">
      <div className="about-faq__header">
        <p className="about-faq__eyebrow">Support</p>
        <h2 id="about-faq-heading" className="about-faq__title">
          Frequently asked questions
        </h2>
        <p className="about-faq__description">
          Practical answers for travelers and corporate teams evaluating TRAGUIN as a planning partner.
        </p>
      </div>

      <div className="about-faq__panel">
        {items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
