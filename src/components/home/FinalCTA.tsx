"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { images } from "@/lib/images";

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden md:min-h-screen">
      <SafeImage
        src={images.travel.replace("800", "1920")}
        alt="Luxury travel journey"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-background/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-6 text-xs tracking-[0.4em] text-gold uppercase">
          Begin Your Journey
        </p>
        <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl md:text-6xl lg:text-7xl">
          Your next journey deserves more than another vacation.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
          Connect with our travel architects for a complimentary consultation.
        </p>
        <div className="mt-10">
          <MagneticButton as="a" href="/contact" variant="primary" className="!px-8 !py-4 sm:!px-10 sm:!py-5">
            Book Consultation
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
