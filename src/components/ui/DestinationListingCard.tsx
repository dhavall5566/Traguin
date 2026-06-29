"use client";

import { DestinationCard } from "@/components/ui/DestinationCard";
import { DestinationHubCard } from "@/components/ui/DestinationHubCard";

export type DestinationListingCardProps = {
  destinationId: string;
  name: string;
  description: string;
  image: string;
  href: string;
  regionLabel?: string;
  location?: string;
  startingPrice?: number;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  cta?: string;
  journeyCount: number;
  tilt?: boolean;
  className?: string;
};

export function DestinationListingCard({
  journeyCount,
  destinationId,
  name,
  description,
  image,
  href,
  regionLabel,
  location,
  startingPrice,
  duration,
  rating,
  reviewCount,
  cta,
  tilt,
  className,
}: DestinationListingCardProps) {
  if (journeyCount > 1) {
    return (
      <DestinationHubCard
        destinationId={destinationId}
        name={name}
        description={description}
        image={image}
        href={href}
        regionLabel={regionLabel}
        journeyCount={journeyCount}
        startingPrice={startingPrice}
        className={className}
        tilt={tilt}
      />
    );
  }

  return (
    <DestinationCard
      destinationId={destinationId}
      name={name}
      description={description}
      image={image}
      href={href}
      regionLabel={regionLabel}
      location={location}
      startingPrice={startingPrice}
      duration={duration}
      rating={rating}
      reviewCount={reviewCount}
      cta={cta}
      tilt={tilt}
      className={className}
    />
  );
}
