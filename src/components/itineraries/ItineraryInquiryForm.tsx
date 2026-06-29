"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validateInquiryForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { itineraryPrimaryCta } from "@/data/site";
import { formatDateRangeForPayload, getLocalDateIso } from "@/lib/date-input";
import { defaultCountryCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";
import { cn } from "@/lib/utils";

type ItineraryInquiryFormProps = {
  itineraryTitle: string;
  itinerarySlug: string;
  relatedItineraryId?: string;
};

export function ItineraryInquiryForm({
  itineraryTitle,
  itinerarySlug,
  relatedItineraryId,
}: ItineraryInquiryFormProps) {
  const [minDate, setMinDate] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    startDate: "",
    endDate: "",
    message: `I'm interested in the ${itineraryTitle} itinerary.`,
  });

  useEffect(() => {
    setMinDate(getLocalDateIso());
  }, []);
  const [legalConsent, setLegalConsent] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = withLegalConsent(validateInquiryForm(form, minDate), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    const fullPhone = formatFullPhone(phoneCountryCode, form.phone);
    try {
      await submitFormSubmission({
        form_type: "itinerary_inquiry",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: fullPhone,
        related_itinerary_id: relatedItineraryId ?? null,
        payload: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          travelers: Number(form.travelers),
          dates: formatDateRangeForPayload(form.startDate, form.endDate),
          message: form.message.trim(),
          itinerary_slug: itinerarySlug,
          itinerary_title: itineraryTitle,
        },
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof FormSubmissionError
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="inquiry"
      method="post"
      action="#inquiry"
      className="itinerary-inquiry-form scroll-mt-28 rounded-[1.75rem] border border-glass-border p-6 md:p-8 lg:p-10"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="itinerary" value={itinerarySlug} />
      <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] text-foreground">Request this itinerary</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/72">
        Share your details and our travel expert will prepare a custom quote for{" "}
        <span className="text-foreground">{itineraryTitle}</span>.
      </p>

      {submitted ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center py-8 text-center">
          <Send size={40} className="text-gold" />
          <h3 className="mt-4 font-display text-xl">Inquiry Received</h3>
          <p className="mt-2 text-sm text-muted">We&apos;ll respond within one business day.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {hasErrors(errors) && (
            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
              Please correct the highlighted fields before submitting.
            </p>
          )}
          {submitError && (
            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
              {submitError}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="inquiry-name" error={errors.name}>
              <input
                id="inquiry-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={fieldInputClass("name", errors)}
                aria-invalid={!!errors.name}
              />
            </FormField>
            <FormField label="Email" htmlFor="inquiry-email" error={errors.email}>
              <input
                id="inquiry-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={fieldInputClass("email", errors)}
                aria-invalid={!!errors.email}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Phone" htmlFor="inquiry-phone" error={errors.phone}>
              <PhoneInput
                id="inquiry-phone"
                countryCode={phoneCountryCode}
                onCountryCodeChange={setPhoneCountryCode}
                value={form.phone}
                onChange={(value) => update("phone", value)}
                invalid={!!errors.phone}
              />
            </FormField>
            <FormField label="Number of Travelers" htmlFor="inquiry-travelers" error={errors.travelers}>
              <input
                id="inquiry-travelers"
                type="number"
                min={1}
                max={50}
                value={form.travelers}
                onChange={(e) => update("travelers", e.target.value)}
                className={fieldInputClass("travelers", errors)}
                aria-invalid={!!errors.travelers}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Start Date" htmlFor="inquiry-start-date" error={errors.startDate}>
              <DatePickerInput
                id="inquiry-start-date"
                min={minDate || undefined}
                value={form.startDate}
                suppressHydrationWarning
                onChange={(e) => {
                  const startDate = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    startDate,
                    endDate:
                      prev.endDate && startDate && prev.endDate < startDate
                        ? startDate
                        : prev.endDate,
                  }));
                  clearFieldError(setErrors, "startDate");
                  if (form.endDate && startDate && form.endDate < startDate) {
                    clearFieldError(setErrors, "endDate");
                  }
                }}
                inputClassName={fieldInputClass("startDate", errors)}
                aria-invalid={!!errors.startDate}
              />
            </FormField>
            <FormField label="End Date" htmlFor="inquiry-end-date" error={errors.endDate}>
              <DatePickerInput
                id="inquiry-end-date"
                min={form.startDate || minDate || undefined}
                value={form.endDate}
                suppressHydrationWarning
                disabled={!form.startDate || !minDate}
                onChange={(e) => update("endDate", e.target.value)}
                inputClassName={cn(
                  fieldInputClass("endDate", errors),
                  !form.startDate && "cursor-not-allowed opacity-50"
                )}
                aria-invalid={!!errors.endDate}
              />
            </FormField>
          </div>
          <FormField label="Message" htmlFor="inquiry-message" error={errors.message}>
            <textarea
              id="inquiry-message"
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className={cn(fieldInputClass("message", errors), "resize-none")}
              aria-invalid={!!errors.message}
            />
          </FormField>
          <FormLegalConsent
            id="inquiry-legal-consent"
            checked={legalConsent}
            onChange={(checked) => {
              setLegalConsent(checked);
              clearFieldError(setErrors, "legalConsent");
            }}
            error={errors.legalConsent}
          />
          <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Submitting…" : itineraryPrimaryCta.label}
          </MagneticButton>
        </div>
      )}
    </form>
  );
}
