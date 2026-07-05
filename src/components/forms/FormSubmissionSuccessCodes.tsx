import { cn } from "@/lib/utils";

type FormSubmissionSuccessCodesProps = {
  leadCode?: string | null;
  inquiryCode?: string | null;
  className?: string;
  variant?: "default" | "light";
};

export function FormSubmissionSuccessCodes({
  leadCode,
  inquiryCode,
  className,
  variant = "default",
}: FormSubmissionSuccessCodesProps) {
  if (!leadCode && !inquiryCode) return null;

  const valueClass =
    variant === "light"
      ? "font-mono text-base text-white"
      : "font-mono text-base text-foreground";

  return (
    <dl
      className={cn(
        "form-submission-success__codes mt-6 text-left",
        variant === "light" && "form-submission-success__codes--light",
        className,
      )}
    >
      {leadCode ? (
        <div>
          <dt>Customer ID</dt>
          <dd className={valueClass}>{leadCode}</dd>
        </div>
      ) : null}
      {inquiryCode ? (
        <div>
          <dt>Inquiry ID</dt>
          <dd className={valueClass}>{inquiryCode}</dd>
        </div>
      ) : null}
    </dl>
  );
}

/** Compact inline variant for tight success panels. */
export function FormSubmissionReferences({
  leadCode,
  inquiryCode,
  className,
  variant = "default",
}: FormSubmissionSuccessCodesProps) {
  return (
    <FormSubmissionSuccessCodes
      leadCode={leadCode}
      inquiryCode={inquiryCode}
      className={className}
      variant={variant}
    />
  );
}

/** @deprecated Use FormSubmissionSuccessCodes */
export function FormInquiryReference({
  inquiryCode,
  className,
  variant = "default",
}: {
  inquiryCode: string;
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <FormSubmissionSuccessCodes
      inquiryCode={inquiryCode}
      className={className}
      variant={variant}
    />
  );
}
