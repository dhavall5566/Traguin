"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validateHotelReviewForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { cn } from "@/lib/utils";
import type { Hotel } from "@/types";

type HotelReviewFormProps = {
  hotel: Hotel;
  compact?: boolean;
};

export function HotelReviewForm({ hotel, compact = false }: HotelReviewFormProps) {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    review: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [legalConsent, setLegalConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ name: "", rating: 0, review: "" });
    setHoverRating(0);
    setErrors({});
    setSubmitted(false);
    setLegalConsent(false);
  }, [hotel.id]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = withLegalConsent(validateHotelReviewForm(form), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitFormSubmission({
        form_type: "hotel_review",
        name: form.name.trim(),
        related_hotel_id: hotel.id,
        payload: {
          name: form.name.trim(),
          rating: form.rating,
          review: form.review.trim(),
          hotel_id: hotel.id,
          hotel_name: hotel.name,
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

  const displayRating = hoverRating || form.rating;

  return (
    <form
      id="hotel-review"
      onSubmit={handleSubmit}
      noValidate
      className={cn(!compact && "glass rounded-2xl border border-glass-border p-5 md:p-6")}
    >
      <input type="hidden" name="hotelId" value={hotel.id} />

      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-gold" aria-hidden />
        <h3 className={cn("font-display text-foreground", compact ? "text-lg" : "text-xl md:text-2xl")}>
          Share Your Review
        </h3>
      </div>
      {!compact && (
        <p className="mt-2 text-sm text-muted">
          Tell future guests about your experience at{" "}
          <span className="text-foreground">{hotel.name}</span>.
        </p>
      )}

      {submitted ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-6 text-center",
            compact ? "min-h-[120px]" : "min-h-[180px]"
          )}
        >
          <Star size={compact ? 28 : 36} className="fill-gold text-gold" />
          <h4 className="mt-3 font-display text-lg text-foreground">Thank You</h4>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Your review has been received. Our team may reach out before it appears publicly.
          </p>
        </div>
      ) : (
        <div className={cn("space-y-4", compact ? "mt-4" : "mt-5")}>
          {hasErrors(errors) && (
            <p
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              Please correct the highlighted fields before submitting.
            </p>
          )}
          {submitError && (
            <p
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <div className={cn(compact && "grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end")}>
            <FormField label="Your Name" htmlFor="hotel-review-name" error={errors.name}>
              <input
                id="hotel-review-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={fieldInputClass("name", errors)}
                aria-invalid={!!errors.name}
              />
            </FormField>

            <div className={cn(compact && "sm:pb-0.5")}>
              <span className={cn("mb-1.5 block text-xs tracking-wide text-muted uppercase")}>
                Your Rating
              </span>
              <div
                className="flex items-center gap-0.5"
                role="radiogroup"
                aria-label="Star rating"
                aria-invalid={!!errors.rating}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("rating", value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-checked={form.rating === value}
                    role="radio"
                  >
                    <Star
                      size={compact ? 22 : 28}
                      className={cn(
                        "transition-colors",
                        value <= displayRating
                          ? "fill-gold text-gold"
                          : "fill-transparent text-muted/50"
                      )}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-red-400">{errors.rating}</p>}
            </div>
          </div>

          <FormField label="Your Review" htmlFor="hotel-review-text" error={errors.review}>
            <textarea
              id="hotel-review-text"
              rows={compact ? 2 : 4}
              placeholder="What did you love about your stay?"
              value={form.review}
              onChange={(e) => update("review", e.target.value)}
              className={cn(fieldInputClass("review", errors), "resize-none")}
              aria-invalid={!!errors.review}
            />
          </FormField>

          <FormLegalConsent
            id="hotel-review-legal-consent"
            checked={legalConsent}
            onChange={(checked) => {
              setLegalConsent(checked);
              clearFieldError(setErrors, "legalConsent");
            }}
            error={errors.legalConsent}
          />

          <MagneticButton type="submit" variant="secondary" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Review"}
          </MagneticButton>
        </div>
      )}
    </form>
  );
}
