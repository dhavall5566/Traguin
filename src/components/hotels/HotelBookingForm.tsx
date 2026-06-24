"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validateHotelBookingForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { cn } from "@/lib/utils";
import type { Hotel } from "@/types";
import { getHotelDestinationLabel } from "@/lib/hotels";

function bookingMessageForHotel(hotel: Hotel): string {
  const destination = getHotelDestinationLabel(hotel);
  return destination
    ? `I would like to request a booking at ${hotel.name}, ${destination}.`
    : `I would like to request a booking at ${hotel.name}.`;
}

type HotelBookingFormProps = {
  hotel: Hotel;
};

export function HotelBookingForm({ hotel }: HotelBookingFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    dates: "",
    message: bookingMessageForHotel(hotel),
  });
  const [legalConsent, setLegalConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      name: "",
      email: "",
      phone: "",
      travelers: "2",
      dates: "",
      message: bookingMessageForHotel(hotel),
    });
    setErrors({});
    setSubmitted(false);
    setLegalConsent(false);
  }, [hotel.id, hotel.name, hotel.destination]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = withLegalConsent(validateHotelBookingForm(form), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitFormSubmission({
        form_type: "hotel_booking",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        related_hotel_id: hotel.id,
        payload: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          travelers: Number(form.travelers),
          dates: form.dates.trim(),
          message: form.message.trim(),
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

  return (
    <form
      id="hotel-booking"
      onSubmit={handleSubmit}
      noValidate
      className="glass rounded-2xl border border-glass-border p-5 md:p-6"
    >
      <input type="hidden" name="hotelId" value={hotel.id} />
      <h3 className="font-display text-xl text-foreground md:text-2xl">Request a Booking</h3>
      <p className="mt-2 text-sm text-muted">
        Share your stay details and our travel expert will confirm availability for{" "}
        <span className="text-foreground">{hotel.name}</span>.
      </p>

      {submitted ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center py-6 text-center">
          <Send size={36} className="text-gold" />
          <h4 className="mt-4 font-display text-lg">Booking Request Received</h4>
          <p className="mt-2 text-sm text-muted">We&apos;ll respond within one business day.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="hotel-booking-name" error={errors.name}>
              <input
                id="hotel-booking-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={fieldInputClass("name", errors)}
                aria-invalid={!!errors.name}
              />
            </FormField>
            <FormField label="Email" htmlFor="hotel-booking-email" error={errors.email}>
              <input
                id="hotel-booking-email"
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
            <FormField label="Phone" htmlFor="hotel-booking-phone" error={errors.phone}>
              <input
                id="hotel-booking-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={fieldInputClass("phone", errors)}
                aria-invalid={!!errors.phone}
              />
            </FormField>
            <FormField label="Guests" htmlFor="hotel-booking-travelers" error={errors.travelers}>
              <input
                id="hotel-booking-travelers"
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
          <FormField label="Check-in / Stay Dates" htmlFor="hotel-booking-dates" error={errors.dates}>
            <input
              id="hotel-booking-dates"
              value={form.dates}
              onChange={(e) => update("dates", e.target.value)}
              className={fieldInputClass("dates", errors)}
              aria-invalid={!!errors.dates}
            />
          </FormField>
          <FormField label="Message" htmlFor="hotel-booking-message" error={errors.message}>
            <textarea
              id="hotel-booking-message"
              rows={3}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className={cn(fieldInputClass("message", errors), "resize-none")}
              aria-invalid={!!errors.message}
            />
          </FormField>
          <FormLegalConsent
            id="hotel-booking-legal-consent"
            checked={legalConsent}
            onChange={(checked) => {
              setLegalConsent(checked);
              clearFieldError(setErrors, "legalConsent");
            }}
            error={errors.legalConsent}
          />
          <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Booking Request"}
          </MagneticButton>
        </div>
      )}
    </form>
  );
}
