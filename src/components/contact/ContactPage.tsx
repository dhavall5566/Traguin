"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/providers/LenisContext";
import { scrollToConsultationSection } from "@/lib/scroll-to-consultation";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
<<<<<<< HEAD
=======
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
>>>>>>> dhaval
import {
  clearFieldError,
  hasErrors,
  validateContactForm,
  type FieldErrors,
} from "@/lib/form-validation";
import { contactInfo } from "@/data/contact";
<<<<<<< HEAD
=======
import { pageHeroes } from "@/data/pageContent";
>>>>>>> dhaval
import { cn } from "@/lib/utils";

const contactItems = [
  { icon: Phone, label: "Call", value: contactInfo.phone, href: contactInfo.phoneHref },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: contactInfo.whatsapp,
    href: contactInfo.whatsappHref,
  },
  { icon: Mail, label: "Email", value: contactInfo.email, href: contactInfo.emailHref },
  { icon: MapPin, label: "Office", value: contactInfo.address },
  { icon: Clock, label: "Business Hours", value: contactInfo.hours },
] as const;

export function ContactPage() {
  const { lenis } = useLenis();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const scrollToForm = () => scrollToConsultationSection(lenis);
    scrollToForm();

    const timers = [0, 120, 350, 700].map((delay) => window.setTimeout(scrollToForm, delay));
    window.addEventListener("hashchange", scrollToForm);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", scrollToForm);
    };
  }, [lenis]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitted(true);
  };

  return (
<<<<<<< HEAD
    <div className="pb-16 pt-12 md:pb-20 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-10">
            <div className="lg:col-span-2">
              <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">Contact</h1>
              <p className="mt-4 max-w-xl text-muted">
                Speak with our travel designers for a complimentary planning session with a TRAGUIN
                travel expert.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <MagneticButton
                  as="a"
                  href={contactInfo.whatsappHref}
                  variant="primary"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp Travel Expert
                </MagneticButton>
                <MagneticButton as="a" href={contactInfo.phoneHref} variant="secondary">
                  Call Us
                </MagneticButton>
              </div>

              <div className="mt-8 space-y-6">
=======
    <>
      <PageHero {...pageHeroes.contact} />
      <TrustBar />
      <PageShell noPaddingTop>
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-10">
          <div className="lg:col-span-2">
            <p className="text-xs tracking-[0.28em] text-gold uppercase">Reach us directly</p>
            <p className="mt-4 max-w-xl text-muted">
              Prefer a direct line? Call, message, or visit our Ahmedabad studio, we are here six days a week.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <MagneticButton
                as="a"
                href={contactInfo.whatsappHref}
                variant="primary"
                className="inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp Travel Expert
              </MagneticButton>
              <MagneticButton as="a" href={contactInfo.phoneHref} variant="secondary">
                Call Us
              </MagneticButton>
            </div>

            <div className="mt-8 space-y-6">
>>>>>>> dhaval
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                      <item.icon size={20} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs tracking-wide text-muted uppercase">{item.label}</p>
                      {"href" in item && item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 block text-foreground transition-colors hover:text-gold"
                          {...(item.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              id="consultation"
              onSubmit={handleSubmit}
              noValidate
              className="glass scroll-mt-[var(--site-header-height)] rounded-3xl p-6 md:p-8 lg:col-span-3 lg:col-start-3 lg:row-span-2"
            >
<<<<<<< HEAD
              <h2 className="font-display text-2xl text-foreground">CONSULTATION Request</h2>
=======
              <h2 className="font-display text-2xl text-foreground">Consultation request</h2>
>>>>>>> dhaval
              <p className="mt-2 text-sm text-muted">We respond within 2 working hours.</p>
              {submitted ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                  <Send size={48} className="text-gold" />
                  <h3 className="mt-4 font-display text-2xl">Message Sent</h3>
                  <p className="mt-2 text-muted">We&apos;ll be in touch within 2 working hours.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {hasErrors(errors) && (
                    <p
                      className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
                      role="alert"
                    >
                      Please correct the highlighted fields before submitting.
                    </p>
                  )}
                  <FormField label="Full Name" htmlFor="contact-name" error={errors.name}>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={fieldInputClass("name", errors)}
                      aria-invalid={!!errors.name}
                    />
                  </FormField>
                  <FormField label="Email" htmlFor="contact-email" error={errors.email}>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={fieldInputClass("email", errors)}
                      aria-invalid={!!errors.email}
                    />
                  </FormField>
                  <FormField label="Phone Number" htmlFor="contact-phone" error={errors.phone}>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={fieldInputClass("phone", errors)}
                      aria-invalid={!!errors.phone}
                    />
                  </FormField>
                  <FormField label="Message" htmlFor="contact-message" error={errors.message}>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className={cn(fieldInputClass("message", errors), "resize-none")}
                      aria-invalid={!!errors.message}
                    />
                  </FormField>
                  <MagneticButton type="submit" variant="primary">
                    Connect With a Travel Expert
                  </MagneticButton>
                </div>
              )}
            </form>
<<<<<<< HEAD
          </div>
        </div>
      </div>
    </div>
=======
        </div>

        <PageCTA />
      </PageShell>
    </>
>>>>>>> dhaval
  );
}
