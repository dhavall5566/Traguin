"use client";

import { useState } from "react";
import {
  Crown,
  Plane,
  Building2,
  Sparkles,
  Ship,
  Briefcase,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const services = [
  {
    icon: Crown,
    title: "VIP Requests",
    description: "Exclusive access, private events, and bespoke experiences tailored to your preferences.",
  },
  {
    icon: Sparkles,
    title: "Custom Itineraries",
    description: "Every detail crafted by our travel architects for a journey uniquely yours.",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description: "Executive retreats, incentive trips, and seamless business travel management.",
  },
  {
    icon: Plane,
    title: "Private Charter",
    description: "Private jets, helicopters, and yacht charters for ultimate freedom.",
  },
  {
    icon: Building2,
    title: "Luxury Stays",
    description: "Access to the world's most exclusive hotels, villas, and private residences.",
  },
  {
    icon: Ship,
    title: "Expedition Cruises",
    description: "Ultra-luxury cruises to the world's most remote and breathtaking destinations.",
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Concierge</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Always On Demand
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Your personal luxury travel concierge — available 24/7 to fulfill every request,
            no matter how extraordinary.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8">
              {submitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <Crown size={48} className="text-gold" />
                  <h3 className="mt-4 font-display text-2xl text-foreground">Request Received</h3>
                  <p className="mt-2 text-muted">Our concierge team will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <input
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                    <input
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                    <select
                      required
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    >
                      <option value="">Select Service</option>
                      {services.map((s) => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your request..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
                    />
                  </div>
                  <MagneticButton type="submit" variant="primary" className="mt-6 w-full">
                    Submit Request
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
