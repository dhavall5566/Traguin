import Link from "next/link";
import type { LegalPageContent } from "@/data/legal";
import { contactInfo } from "@/data/contact";
import { cn } from "@/lib/utils";

type LegalDocumentBodyProps = {
  content: LegalPageContent;
  showFooter?: boolean;
  className?: string;
};

export function LegalDocumentBody({
  content,
  showFooter = true,
  className,
}: LegalDocumentBodyProps) {
  return (
    <div className={cn("legal-page", className)}>
      {content.description ? (
        <p className="text-sm leading-relaxed text-muted sm:text-base">{content.description}</p>
      ) : null}

      <p className="mt-4 text-xs tracking-[0.22em] text-muted uppercase">
        Effective {content.effectiveDate}
      </p>

      <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
        {content.sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2 className="font-display text-lg text-foreground sm:text-xl md:text-2xl">
              {section.title}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-relaxed text-foreground/78 sm:mt-4 sm:text-[0.9375rem]"
              >
                {paragraph}
              </p>
            ))}
            {section.list && section.list.length > 0 ? (
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 text-sm leading-relaxed text-foreground/78 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold sm:text-[0.9375rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {showFooter ? (
        <div className="legal-page__footer mt-10 rounded-2xl border border-glass-border bg-surface/60 p-5 sm:mt-12 sm:p-6 md:p-8">
          <p className="text-sm leading-relaxed text-foreground/78">
            Questions about this document? Contact us at{" "}
            <a href={contactInfo.emailHref} className="text-gold hover:underline">
              {contactInfo.email}
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Contact page
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
