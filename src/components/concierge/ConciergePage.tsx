"use client";

import { useState } from "react";
import {
  Sparkles,
  FileCheck,
  Plane,
  Ship,
  Car,
  Crown,
  Briefcase,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateConciergeForm,
  type FieldErrors,
} from "@/lib/form-validation";
import { primaryCta, secondaryCta } from "@/data/site";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Sparkles,
    title: "Custom Itineraries",
    description: "Every detail crafted by our travel architects for a journey uniquely yours.",
  },
  {
    icon: FileCheck,
    title: "Visa Assistance",
    description: "Documentation, appointments, and expedited processing handled end to end.",
  },
  {
    icon: Plane,
    title: "Private Charter",
    description: "Private jets and helicopters with seamless ground coordination.",
  },
  {
    icon: Ship,
    title: "Yacht Booking",
    description: "Mediterranean, Caribbean, and Indian Ocean charters with full crew.",
  },
  {
    icon: Car,
    title: "Luxury Transfers",
    description: "Chauffeured arrivals, inter-city transfers, and VIP airport meet-and-greet.",
  },
  {
    icon: Crown,
    title: "VIP Experiences",
    description: "Exclusive access, private events, and bespoke moments worldwide.",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description: "Executive retreats, incentive trips, and seamless business travel management.",
  },
];

export function ConciergePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateConciergeForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitted(true);
  };

  return (
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Travel Concierge</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Travel Concierge
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Your personal luxury travel concierge — available to fulfill every request,
            no matter how extraordinary.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group glass rounded-2xl p-8 transition-all duration-500 hover:border-gold/30 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <service.icon size={24} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-foreground">Dedicated Consultation</h2>
              <p className="mt-4 text-muted">
                Share your vision with our concierge team. We respond within 2 hours for all VIP requests.
              </p>
              <div className="mt-8 space-y-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gold">Response Time</p>
                  <p className="font-display text-2xl text-foreground">&lt; 2 Hours</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gold">Availability</p>
                  <p className="font-display text-2xl text-foreground">24 / 7 / 365</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="glass rounded-3xl p-8">
              {submitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <Crown size={48} className="text-gold" />
                  <h3 className="mt-4 font-display text-2xl text-foreground">Request Received</h3>
                  <p className="mt-2 text-muted">Our concierge team will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {hasErrors(errors) && (
                      <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
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
                    <FormField label="Email Address" htmlFor="concierge-email" error={errors.email}>
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
                    <FormField label="Phone Number" htmlFor="concierge-phone" error={errors.phone}>
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
                    <FormField label="Service" htmlFor="concierge-service" error={errors.service}>
                      <select
                        id="concierge-service"
                        value={form.service}
                        onChange={(e) => update("service", e.target.value)}
                        className={fieldInputClass("service", errors)}
                        aria-invalid={!!errors.service}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {services.map((s) => (
                          <option key={s.title} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Message" htmlFor="concierge-message" error={errors.message}>
                      <textarea
                        id="concierge-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={cn(fieldInputClass("message", errors), "resize-none")}
                        aria-invalid={!!errors.message}
                      />
                    </FormField>
                  </div>
                  <MagneticButton type="submit" variant="primary" className="mt-6 w-full">
                    Request Concierge Service
                  </MagneticButton>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
