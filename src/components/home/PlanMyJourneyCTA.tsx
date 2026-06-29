"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  pickPlannerCtaBackground,
  plannerCtaBackgrounds,
} from "@/lib/planner-cta-backgrounds";
import { contactInfo } from "@/data/contact";
import { defaultCountryCode, getCountryByCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import { collectErrors, clearFieldError, hasErrors, validateLegalConsent, validatePhone, type FieldErrors } from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { HomeSection } from "@/components/home/HomeSection";
import { cn } from "@/lib/utils";
import { getMotionLite } from "@/lib/motion-profile";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_GREEN = "#25D366";

export function PlanMyJourneyCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(false);
  const visitCountRef = useRef(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [legalConsent, setLegalConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const background = plannerCtaBackgrounds[backgroundIndex];

  useEffect(() => {
    setBackgroundIndex(pickPlannerCtaBackground(0));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!wasInViewRef.current) {
            wasInViewRef.current = true;
            visitCountRef.current += 1;

            if (visitCountRef.current > 1) {
              setImageVisible(false);
              window.setTimeout(() => {
                setBackgroundIndex((current) => pickPlannerCtaBackground(current));
                setImageVisible(true);
              }, 280);
            }
          }
          return;
        }

        wasInViewRef.current = false;
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const bg = bgRef.current;
      const section = sectionRef.current;
      if (!bg || !section) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || getMotionLite()) return;

      gsap.to(bg, {
        y: 48,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = collectErrors({
      phone: validatePhone(phone, true),
      legalConsent: validateLegalConsent(legalConsent),
    });
    setErrors(next);
    if (hasErrors(next)) return;

    const fullPhone = formatFullPhone(countryCode, phone);
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitFormSubmission({
        form_type: "plan_my_journey",
        name: "WhatsApp Callback Request",
        phone: fullPhone,
        payload: {
          phone: fullPhone,
          country_code: getCountryByCode(countryCode).dial,
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
    <HomeSection id="plan-my-journey" spacing="default" className="!pb-[clamp(3.5rem,8vw,6rem)]">
      <div
        ref={sectionRef}
        className="plan-journey-card relative flex min-h-0 items-center justify-center sm:min-h-[clamp(22rem,52vw,32rem)]"
        aria-labelledby="plan-my-journey-heading"
      >
        <div ref={bgRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <SafeImage
            key={background.src}
            src={background.src}
            alt={background.alt}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-700 ease-out",
              imageVisible ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 sm:bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/78 sm:bg-gradient-to-r sm:from-black/65 sm:via-black/45 sm:to-black/30" />
        </div>

        <Reveal3D variant="scale" className="plan-journey-card__content relative z-10 w-full text-center">
          <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-gold uppercase sm:text-xs">
            Plan with us
          </p>
          <h2
            id="plan-my-journey-heading"
            className="mt-3 font-display text-[clamp(1.5rem,6.4vw,3.25rem)] leading-[1.08] tracking-tight text-white text-balance"
          >
            <span className="block">Your Story Begins</span>
            <span className="mt-1 block text-white/95 sm:mt-0 sm:inline"> at TRAGUIN</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl px-1 text-sm leading-relaxed text-white/85 sm:mt-5 sm:px-0 sm:text-base">
            Speak with our travel designers for priority access to curated luxury journeys, bespoke
            itineraries, and member-only expertise.
          </p>

          {submitted ? (
            <p className="mx-auto mt-8 max-w-md rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-white backdrop-blur-sm sm:px-6 sm:text-base">
              Thank you. A travel designer will call you within 2 working hours.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="plan-journey-card__form mx-auto mt-7 w-full sm:mt-10">
              <PhoneInput
                id="planner-phone"
                variant="hero"
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  if (errors.phone) setErrors({});
                }}
                invalid={!!errors.phone}
                placeholder="Your phone number"
              />

              <div className="mt-3 flex items-stretch gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 min-h-12 flex-1 items-center justify-center rounded-full bg-white px-4 text-[0.68rem] font-bold tracking-[0.14em] text-black uppercase shadow-sm transition-colors hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:text-[11px] sm:tracking-[0.16em]"
                >
                  {submitting ? "Sending…" : "Get Called"}
                </button>

                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-opacity hover:opacity-90"
                  style={{ backgroundColor: WHATSAPP_GREEN }}
                  aria-label="Chat on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>

              <FormLegalConsent
                id="plan-journey-legal-consent"
                checked={legalConsent}
                onChange={(checked) => {
                  setLegalConsent(checked);
                  clearFieldError(setErrors, "legalConsent");
                }}
                error={errors.legalConsent}
                variant="light"
                className="mt-3 text-left"
              />
              {errors.phone && (
                <p id="planner-phone-error" className="mt-2 text-left text-xs text-red-300">
                  {errors.phone}
                </p>
              )}
              {submitError && (
                <p className="mt-2 text-left text-xs text-red-300" role="alert">
                  {submitError}
                </p>
              )}
            </form>
          )}
        </Reveal3D>
      </div>
    </HomeSection>
  );
}
