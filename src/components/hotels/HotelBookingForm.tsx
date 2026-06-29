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
  validateHotelBookingForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { formatDateRangeForPayload, getLocalDateIso } from "@/lib/date-input";
import { defaultCountryCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";
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
  const [minDate, setMinDate] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    startDate: "",
    endDate: "",
    message: bookingMessageForHotel(hotel),
  });
  const [legalConsent, setLegalConsent] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setMinDate(getLocalDateIso());
  }, []);

  useEffect(() => {
    setForm({
      name: "",
      email: "",
      phone: "",
      travelers: "2",
      startDate: "",
      endDate: "",
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
    const nextErrors = withLegalConsent(validateHotelBookingForm(form, minDate), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    const fullPhone = formatFullPhone(phoneCountryCode, form.phone);
    try {
      await submitFormSubmission({
        form_type: "hotel_booking",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: fullPhone,
        related_hotel_id: hotel.id,
        payload: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          travelers: Number(form.travelers),
          dates: formatDateRangeForPayload(form.startDate, form.endDate),
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
              <PhoneInput
                id="hotel-booking-phone"
                countryCode={phoneCountryCode}
                onCountryCodeChange={setPhoneCountryCode}
                value={form.phone}
                onChange={(value) => update("phone", value)}
                invalid={!!errors.phone}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Check-in Date" htmlFor="hotel-booking-start-date" error={errors.startDate}>
              <DatePickerInput
                id="hotel-booking-start-date"
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
            <FormField label="Check-out Date" htmlFor="hotel-booking-end-date" error={errors.endDate}>
              <DatePickerInput
                id="hotel-booking-end-date"
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
