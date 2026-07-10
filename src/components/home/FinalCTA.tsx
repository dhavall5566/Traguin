"use client";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { images } from "@/lib/images";
import { contactInfo } from "@/data/contact";
import { primaryCta, secondaryCta } from "@/data/site";

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden md:min-h-[85svh]">
      <SafeImage
        src={images.travel.replace("800", "1920")}
        alt="Luxury travel journey"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-background/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-6 text-xs tracking-[0.4em] text-gold uppercase">Begin Your Journey</p>
        <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl md:text-6xl">
          Ready for your next extraordinary journey?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
          Let our travel designers create a personalized experience tailored exclusively for you.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton as="a" href="/contact" variant="primary" className="!px-8 !py-4">
            Connect With a Travel Expert
          </MagneticButton>
          <MagneticButton
            as="a"
            href={contactInfo.whatsappHref}
            variant="secondary"
            className="!px-8 !py-4 inline-flex items-center gap-2"
          >
            <WhatsAppIcon size={18} />
            WhatsApp Travel Expert
          </MagneticButton>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <MagneticButton as="a" href={primaryCta.href} variant="ghost" className="!text-xs">
            {primaryCta.label}
          </MagneticButton>
          <span className="text-muted/50">·</span>
          <MagneticButton as="a" href={secondaryCta.href} variant="ghost" className="!text-xs">
            {secondaryCta.label}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
