"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateHotelBookingForm,
  type FieldErrors,
} from "@/lib/form-validation";
import { cn } from "@/lib/utils";
import type { Hotel } from "@/types";

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
    message: `I would like to request a booking at ${hotel.name}, ${hotel.destination}.`,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm({
      name: "",
      email: "",
      phone: "",
      travelers: "2",
      dates: "",
      message: `I would like to request a booking at ${hotel.name}, ${hotel.destination}.`,
    });
    setErrors({});
    setSubmitted(false);
  }, [hotel.id, hotel.name, hotel.destination]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateHotelBookingForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitted(true);
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
        Share your stay details and our concierge will confirm availability for{" "}
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
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className={cn(fieldInputClass("message", errors), "resize-none")}
              aria-invalid={!!errors.message}
            />
          </FormField>
          <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto">
            Submit Booking Request
          </MagneticButton>
        </div>
      )}
    </form>
  );
}
