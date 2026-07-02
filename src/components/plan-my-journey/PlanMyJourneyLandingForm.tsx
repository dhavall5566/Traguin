"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, IndianRupee, Minus, PawPrint, Plus } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { FormSelectDropdown } from "@/components/ui/FormSelectDropdown";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validatePlanMyJourneyForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import type { PlanMyJourneySearchParams } from "@/lib/plan-my-journey";
import { defaultCountryCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";
import { getLocalDateIso } from "@/lib/date-input";
import { cn } from "@/lib/utils";
import { FORM_BUDGET_RANGES } from "@/data/price-ranges";

const budgetOptions = FORM_BUDGET_RANGES.map((option) => ({
  value: option.value,
  label: option.label,
  icon: IndianRupee,
}));

const childAgeOptions = Array.from({ length: 18 }, (_, age) => ({
  value: String(age),
  label: age === 0 ? "Under 1 yr" : `${age} yrs`,
}));

function CounterRow({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="plan-journey-counter">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {hint ? <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="plan-journey-counter__btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={16} />
        </button>
        <span className="min-w-[1.5rem] text-center font-semibold text-foreground">{value}</span>
        <button
          type="button"
          className="plan-journey-counter__btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function PlanMyJourneyLandingForm({ context }: { context: PlanMyJourneySearchParams }) {
  const [minDate, setMinDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [legalConsent, setLegalConsent] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<{
    memberCode: string;
    inquiryCode: string;
    customerId?: string | null;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: context.destination ?? "",
    startDate: "",
    endDate: "",
    rooms: "1",
    adults: "2",
    children: "0",
    childAges: [] as string[],
    travelingWithPets: false,
    budget: "200000",
    notes: "",
  });

  useEffect(() => {
    setMinDate(getLocalDateIso());
  }, []);

  const selectedItinerary = context.itinerary_title?.trim() || null;

  const childrenCount = Number(form.children) || 0;

  useEffect(() => {
    setForm((prev) => {
      const nextAges = [...prev.childAges];
      while (nextAges.length < childrenCount) nextAges.push("7");
      while (nextAges.length > childrenCount) nextAges.pop();
      return { ...prev, childAges: nextAges };
    });
  }, [childrenCount]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const summaryLine = useMemo(() => {
    const parts = [
      `${form.rooms} room${Number(form.rooms) === 1 ? "" : "s"}`,
      `${form.adults} adult${Number(form.adults) === 1 ? "" : "s"}`,
    ];
    if (childrenCount > 0) {
      parts.push(`${childrenCount} child${childrenCount === 1 ? "" : "ren"}`);
    }
    if (form.travelingWithPets) parts.push("pet-friendly");
    return parts.join(" · ");
  }, [form.rooms, form.adults, childrenCount, form.travelingWithPets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = withLegalConsent(validatePlanMyJourneyForm(form, minDate), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    const fullPhone = formatFullPhone(phoneCountryCode, form.phone);

    try {
      const response = await submitFormSubmission({
        form_type: "plan_my_journey",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: fullPhone,
        related_itinerary_id: context.itinerary_id ?? null,
        payload: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          destination: form.destination.trim(),
          start_date: form.startDate,
          end_date: form.endDate,
          rooms: Number(form.rooms),
          adults: Number(form.adults),
          children: childrenCount,
          child_ages: form.childAges,
          traveling_with_pets: form.travelingWithPets,
          budget: form.budget,
          notes: form.notes.trim(),
          itinerary_slug: context.itinerary_slug ?? null,
          itinerary_title: context.itinerary_title ?? null,
        },
      });

      setResult({
        memberCode: response.member_code ?? "Pending",
        inquiryCode: response.inquiry_code ?? "Pending",
        customerId: response.customer_id,
      });
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

  if (result) {
    return (
      <div className="plan-journey-success">
        <div className="plan-journey-success__icon" aria-hidden>
          <Check size={28} />
        </div>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Your journey request is in</h1>
        <p className="mt-3 max-w-xl text-muted">
          A TRAGUIN travel expert will reach out shortly. Save these reference codes for member tracking.
        </p>
        <dl className="plan-journey-success__codes mt-8">
          <div>
            <dt>Customer ID</dt>
            <dd>{result.memberCode}</dd>
          </div>
          <div>
            <dt>Inquiry ID</dt>
            <dd>{result.inquiryCode}</dd>
          </div>
          {selectedItinerary ? (
            <div className="sm:col-span-2">
              <dt>Selected itinerary</dt>
              <dd>{selectedItinerary}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton as={Link} href="/" variant="primary">
            Back to home
          </MagneticButton>
          <MagneticButton as={Link} href="/destinations" variant="secondary">
            Browse destinations
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="plan-journey-form">
      {selectedItinerary ? (
        <div className="plan-journey-selected-itinerary">
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gold uppercase">Selected itinerary</p>
          <p className="mt-2 font-display text-2xl text-foreground">{selectedItinerary}</p>
          {context.itinerary_slug ? (
            <p className="mt-1 text-sm text-muted">We&apos;ll tailor this journey to your party and dates.</p>
          ) : null}
        </div>
      ) : null}

      <section className="plan-journey-panel">
        <h2 className="plan-journey-panel__title">Trip details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Destination"
            htmlFor="pmj-destination"
            error={errors.destination}
            className="sm:col-span-2"
          >
            <input
              id="pmj-destination"
              className={fieldInputClass("destination", errors)}
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
              placeholder="Where would you like to go?"
              aria-invalid={!!errors.destination}
            />
          </FormField>
          <FormField label="Start date" htmlFor="pmj-start-date" error={errors.startDate}>
            <DatePickerInput
              id="pmj-start-date"
              value={form.startDate}
              min={minDate}
              onChange={(value) => update("startDate", value)}
              inputClassName={fieldInputClass("startDate", errors)}
            />
          </FormField>
          <FormField label="End date" htmlFor="pmj-end-date" error={errors.endDate}>
            <DatePickerInput
              id="pmj-end-date"
              value={form.endDate}
              min={form.startDate || minDate}
              onChange={(value) => update("endDate", value)}
              inputClassName={fieldInputClass("endDate", errors)}
            />
          </FormField>
          <FormField
            label="Price range"
            htmlFor="pmj-budget"
            error={errors.budget}
            className="sm:col-span-2"
          >
            <FormSelectDropdown
              id="pmj-budget"
              label="Price range"
              value={form.budget}
              options={budgetOptions}
              onChange={(value) => update("budget", value)}
              invalid={!!errors.budget}
            />
          </FormField>
        </div>
      </section>

      <section className="plan-journey-panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="plan-journey-panel__title">Rooms & guests</h2>
          <p className="text-sm text-muted">{summaryLine}</p>
        </div>
        <div className="mt-4 grid gap-3">
          <CounterRow
            label="Room"
            value={Number(form.rooms)}
            min={1}
            max={8}
            onChange={(next) => update("rooms", String(next))}
          />
          <CounterRow
            label="Adults"
            value={Number(form.adults)}
            min={1}
            max={20}
            onChange={(next) => update("adults", String(next))}
          />
          <CounterRow
            label="Children (0 – 17 years old)"
            hint="Please provide the right number of children and their ages for best options and prices."
            value={childrenCount}
            min={0}
            max={12}
            onChange={(next) => update("children", String(next))}
          />
        </div>

        {childrenCount > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {form.childAges.map((age, index) => (
              <FormField
                key={`child-age-${index}`}
                label={`Child ${index + 1}`}
                htmlFor={`pmj-child-age-${index}`}
                error={errors[`childAge_${index}`]}
              >
                <select
                  id={`pmj-child-age-${index}`}
                  className={fieldInputClass(`childAge_${index}`, errors)}
                  value={age}
                  onChange={(e) => {
                    const next = [...form.childAges];
                    next[index] = e.target.value;
                    update("childAges", next);
                    clearFieldError(setErrors, `childAge_${index}`);
                  }}
                >
                  {childAgeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            ))}
          </div>
        ) : null}

        <label
          className={cn(
            "mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
            form.travelingWithPets ? "border-gold/40 bg-gold/[0.06]" : "border-glass-border"
          )}
        >
          <input
            type="checkbox"
            className="mt-1"
            checked={form.travelingWithPets}
            onChange={(e) => update("travelingWithPets", e.target.checked)}
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <PawPrint size={16} className="text-gold" aria-hidden />
              Are you travelling with pets?
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              We&apos;ll show pet-friendly properties and note any applicable policies or fees.
            </span>
          </span>
        </label>
      </section>

      <section className="plan-journey-panel plan-journey-panel--full">
        <h2 className="plan-journey-panel__title">Your details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full name"
            htmlFor="pmj-name"
            error={errors.name}
            className="sm:col-span-2"
          >
            <input
              id="pmj-name"
              className={fieldInputClass("name", errors)}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
          </FormField>
          <FormField label="Email" htmlFor="pmj-email" error={errors.email}>
            <input
              id="pmj-email"
              type="email"
              className={fieldInputClass("email", errors)}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
          </FormField>
          <FormField label="Mobile number" htmlFor="pmj-phone" error={errors.phone}>
            <PhoneInput
              id="pmj-phone"
              value={form.phone}
              countryCode={phoneCountryCode}
              onCountryCodeChange={setPhoneCountryCode}
              onChange={(value) => update("phone", value)}
              invalid={!!errors.phone}
            />
          </FormField>
          <FormField
            label="Special requests"
            htmlFor="pmj-notes"
            error={errors.notes}
            className="sm:col-span-2"
          >
            <textarea
              id="pmj-notes"
              className={cn(fieldInputClass("notes", errors), "min-h-[110px] resize-y")}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Celebrations, pace, accessibility, must-see experiences…"
            />
          </FormField>
        </div>
      </section>

      <FormLegalConsent
        className="plan-journey-form__consent"
        checked={legalConsent}
        onChange={setLegalConsent}
        error={errors.legalConsent}
      />

      {submitError ? (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="plan-journey-form__actions flex flex-wrap items-center gap-3">
        <MagneticButton type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit journey request"}
        </MagneticButton>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeft size={14} aria-hidden />
          Back to home
        </Link>
      </div>
    </form>
  );
}
