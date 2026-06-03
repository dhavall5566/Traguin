"use client";

import { useState } from "react";
import { Sparkles, MapPin, Calendar, Users, Wallet } from "lucide-react";
import { packages } from "@/data/packages";
import { hotels } from "@/data/hotels";
import { destinations } from "@/data/destinations";
import type { TravelMood } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateAiPlannerForm,
  type FieldErrors,
} from "@/lib/form-validation";

const travelStyles: TravelMood[] = ["luxury", "adventure", "romantic", "beach", "nature"];

function getDestinationId(name: string) {
  return destinations.find((d) => d.name.toLowerCase() === name.toLowerCase())?.id;
}

function getPackagesHref(
  items: typeof packages,
  destinationQuery: string
) {
  const matchedDestination = destinations.find((d) =>
    d.name.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  if (matchedDestination) {
    return `/packages/${matchedDestination.region}?destination=${matchedDestination.id}`;
  }

  const regions = new Set(items.map((item) => item.region));
  if (regions.size === 1) {
    return `/packages/${items[0]?.region ?? "international"}`;
  }

  return "/packages/international";
}

export function AITravelPlanner() {
  const [form, setForm] = useState({
    destination: "",
    budget: "200000",
    duration: "7",
    travelers: "2",
    style: "luxury" as TravelMood,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [results, setResults] = useState<{
    packages: typeof packages;
    hotels: typeof hotels;
    destinations: typeof destinations;
  } | null>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
  };

  const generatePlan = () => {
    const nextErrors = validateAiPlannerForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const budget = parseInt(form.budget, 10);
    const filteredPackages = packages
      .filter(
        (p) =>
          p.price <= budget * 1.2 &&
          p.mood.includes(form.style) &&
          (form.destination ? p.destination.toLowerCase().includes(form.destination.toLowerCase()) : true)
      )
      .slice(0, 3);

    const filteredHotels = hotels
      .filter((h) => h.price <= budget / 5)
      .slice(0, 3);

    const filteredDestinations = destinations
      .filter((d) => d.moods.includes(form.style))
      .slice(0, 4);

    setResults({
      packages: filteredPackages.length ? filteredPackages : packages.slice(0, 3),
      hotels: filteredHotels.length ? filteredHotels : hotels.slice(0, 3),
      destinations: filteredDestinations,
    });
  };

  return (
    <section className="section-padding relative overflow-hidden bg-surface">
      <div className="absolute inset-0 luxury-gradient opacity-15" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={18} />
              <span className="text-xs tracking-[0.3em] uppercase">AI Concierge</span>
            </div>
            <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
              Plan Your Perfect Journey
            </h2>
            <p className="mt-4 text-muted">
              Tell us your preferences and our intelligent planner will craft personalized recommendations.
            </p>

            <div className="mt-8 space-y-5">
              {hasErrors(errors) && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
                  Please correct the highlighted fields before generating your plan.
                </p>
              )}
              <FormField label="Destination" htmlFor="ai-destination" icon={MapPin} error={errors.destination}>
                <input
                  id="ai-destination"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  className={fieldInputClass("destination", errors)}
                  aria-invalid={!!errors.destination}
                />
              </FormField>
              <FormField label="Budget (INR)" htmlFor="ai-budget" icon={Wallet} error={errors.budget}>
                <input
                  id="ai-budget"
                  type="number"
                  min={10000}
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  className={fieldInputClass("budget", errors)}
                  aria-invalid={!!errors.budget}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Duration (Days)" htmlFor="ai-duration" icon={Calendar} error={errors.duration}>
                  <input
                    id="ai-duration"
                    type="number"
                    min={1}
                    max={90}
                    value={form.duration}
                    onChange={(e) => update("duration", e.target.value)}
                    className={fieldInputClass("duration", errors)}
                    aria-invalid={!!errors.duration}
                  />
                </FormField>
                <FormField label="Travelers" htmlFor="ai-travelers" icon={Users} error={errors.travelers}>
                  <input
                    id="ai-travelers"
                    type="number"
                    min={1}
                    max={50}
                    value={form.travelers}
                    onChange={(e) => update("travelers", e.target.value)}
                    className={fieldInputClass("travelers", errors)}
                    aria-invalid={!!errors.travelers}
                  />
                </FormField>
              </div>

              <FormField label="Travel Style" htmlFor="ai-style">
                <div
                  id="ai-style"
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Travel style"
                >
                  {travelStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setForm({ ...form, style })}
                      className={`rounded-full px-4 py-2 text-xs capitalize transition-all ${
                        form.style === style
                          ? "bg-gold text-on-gold"
                          : "glass text-foreground hover:border-gold/30"
                      }`}
                      data-cursor="pointer"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </FormField>

              <MagneticButton onClick={generatePlan} variant="primary" className="w-full sm:w-auto">
                Generate Itinerary
              </MagneticButton>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            {!results ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                <Sparkles size={48} className="text-gold/30" />
                <p className="mt-4 text-muted">
                  Fill in your preferences to receive personalized recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <ResultSection title="Suggested Packages">
                  {results.packages.map((pkg) => {
                    const destinationId = getDestinationId(pkg.destination);
                    const packageHref = destinationId
                      ? `/packages/${pkg.region}?destination=${destinationId}`
                      : `/packages/${pkg.region}`;

                    return (
                      <div key={pkg.id} className="flex items-center gap-4 rounded-xl bg-input p-4">
                        <SafeImage src={pkg.image} alt={pkg.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground">{pkg.title}</p>
                          <p className="text-xs text-muted">{pkg.duration}</p>
                          <PriceDisplay amount={pkg.price} label={null} size="sm" />
                        </div>
                        <MagneticButton
                          as="a"
                          href={packageHref}
                          variant="secondary"
                          className="!px-4 !py-2 !text-xs shrink-0"
                        >
                          Explore
                        </MagneticButton>
                      </div>
                    );
                  })}
                  <MagneticButton
                    as="a"
                    href={getPackagesHref(results.packages, form.destination)}
                    variant="primary"
                    className="mt-4 w-full !py-3 !text-xs"
                  >
                    View All Packages
                  </MagneticButton>
                </ResultSection>

                <ResultSection title="Recommended Hotels">
                  {results.hotels.map((hotel) => (
                    <div key={hotel.id} className="flex gap-4 rounded-xl bg-input p-4">
                      <SafeImage src={hotel.image} alt={hotel.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{hotel.name}</p>
                        <p className="text-xs text-muted">{hotel.destination}</p>
                        <PriceDisplay amount={hotel.price} label={null} size="sm" suffix="/night" />
                      </div>
                    </div>
                  ))}
                  <MagneticButton
                    as="a"
                    href="/hotels"
                    variant="secondary"
                    className="mt-4 w-full !py-3 !text-xs"
                  >
                    Explore Hotels
                  </MagneticButton>
                </ResultSection>

                <ResultSection title="Destinations">
                  <div className="flex flex-wrap gap-2">
                    {results.destinations.map((d) => (
                      <span key={d.id} className="glass rounded-full px-3 py-1 text-xs">
                        {d.name}
                      </span>
                    ))}
                  </div>
                </ResultSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs tracking-[0.2em] text-gold uppercase">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
