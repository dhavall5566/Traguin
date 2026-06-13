"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  FileCheck,
  Plane,
  Ship,
  Car,
  Crown,
  Briefcase,
  Clock,
  Headphones,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateConciergeForm,
  type FieldErrors,
} from "@/lib/form-validation";
import { contactInfo } from "@/data/contact";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { pageHeroes } from "@/data/pageContent";

const services = [
  {
    icon: Sparkles,
    title: "Bespoke Journeys",
    description: "Routes shaped around your rhythm, stays, pacing, and moments no brochure can offer.",
    span: "lg:col-span-3 lg:row-span-2",
    image: images.experiencePrivateLuxe,
    number: "01",
    featured: true,
  },
  {
    icon: FileCheck,
    title: "Visa & Documentation",
    description: "Paperwork, appointments, and approvals cleared before you ever pack a bag.",
    span: "lg:col-span-3",
    image: images.singapore,
    number: "02",
  },
  {
    icon: Plane,
    title: "Sky & Charter",
    description: "Jets, helicopters, and aerial transfers stitched into one seamless arrival.",
    span: "lg:col-span-3",
    image: images.switzerland,
    number: "03",
  },
  {
    icon: Ship,
    title: "Yacht & Sea",
    description: "Crewed charters across the Med, Caribbean, and Indian Ocean, horizon as your suite.",
    span: "lg:col-span-2",
    image: images.beach,
    number: "04",
  },
  {
    icon: Car,
    title: "Chauffeur Arrivals",
    description: "From tarmac to threshold, private transfers, meet-and-greet, and city-to-city ease.",
    span: "lg:col-span-2",
    image: images.dubai,
    number: "05",
  },
  {
    icon: Crown,
    title: "Private Access",
    description: "After-hours entries, closed-door tables, and invitations reserved for your circle alone.",
    span: "lg:col-span-2",
    image: images.bali,
    number: "06",
  },
  {
    icon: Briefcase,
    title: "Corporate & MICE",
    description: "Leadership retreats, incentive travel, and board-level programs run without a single loose end.",
    span: "lg:col-span-6",
    image: images.experienceCorporate,
    number: "07",
    wide: true,
  },
] as const;

type ServiceItem = (typeof services)[number];

function ServiceBentoCard({
  service,
  isSelected,
  onSelect,
  revealed,
  index,
}: {
  service: ServiceItem;
  isSelected: boolean;
  onSelect: () => void;
  revealed: boolean;
  index: number;
}) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "travel-expert-service-card group relative flex h-full w-full overflow-hidden rounded-[1.5rem] border text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        service.span,
        "featured" in service && service.featured && "travel-expert-service-card--featured min-h-[18rem] lg:min-h-0",
        "wide" in service && service.wide && "travel-expert-service-card--wide min-h-[12rem]",
        isSelected
          ? "border-gold/55 shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--gold)_45%,transparent)]"
          : "border-glass-border hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_50px_-28px_color-mix(in_srgb,var(--gold)_30%,transparent)]",
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: revealed ? `${120 + index * 60}ms` : "0ms" }}
      aria-pressed={isSelected}
    >
      <SafeImage
        src={service.image}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "featured" in service && service.featured
            ? "opacity-40 group-hover:scale-[1.03] lg:opacity-50"
            : "opacity-30 group-hover:scale-105",
          "wide" in service && service.wide && "object-[center_30%]"
        )}
        loading="lazy"
      />
      <div
        className={cn(
          "absolute inset-0",
          "featured" in service && service.featured
            ? "bg-gradient-to-r from-background/92 via-background/78 to-background/35 lg:from-background/88 lg:via-background/55 lg:to-transparent"
            : "wide" in service && service.wide
              ? "bg-gradient-to-r from-background/94 via-background/82 to-background/45"
              : "bg-gradient-to-t from-background via-background/88 to-background/55"
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex h-full w-full",
          "featured" in service && service.featured && "flex-col justify-end p-6 md:p-7 lg:grid lg:grid-cols-2 lg:items-end lg:gap-6 lg:p-8",
          "wide" in service && service.wide && "flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-7",
          !("featured" in service && service.featured) &&
            !("wide" in service && service.wide) &&
            "flex-col justify-between p-5 md:p-6"
        )}
      >
        {"featured" in service && service.featured && (
          <div className="hidden overflow-hidden rounded-[1.15rem] border border-white/10 lg:block lg:min-h-[14rem]">
            <SafeImage
              src={service.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
        )}

        <div className={cn("wide" in service && service.wide && "max-w-xl")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.24em] text-gold/80">
                #{service.number}
              </span>
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm transition-colors",
                  isSelected
                    ? "border-gold/40 bg-gold/20 text-gold"
                    : "border-white/15 bg-background/35 text-gold group-hover:bg-gold/12"
                )}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden />
              </span>
            </div>
            {isSelected ? (
              <span className="rounded-full border border-gold/35 bg-gold/12 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-gold uppercase">
                Selected
              </span>
            ) : (
              <span className="rounded-full border border-glass-border bg-background/40 px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-muted uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Select
              </span>
            )}
          </div>

          <h3
            className={cn(
              "mt-4 font-display font-semibold tracking-tight text-foreground",
              "featured" in service && service.featured ? "text-2xl md:text-[1.75rem] lg:text-3xl" : "text-lg",
              "wide" in service && service.wide && "text-xl md:text-2xl"
            )}
          >
            {service.title}
          </h3>
          <p
            className={cn(
              "mt-2 leading-relaxed text-muted",
              "featured" in service && service.featured ? "max-w-md text-sm md:text-[15px]" : "text-sm",
              "wide" in service && service.wide && "max-w-2xl text-sm md:text-[15px]"
            )}
          >
            {service.description}
          </p>
        </div>

        {"wide" in service && service.wide && (
          <div className="hidden h-24 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:block md:h-28 md:w-48">
            <SafeImage
              src={service.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <span
        className={cn(
          "absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent transition-all duration-500",
          isSelected ? "w-full" : "w-0 group-hover:w-full"
        )}
        aria-hidden
      />
    </button>
  );
}

function TravelExpertDeskCard() {
  return (
    <div className="travel-expert-desk-card w-full min-w-0">
      <span className="travel-expert-desk-online">
        <span className="travel-expert-desk-online-dot" aria-hidden />
        Online now
      </span>

      <div className="travel-expert-desk-header">
        <p className="text-[10px] font-bold tracking-[0.32em] text-gold uppercase">Travel Experts</p>
        <h3 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-foreground">
          Always Here For You
        </h3>
        <span className="travel-expert-desk-rule" aria-hidden />
      </div>

      <div className="travel-expert-desk-stats">
        <div className="travel-expert-desk-stat">
          <div className="travel-expert-desk-stat-icon">
            <Clock size={22} aria-hidden />
          </div>
          <p className="font-display text-[clamp(2.5rem,6vw,3.25rem)] font-semibold leading-none text-foreground">
            2
          </p>
          <p className="mt-2 text-[10px] font-bold tracking-[0.22em] text-foreground uppercase">
            Working hours
          </p>
          <p className="mt-1.5 text-xs text-muted">First expert reply</p>
        </div>

        <div className="travel-expert-desk-stat-divider" aria-hidden />

        <div className="travel-expert-desk-stat">
          <div className="relative travel-expert-desk-stat-icon">
            <Headphones size={22} aria-hidden />
            <span className="travel-expert-card-live" aria-hidden />
          </div>
          <p className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-semibold leading-none text-foreground">
            24·7·365
          </p>
          <p className="mt-2 text-[10px] font-bold tracking-[0.22em] text-foreground uppercase">
            Live desk
          </p>
          <p className="mt-1.5 text-xs text-muted">Experts on call now</p>
        </div>
      </div>

      <div className="travel-expert-desk-actions">
        <a
          href={contactInfo.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="travel-expert-desk-btn travel-expert-desk-btn--whatsapp"
        >
          <MessageCircle size={17} aria-hidden />
          WhatsApp Expert
        </a>
        <a href={contactInfo.phoneHref} className="travel-expert-desk-btn travel-expert-desk-btn--call">
          <Phone size={17} aria-hidden />
          Speak With Expert
        </a>
      </div>
    </div>
  );
}

export function ConciergePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    service: services[0].title,
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

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
      { threshold: 0.08 }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateConciergeForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitted(true);
  };

  return (
    <>
      <PageHero {...pageHeroes.travelExpert} />
      <TrustBar />
      <div ref={sectionRef} className="travel-expert-page">
        <PageShell noPaddingTop>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <div className="lg:col-span-7">
            <div
              className={cn(
                "travel-expert-bento grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6",
                revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                "transition-all duration-700 delay-200"
              )}
            >
              {services.map((service, index) => (
                <ServiceBentoCard
                  key={service.title}
                  service={service}
                  isSelected={form.service === service.title}
                  onSelect={() => selectService(service.title)}
                  revealed={revealed}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(
              "flex w-full min-w-0 flex-col gap-4 lg:col-span-5",
              revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
              "transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}
          >
          <form
            id="consultation"
            onSubmit={handleSubmit}
            noValidate
            className="travel-expert-form w-full min-w-0 scroll-mt-[var(--site-header-height)]"
          >
            <div className="w-full overflow-hidden rounded-[1.75rem] border border-glass-border bg-surface/92 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="border-b border-glass-border bg-[color-mix(in_srgb,var(--gold)_7%,var(--surface))] px-6 py-5 md:px-8">
                <p className="text-[10px] font-bold tracking-[0.28em] text-gold uppercase">
                  Expert Request
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  Start your request
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Selected: <span className="font-medium text-foreground">{form.service}</span>
                </p>
              </div>

              <div className="p-6 md:p-8">
                {submitted ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/12">
                      <Crown size={32} className="text-gold" aria-hidden />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                      Request received
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-muted">
                      Your travel expert will reach out within 2 working hours.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hasErrors(errors) && (
                      <p
                        className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                        role="alert"
                      >
                        Please correct the highlighted fields before submitting.
                      </p>
                    )}
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
                    <div className="grid gap-4 sm:grid-cols-2">
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
                        <input
                          id="concierge-phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className={fieldInputClass("phone", errors)}
                          aria-invalid={!!errors.phone}
                        />
                      </FormField>
                    </div>
                    <FormField label="Service" htmlFor="concierge-service" error={errors.service}>
                      <select
                        id="concierge-service"
                        value={form.service}
                        onChange={(e) => update("service", e.target.value)}
                        className={fieldInputClass("service", errors)}
                        aria-invalid={!!errors.service}
                      >
                        {services.map((s) => (
                          <option key={s.title} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Tell us more" htmlFor="concierge-message" error={errors.message}>
                      <textarea
                        id="concierge-message"
                        rows={4}
                        placeholder="Dates, destinations, group size, or special requests..."
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={cn(fieldInputClass("message", errors), "resize-none")}
                        aria-invalid={!!errors.message}
                      />
                    </FormField>
                    <MagneticButton type="submit" variant="primary" className="w-full !py-4">
                      Submit to Travel Expert
                    </MagneticButton>
                  </div>
                )}
              </div>
            </div>
          </form>

          <TravelExpertDeskCard />
          </div>
          </div>
          <PageCTA />
        </PageShell>
      </div>
    </>
  );
}
