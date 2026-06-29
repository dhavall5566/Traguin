"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Mail,
  Phone as PhoneIcon,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HomeSection } from "@/components/home/HomeSection";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validateTravelPlannerForm,
  validateTravelPlannerStep,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import type { TravelMood } from "@/types";
import { getLocalDateIso } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { defaultCountryCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";

const travelStyles: { value: TravelMood; label: string }[] = [
  { value: "luxury", label: "Luxury" },
  { value: "romantic", label: "Romantic" },
  { value: "adventure", label: "Adventure" },
  { value: "beach", label: "Beach" },
  { value: "nature", label: "Nature" },
  { value: "spiritual", label: "Wellness" },
];

const budgetRanges = [
  { value: "100000", label: "Under ₹1L" },
  { value: "250000", label: "₹1L – ₹2.5L" },
  { value: "500000", label: "₹2.5L – ₹5L" },
  { value: "1000000", label: "₹5L – ₹10L" },
  { value: "1000001", label: "₹10L+" },
];

const travelerOptions = [
  ...Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: index + 1 === 1 ? "1 traveler" : `${index + 1} travelers`,
  })),
  { value: "13", label: "13+ travelers" },
];

const steps = [
  {
    id: "destination",
    label: "Destination",
    title: "Where & when",
    description: "Share your dream destination and preferred travel dates.",
  },
  {
    id: "details",
    label: "Details",
    title: "Trip details",
    description: "Tell us who's travelling and the budget range that feels right.",
  },
  {
    id: "preferences",
    label: "Preferences",
    title: "Your preferences",
    description: "Pick a travel style, add notes, and leave your contact details.",
  },
] as const;

export function TravelPlannerForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(getLocalDateIso());
  }, []);

  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "2",
    budget: "500000",
    style: "luxury" as TravelMood,
    notes: "",
    email: "",
    phone: "",
  });
  const [legalConsent, setLegalConsent] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<FieldErrors>({});

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const validateStep = (targetStep = step) => {
    const dateMin = minDate || getLocalDateIso();
    const next = validateTravelPlannerStep(targetStep, form, dateMin);
    setErrors(next);
    return !hasErrors(next);
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const prevStep = () => {
    setErrors({});
    setStep((value) => Math.max(value - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = withLegalConsent(
      validateTravelPlannerForm(form, minDate || getLocalDateIso()),
      legalConsent
    );
    setErrors(next);
    if (hasErrors(next)) return;

    setSubmitting(true);
    setSubmitError(null);
    const fullPhone = formatFullPhone(phoneCountryCode, form.phone);
    try {
      await submitFormSubmission({
        form_type: "travel_planner",
        email: form.email.trim().toLowerCase(),
        phone: fullPhone,
        payload: {
          destination: form.destination.trim(),
          start_date: form.startDate,
          end_date: form.endDate,
          travelers: Number(form.travelers),
          budget: Number(form.budget),
          style: form.style,
          notes: form.notes.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
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
    <HomeSection id="planner" tone="surface" className="relative overflow-hidden">
      <div className="absolute inset-0 luxury-gradient opacity-15" aria-hidden />
      <div className="relative">
        <SectionHeader
          eyebrow="Your Journey Begins Here"
          title="Plan Your Extraordinary Journey"
          description="Three quick steps. We respond with a tailored first draft, usually within 48 hours."
        />

        <div className="mx-auto mt-8 w-full max-w-3xl px-4 sm:px-6">
          <div className="planner-wizard__progress" aria-hidden>
            <span className="planner-wizard__progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <ol className="planner-wizard__steps" aria-label="Form progress">
            {steps.map((item, index) => {
              const isComplete = index < step;
              const isActive = index === step;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "planner-wizard__step",
                    isComplete && "is-complete",
                    isActive && "is-active"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="planner-wizard__step-dot">
                    {isComplete ? <Check size={14} strokeWidth={2.5} aria-hidden /> : index + 1}
                  </span>
                  <span className="planner-wizard__step-label">{item.label}</span>
                </li>
              );
            })}
          </ol>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="planner-wizard__card glass mt-6 w-full rounded-3xl border border-glass-border p-5 sm:p-7 md:p-8"
          >
            {submitted ? (
              <div className="py-10 text-center sm:py-12">
                <Sparkles size={40} className="mx-auto text-gold" />
                <h3 className="mt-4 font-display text-2xl text-foreground">Request Received</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  A travel designer will contact you shortly with your personalized itinerary.
                </p>
              </div>
            ) : (
              <>
                <div className="planner-wizard__step-intro">
                  <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
                    Step {step + 1} of {steps.length}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">
                    {currentStep.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{currentStep.description}</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="mt-6 space-y-5"
                  >
                    {hasErrors(errors) && (
                      <p
                        className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                        role="alert"
                      >
                        Please correct the highlighted fields to continue.
                      </p>
                    )}

                    {step === 0 && (
                      <>
                        <FormField
                          label="Destination"
                          htmlFor="planner-destination"
                          icon={MapPin}
                          error={errors.destination}
                        >
                          <input
                            id="planner-destination"
                            value={form.destination}
                            onChange={(e) => update("destination", e.target.value)}
                            placeholder="e.g. Kerala, Switzerland, or surprise me"
                            className={fieldInputClass("destination", errors)}
                            aria-invalid={!!errors.destination}
                          />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            label="Start Date"
                            htmlFor="planner-start-date"
                            icon={Calendar}
                            error={errors.startDate}
                          >
                            <DatePickerInput
                              id="planner-start-date"
                              min={minDate || undefined}
                              value={form.startDate}
                              suppressHydrationWarning
                              onChange={(e) => {
                                const startDate = e.target.value;
                                setForm((prev) => {
                                  const next = {
                                    ...prev,
                                    startDate,
                                    endDate:
                                      prev.endDate && startDate && prev.endDate < startDate
                                        ? startDate
                                        : prev.endDate,
                                  };
                                  return next;
                                });
                                clearFieldError(setErrors, "startDate");
                                if (form.endDate && startDate && form.endDate < startDate) {
                                  clearFieldError(setErrors, "endDate");
                                }
                              }}
                              inputClassName={fieldInputClass("startDate", errors)}
                              aria-invalid={!!errors.startDate}
                            />
                          </FormField>
                          <FormField
                            label="End Date"
                            htmlFor="planner-end-date"
                            icon={Calendar}
                            error={errors.endDate}
                          >
                            <DatePickerInput
                              id="planner-end-date"
                              min={form.startDate || minDate || undefined}
                              value={form.endDate}
                              onChange={(e) => update("endDate", e.target.value)}
                              disabled={!form.startDate || !minDate}
                              suppressHydrationWarning
                              inputClassName={cn(
                                fieldInputClass("endDate", errors),
                                !form.startDate && "cursor-not-allowed opacity-50"
                              )}
                              aria-invalid={!!errors.endDate}
                            />
                          </FormField>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          label="Travelers"
                          htmlFor="planner-travelers"
                          icon={Users}
                          error={errors.travelers}
                        >
                          <select
                            id="planner-travelers"
                            value={form.travelers}
                            onChange={(e) => update("travelers", e.target.value)}
                            className={cn(fieldInputClass("travelers", errors), "planner-wizard__select")}
                            aria-invalid={!!errors.travelers}
                          >
                            {travelerOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormField>
                        <FormField
                          label="Budget Range"
                          htmlFor="planner-budget"
                          icon={Wallet}
                          error={errors.budget}
                        >
                          <select
                            id="planner-budget"
                            value={form.budget}
                            onChange={(e) => update("budget", e.target.value)}
                            className={cn(fieldInputClass("budget", errors), "planner-wizard__select")}
                            aria-invalid={!!errors.budget}
                          >
                            {budgetRanges.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormField>
                      </div>
                    )}

                    {step === 2 && (
                      <>
                        <FormField label="Travel Style" htmlFor="planner-style" icon={Sparkles}>
                          <div
                            id="planner-style"
                            className="flex flex-wrap gap-2"
                            role="group"
                            aria-label="Travel style"
                          >
                            {travelStyles.map((style) => (
                              <button
                                key={style.value}
                                type="button"
                                onClick={() => update("style", style.value)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-xs font-medium capitalize transition-all",
                                  form.style === style.value
                                    ? "border-gold/40 bg-gold text-on-gold"
                                    : "border-glass-border bg-surface/60 text-muted hover:border-gold/30 hover:text-foreground"
                                )}
                              >
                                {style.label}
                              </button>
                            ))}
                          </div>
                        </FormField>
                        <FormField
                          label="Notes"
                          htmlFor="planner-notes"
                          icon={FileText}
                          error={errors.notes}
                        >
                          <textarea
                            id="planner-notes"
                            rows={4}
                            value={form.notes}
                            onChange={(e) => update("notes", e.target.value)}
                            placeholder="Special occasions, must-see places, dietary needs, pace preferences…"
                            className={cn(fieldInputClass("notes", errors), "resize-none")}
                            aria-invalid={!!errors.notes}
                          />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            label="Email"
                            htmlFor="planner-email"
                            icon={Mail}
                            error={errors.email}
                          >
                            <input
                              id="planner-email"
                              type="email"
                              autoComplete="email"
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                              placeholder="you@example.com"
                              className={fieldInputClass("email", errors)}
                              aria-invalid={!!errors.email}
                            />
                          </FormField>
                          <FormField
                            label="Phone"
                            htmlFor="planner-phone"
                            icon={PhoneIcon}
                            error={errors.phone}
                          >
                            <PhoneInput
                              id="planner-phone"
                              countryCode={phoneCountryCode}
                              onCountryCodeChange={setPhoneCountryCode}
                              value={form.phone}
                              onChange={(value) => update("phone", value)}
                              invalid={!!errors.phone}
                            />
                          </FormField>
                        </div>
                        {submitError && (
                          <p
                            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                            role="alert"
                          >
                            {submitError}
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {step === steps.length - 1 && (
                  <FormLegalConsent
                    id="travel-planner-legal-consent"
                    checked={legalConsent}
                    onChange={(checked) => {
                      setLegalConsent(checked);
                      clearFieldError(setErrors, "legalConsent");
                    }}
                    error={errors.legalConsent}
                    className="mt-6"
                  />
                )}

                <div className="planner-wizard__actions mt-8 border-t border-glass-border pt-5">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      <ChevronLeft size={16} aria-hidden />
                      Back
                    </button>
                  ) : (
                    <span aria-hidden />
                  )}

                  {step < steps.length - 1 ? (
                    <MagneticButton
                      type="button"
                      variant="primary"
                      onClick={nextStep}
                      className="w-full !justify-center sm:w-auto sm:min-w-[11rem]"
                    >
                      Continue
                      <ChevronRight size={16} aria-hidden />
                    </MagneticButton>
                  ) : (
                    <MagneticButton
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="w-full !justify-center sm:w-auto sm:min-w-[14rem]"
                    >
                      {submitting ? "Submitting…" : "Get Personalized Itinerary"}
                    </MagneticButton>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </HomeSection>
  );
}
