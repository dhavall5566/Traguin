"use client";

import { useState } from "react";
import { Sparkles, MapPin, Calendar, Users, Wallet } from "lucide-react";
import { packages } from "@/data/packages";
import { hotels } from "@/data/hotels";
import { destinations } from "@/data/destinations";
import type { TravelMood } from "@/types";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

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
  const [results, setResults] = useState<{
    packages: typeof packages;
    hotels: typeof hotels;
    destinations: typeof destinations;
  } | null>(null);

  const generatePlan = () => {
    const budget = parseInt(form.budget);
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
              <InputField
                icon={MapPin}
                label="Destination"
                placeholder="e.g. Bali, Switzerland..."
                value={form.destination}
                onChange={(v) => setForm({ ...form, destination: v })}
              />
              <InputField
                icon={Wallet}
                label="Budget (INR)"
                type="number"
                value={form.budget}
                onChange={(v) => setForm({ ...form, budget: v })}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon={Calendar}
                  label="Duration (days)"
                  type="number"
                  value={form.duration}
                  onChange={(v) => setForm({ ...form, duration: v })}
                />
                <InputField
                  icon={Users}
                  label="Travelers"
                  type="number"
                  value={form.travelers}
                  onChange={(v) => setForm({ ...form, travelers: v })}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wide text-muted uppercase">
                  Travel Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {travelStyles.map((style) => (
                    <button
                      key={style}
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
              </div>

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
                          <p className="text-sm text-gold">{formatPrice(pkg.price)}</p>
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
                        <p className="text-sm text-gold">{formatPrice(hotel.price)}/night</p>
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

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs tracking-wide text-muted uppercase">
        <Icon size={14} className="text-gold" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold/50"
      />
    </div>
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
