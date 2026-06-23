"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Wallet, Sparkles, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HomeSection } from "@/components/home/HomeSection";
import {
  clearFieldError,
  hasErrors,
  validateTravelPlannerForm,
  validateTravelPlannerStep,
  type FieldErrors,
} from "@/lib/form-validation";
import type { TravelMood } from "@/types";
import { getLocalDateIso } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { Mail, Phone as PhoneIcon } from "lucide-react";

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

const steps = ["Destination", "Details", "Preferences"] as const;

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
    budget: "250000",
    style: "luxury" as TravelMood,
    notes: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

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
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateTravelPlannerForm(form, minDate || getLocalDateIso());
    setErrors(next);
    if (hasErrors(next)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitFormSubmission({
        form_type: "travel_planner",
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        payload: {
          destination: form.destination.trim(),
          start_date: form.startDate,
          end_date: form.endDate,
          travelers: Number(form.travelers),
          budget: Number(form.budget),
          style: form.style,
          notes: form.notes.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
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
      <div className="absolute inset-0 luxury-gradient opacity-15" />
      <div className="relative">
        <SectionHeader
          eyebrow="Your Journey Begins Here"
          title="Plan Your Extraordinary Journey"
          titleClassName="text-[clamp(1.35rem,4.2vw,3.25rem)] whitespace-nowrap md:text-[clamp(1.75rem,4.2vw,3.25rem)] lg:text-[clamp(2rem,4.2vw,3.25rem)]"
        />

        <div className="mt-6 flex justify-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  i <= step ? "bg-gold text-on-gold" : "glass text-muted"
                )}
              >
                {i + 1}
              </span>
              <span className={cn("hidden text-xs sm:inline", i <= step ? "text-foreground" : "text-muted")}>
                {label}
              </span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-glass-border sm:w-10" />}
            </div>
          ))}
        </div>

        <div className="site-container--content mt-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass w-full rounded-3xl border border-glass-border p-6 md:p-10"
          >
          {submitted ? (
            <div className="py-12 text-center">
              <Sparkles size={40} className="mx-auto text-gold" />
              <h3 className="mt-4 font-display text-2xl">Request Received</h3>
              <p className="mt-2 text-muted">
                A travel designer will contact you shortly with your personalized itinerary.
              </p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {hasErrors(errors) && (
                    <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
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
                          <input
                            id="planner-start-date"
                            type="date"
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
                            className={fieldInputClass("startDate", errors)}
                            aria-invalid={!!errors.startDate}
                          />
                        </FormField>
                        <FormField
                          label="End Date"
                          htmlFor="planner-end-date"
                          icon={Calendar}
                          error={errors.endDate}
                        >
                          <input
                            id="planner-end-date"
                            type="date"
                            min={form.startDate || minDate || undefined}
                            value={form.endDate}
                            onChange={(e) => update("endDate", e.target.value)}
                            disabled={!form.startDate || !minDate}
                            suppressHydrationWarning
                            className={cn(
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
                    <>
                      <FormField
                        label="Travelers"
                        htmlFor="planner-travelers"
                        icon={Users}
                        error={errors.travelers}
                      >
                        <input
                          id="planner-travelers"
                          type="number"
                          min={1}
                          max={50}
                          value={form.travelers}
                          onChange={(e) => update("travelers", e.target.value)}
                          className={fieldInputClass("travelers", errors)}
                          aria-invalid={!!errors.travelers}
                        />
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
                          className={fieldInputClass("budget", errors)}
                          aria-invalid={!!errors.budget}
                        >
                          {budgetRanges.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </>
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
                          {travelStyles.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => setForm({ ...form, style: s.value })}
                              className={cn(
                                "rounded-full px-4 py-2 text-xs capitalize transition-all",
                                form.style === s.value
                                  ? "bg-gold text-on-gold"
                                  : "glass text-muted hover:border-gold/30"
                              )}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </FormField>
                      <FormField label="Notes" htmlFor="planner-notes" icon={FileText} error={errors.notes}>
                        <textarea
                          id="planner-notes"
                          rows={4}
                          value={form.notes}
                          onChange={(e) => update("notes", e.target.value)}
                          className={cn(fieldInputClass("notes", errors), "resize-none")}
                          aria-invalid={!!errors.notes}
                        />
                      </FormField>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Email" htmlFor="planner-email" icon={Mail} error={errors.email}>
                          <input
                            id="planner-email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            className={fieldInputClass("email", errors)}
                            aria-invalid={!!errors.email}
                          />
                        </FormField>
                        <FormField label="Phone" htmlFor="planner-phone" icon={PhoneIcon} error={errors.phone}>
                          <input
                            id="planner-phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            className={fieldInputClass("phone", errors)}
                            aria-invalid={!!errors.phone}
                          />
                        </FormField>
                      </div>
                      {submitError && (
                        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
                          {submitError}
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div
                className={cn(
                  "mt-8",
                  step > 0 && "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                )}
              >
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                ) : null}
                {step < steps.length - 1 ? (
                  <MagneticButton
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    className={cn(
                      "w-full !justify-center",
                      step > 0 && "sm:flex-1"
                    )}
                  >
                    Continue
                    <ChevronRight size={16} className="ml-1 inline" />
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className={cn(
                      "w-full !justify-center",
                      step > 0 && "sm:flex-1"
                    )}
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
