"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Crown, Headphones, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass, fieldSelectClass } from "@/components/ui/FormField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { FormLegalConsent } from "@/components/forms/FormLegalConsent";
import {
  clearFieldError,
  hasErrors,
  validateConciergeForm,
  withLegalConsent,
  type FieldErrors,
} from "@/lib/form-validation";
import { FormSubmissionError, submitFormSubmission } from "@/lib/api/form-submissions";
import { FormSubmissionSuccessCodes } from "@/components/forms/FormSubmissionSuccessCodes";
import { contactInfo } from "@/data/contact";
import { defaultCountryCode } from "@/data/country-codes";
import { formatFullPhone } from "@/lib/phone-input";
import { cn } from "@/lib/utils";
import { iconFromKey } from "@/lib/icons";
import { images } from "@/lib/images";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { pageHeroes } from "@/data/pageContent";
import type {
  TravelExpertDeskSettings,
  TravelExpertPageData,
  TravelExpertService,
} from "@/lib/api/travel-expert";

const SHOWCASE_PHOTOS = [
  { src: images.serviceBespoke, alt: "Bespoke luxury journey planning" },
  { src: images.serviceSkyCharter, alt: "Private aviation charter" },
  { src: images.serviceYacht, alt: "Yacht and sea experiences" },
] as const;

function ServiceCard({
  service,
  isSelected,
  onSelect,
  revealed,
}: {
  service: TravelExpertService;
  isSelected: boolean;
  onSelect: () => void;
  revealed: boolean;
}) {
  const Icon = iconFromKey(service.iconKey);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "travel-expert-service-card group overflow-hidden rounded-2xl border text-left transition-all duration-300",
        isSelected
          ? "border-gold/55 ring-2 ring-gold/25 shadow-[0_20px_48px_-24px_color-mix(in_srgb,var(--gold)_40%,transparent)]"
          : "border-glass-border hover:border-gold/30 hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]",
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      aria-pressed={isSelected}
    >
      <div className="travel-expert-service-card__media relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={service.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="travel-expert-service-card__scrim pointer-events-none absolute inset-0" aria-hidden />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
          <span className="rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white backdrop-blur-sm">
            #{service.number}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-gold-light backdrop-blur-sm">
            <Icon size={16} strokeWidth={1.75} aria-hidden />
          </span>
        </div>
        {isSelected ? (
          <span className="absolute bottom-3 left-3 rounded-full border border-gold/40 bg-gold/90 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-on-gold uppercase">
            Selected
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "travel-expert-service-card__body p-4 sm:p-5",
          isSelected && "travel-expert-service-card__body--selected"
        )}
      >
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{service.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>
      </div>
    </button>
  );
}

function TravelExpertDeskCard({ desk }: { desk: TravelExpertDeskSettings }) {
  return (
    <div className="travel-expert-desk-card w-full min-w-0">
      <span className="travel-expert-desk-online">
        <span className="travel-expert-desk-online-dot" aria-hidden />
        Online now
      </span>

      <div className="travel-expert-desk-header">
        <p className="text-[10px] font-bold tracking-[0.32em] text-gold uppercase">Travel Experts</p>
        <h3 className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2rem)] font-semibold text-foreground">
          {desk.deskHeadline}
        </h3>
        <span className="travel-expert-desk-rule" aria-hidden />
      </div>

      <div className="travel-expert-desk-stats">
        <div className="travel-expert-desk-stat">
          <div className="travel-expert-desk-stat-icon">
            <Clock size={20} aria-hidden />
          </div>
          <p className="font-display text-3xl font-semibold leading-none text-foreground">{desk.hoursValue}</p>
          <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">
            {desk.hoursLabel}
          </p>
          <p className="mt-1 text-xs text-muted">First expert reply</p>
        </div>

        <div className="travel-expert-desk-stat-divider" aria-hidden />

        <div className="travel-expert-desk-stat">
          <div className="relative travel-expert-desk-stat-icon">
            <Headphones size={20} aria-hidden />
            <span className="travel-expert-card-live" aria-hidden />
          </div>
          <p className="font-display text-2xl font-semibold leading-none text-foreground">{desk.liveDeskValue}</p>
          <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">
            {desk.liveDeskLabel}
          </p>
          <p className="mt-1 text-xs text-muted">Experts on call now</p>
        </div>
      </div>

      <div className="travel-expert-desk-actions">
        <a
          href={contactInfo.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="travel-expert-desk-btn travel-expert-desk-btn--whatsapp"
        >
          <WhatsAppIcon size={16} aria-hidden />
          WhatsApp
        </a>
        <a href={contactInfo.phoneHref} className="travel-expert-desk-btn travel-expert-desk-btn--call">
          <Phone size={16} aria-hidden />
          Call Expert
        </a>
      </div>
    </div>
  );
}

type ConciergePageProps = {
  data: TravelExpertPageData;
};

export function ConciergePage({ data }: ConciergePageProps) {
  const { services, desk } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const defaultService = services[0]?.title ?? "";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: defaultService,
    message: "",
  });
  const [legalConsent, setLegalConsent] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [leadCode, setLeadCode] = useState<string | null>(null);
  const [inquiryCode, setInquiryCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const serviceGridClass = useMemo(
    () =>
      cn(
        "travel-expert-services-grid grid gap-4",
        services.length <= 3
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      ),
    [services.length]
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const selectService = (title: string) => {
    update("service", title);
    clearFieldError(setErrors, "service");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = withLegalConsent(validateConciergeForm(form), legalConsent);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    setSubmitError(null);
    const fullPhone = formatFullPhone(phoneCountryCode, form.phone);
    try {
      const response = await submitFormSubmission({
        form_type: "travel_expert_consultation",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: fullPhone,
        payload: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          service: form.service,
          message: form.message.trim(),
        },
      });
      setLeadCode(response.lead_code ?? null);
      setInquiryCode(response.inquiry_code ?? null);
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
    <>
      <PageHero {...pageHeroes.travelExpert} />
      <TrustBar />
      <div ref={sectionRef} className="travel-expert-page">
        <PageShell noPaddingTop>
          <section className="travel-expert-showcase">
            <div className="travel-expert-showcase__photos">
              {SHOWCASE_PHOTOS.map((photo, index) => (
                <div key={photo.src} className={cn("travel-expert-showcase__photo", index === 1 && "is-featured")}>
                  <SafeImage src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="travel-expert-showcase__copy">
              <p className="text-xs tracking-[0.24em] text-gold uppercase">White-glove coordination</p>
              <p className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                One team for planning, paperwork, and on-ground care.
              </p>
            </div>
          </section>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12 xl:mt-12">
            <div className="lg:col-span-7">
              <div
                className={cn(
                  "mb-8 max-w-xl transition-all duration-700",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                )}
              >
                <p className="text-xs tracking-[0.28em] text-gold uppercase">Expert services</p>
                <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-foreground">
                  How can we help?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Pick a service to begin. Your selection pre-fills the request form — our experts respond
                  within two working hours.
                </p>
              </div>

              {services.length > 0 ? (
                <div
                  className={cn(serviceGridClass, revealed ? "opacity-100" : "opacity-0", "transition-opacity duration-700 delay-100")}
                >
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={form.service === service.title}
                      onSelect={() => selectService(service.title)}
                      revealed={revealed}
                    />
                  ))}
                </div>
              ) : (
                <p className="glass rounded-2xl border border-glass-border p-6 text-sm leading-relaxed text-muted">
                  Expert services are being updated. Use the request form to describe what you need and our team
                  will respond within two working hours.
                </p>
              )}
            </div>

            <div
              className={cn(
                "flex w-full min-w-0 flex-col gap-5 lg:col-span-5 lg:sticky lg:top-[calc(var(--site-header-height)+1.25rem)] lg:self-start lg:pb-24",
                revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                "transition-all duration-700 delay-150"
              )}
            >
              <form
                id="consultation"
                onSubmit={handleSubmit}
                noValidate
                className="travel-expert-form w-full scroll-mt-[var(--site-header-height)]"
              >
                <div className="overflow-hidden rounded-[1.5rem] border border-glass-border bg-surface shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)]">
                  <div className="relative border-b border-glass-border px-6 py-5 md:px-7">
                    <SafeImage
                      src={images.travelExpertHero}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
                      loading="lazy"
                    />
                    <div className="relative">
                      <p className="text-[10px] font-bold tracking-[0.26em] text-gold uppercase">Expert request</p>
                      <h2 className="mt-2 font-display text-xl font-semibold text-foreground md:text-2xl">
                        Start your request
                      </h2>
                      {form.service ? (
                        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                          Selected
                          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold">
                            {form.service}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-6 md:p-7">
                    {submitted ? (
                      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/12">
                          <Crown size={28} className="text-gold" aria-hidden />
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Request received</h3>
                        <p className="mt-2 max-w-xs text-sm text-muted">
                          Your travel expert will reach out within 2 working hours.
                        </p>
                        <p className="mt-1 max-w-xs text-sm text-muted">
                          Save these reference codes for tracking your request.
                        </p>
                        <FormSubmissionSuccessCodes leadCode={leadCode} inquiryCode={inquiryCode} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {hasErrors(errors) ? (
                          <p
                            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                            role="alert"
                          >
                            Please correct the highlighted fields before submitting.
                          </p>
                        ) : null}
                        {submitError ? (
                          <p
                            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                            role="alert"
                          >
                            {submitError}
                          </p>
                        ) : null}
                        <FormField label="Full Name" htmlFor="concierge-name" error={errors.name}>
                          <input
                            id="concierge-name"
                            autoComplete="name"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            className={fieldInputClass("name", errors)}
                            aria-invalid={!!errors.name}
                          />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                          <FormField label="Email" htmlFor="concierge-email" error={errors.email}>
                            <input
                              id="concierge-email"
                              type="email"
                              autoComplete="email"
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                              className={fieldInputClass("email", errors)}
                              aria-invalid={!!errors.email}
                            />
                          </FormField>
                          <FormField label="Phone" htmlFor="concierge-phone" error={errors.phone}>
                            <PhoneInput
                              id="concierge-phone"
                              countryCode={phoneCountryCode}
                              onCountryCodeChange={setPhoneCountryCode}
                              value={form.phone}
                              onChange={(value) => update("phone", value)}
                              invalid={!!errors.phone}
                              className="min-h-[3rem]"
                            />
                          </FormField>
                        </div>
                        <FormField label="Service" htmlFor="concierge-service" error={errors.service}>
                          <select
                            id="concierge-service"
                            value={form.service}
                            onChange={(e) => update("service", e.target.value)}
                            className={fieldSelectClass("service", errors)}
                            aria-invalid={!!errors.service}
                          >
                            {services.length > 0 ? (
                              services.map((s) => (
                                <option key={s.id} value={s.title}>
                                  {s.title}
                                </option>
                              ))
                            ) : (
                              <option value="">General inquiry</option>
                            )}
                          </select>
                        </FormField>
                        <FormField label="Tell us more" htmlFor="concierge-message" error={errors.message}>
                          <textarea
                            id="concierge-message"
                            rows={3}
                            placeholder="Dates, destinations, group size, or special requests..."
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            className={cn(fieldInputClass("message", errors), "resize-none")}
                            aria-invalid={!!errors.message}
                          />
                        </FormField>
                        <FormLegalConsent
                          id="concierge-legal-consent"
                          checked={legalConsent}
                          onChange={(checked) => {
                            setLegalConsent(checked);
                            clearFieldError(setErrors, "legalConsent");
                          }}
                          error={errors.legalConsent}
                        />
                        <MagneticButton type="submit" variant="primary" className="w-full !py-3.5" disabled={submitting}>
                          {submitting ? "Submitting…" : "Submit to Travel Expert"}
                        </MagneticButton>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <TravelExpertDeskCard desk={desk} />
            </div>
          </div>

          <div className="mt-14 md:mt-16">
            <PageCTA />
          </div>
        </PageShell>
      </div>
    </>
  );
}
