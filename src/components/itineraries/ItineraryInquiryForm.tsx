"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateInquiryForm,
  type FieldErrors,
} from "@/lib/form-validation";
import { itineraryPrimaryCta } from "@/data/site";
import { cn } from "@/lib/utils";

type ItineraryInquiryFormProps = {
  itineraryTitle: string;
  itinerarySlug: string;
};

export function ItineraryInquiryForm({ itineraryTitle, itinerarySlug }: ItineraryInquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    dates: "",
    message: `I'm interested in the ${itineraryTitle} itinerary.`,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateInquiryForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitted(true);
  };

  return (
    <form
      id="inquiry"
      className="glass scroll-mt-28 rounded-3xl border border-glass-border p-6 md:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="itinerary" value={itinerarySlug} />
      <h2 className="font-display text-2xl text-foreground md:text-3xl">Request This Itinerary</h2>
      <p className="mt-2 text-sm text-muted">
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
              <input
                id="inquiry-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={fieldInputClass("phone", errors)}
                aria-invalid={!!errors.phone}
              />
            </FormField>
            <FormField label="Preferred Travel Dates" htmlFor="inquiry-dates" error={errors.dates}>
              <input
                id="inquiry-dates"
                value={form.dates}
                onChange={(e) => update("dates", e.target.value)}
                className={fieldInputClass("dates", errors)}
                aria-invalid={!!errors.dates}
              />
            </FormField>
          </div>
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
          <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto">
            {itineraryPrimaryCta.label}
          </MagneticButton>
        </div>
      )}
    </form>
  );
}
