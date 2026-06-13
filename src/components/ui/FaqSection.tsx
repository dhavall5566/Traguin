import { FaqItem } from "@/components/ui/FaqItem";
import type { FaqEntry } from "@/data/faq";
import { cn } from "@/lib/utils";

type FaqSectionProps = {
  items: FaqEntry[];
  className?: string;
  titleClassName?: string;
};

export function FaqSection({ items, className, titleClassName }: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("mx-auto max-w-3xl", className)}>
      <h2
        className={cn(
          "text-center font-display text-3xl text-foreground md:text-4xl",
          titleClassName
        )}
      >
        FAQ
      </h2>
      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}
