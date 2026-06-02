"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-10">
            <div className="order-1 lg:col-span-2 lg:row-start-1">
              <p className="text-xs tracking-[0.3em] text-gold uppercase">Get In Touch</p>
              <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">Contact</h1>
              <p className="mt-4 max-w-xl text-muted">
                Ready to begin your journey? Our travel architects are here to help.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="order-2 glass rounded-3xl p-6 md:p-8 lg:col-span-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:mt-27"
            >
              {submitted ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <Send size={48} className="text-gold" />
                  <h3 className="mt-4 font-display text-2xl">Message Sent</h3>
                  <p className="mt-2 text-muted">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                  </div>
                  <input
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                  />
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your dream journey..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                  />
                  <MagneticButton type="submit" variant="primary">
                    Send Message
                  </MagneticButton>
                </div>
              )}
            </form>

            <div className="order-3 space-y-8 lg:col-span-2 lg:row-start-2">
              {[
                { icon: MapPin, label: "Visit Us", value: "123 Luxury Lane, Mumbai, India 400001" },
                { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
                { icon: Mail, label: "Email Us", value: "concierge@traguin.com" },
                { icon: Clock, label: "Hours", value: "Mon–Sat: 9AM–8PM IST" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <item.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-muted uppercase">{item.label}</p>
                    <p className="mt-1 text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
