import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GalleryLazyImage } from "@/components/gallery/GalleryLazyImage";
import type { GalleryClientWallItem } from "@/lib/gallery-types";

type ClientPortraitWallProps = {
  clients: GalleryClientWallItem[];
};

export function ClientPortraitWall({ clients }: ClientPortraitWallProps) {
  if (clients.length === 0) {
    return (
      <div className="gallery-portrait-empty">
        <p className="font-display text-xl text-foreground">Client stories coming soon</p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Portraits from recent journeys will appear here as our archive grows.
        </p>
      </div>
    );
  }

  return (
    <div className="gallery-portrait-grid" aria-label="Client photo wall">
      {clients.map((client, index) => {
        const showDestination =
          client.destination.trim().length > 0 &&
          client.destination.trim().toLowerCase() !== client.name.trim().toLowerCase();

        return (
        <Link
          key={client.id}
          href="/client-stories"
          className="gallery-portrait-card group"
          aria-label={
            showDestination
              ? `View client stories, ${client.name}, ${client.destination}`
              : `View client stories, ${client.name}`
          }
        >
          <GalleryLazyImage
            src={client.image}
            alt={
              showDestination
                ? `${client.name} in ${client.destination}`
                : client.name
            }
            aspectRatio="3 / 4"
            priority={index < 4}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="gallery-portrait-card__overlay" aria-hidden />
          <div className="gallery-portrait-card__meta">
            <p className="gallery-portrait-card__name">{client.name}</p>
            {showDestination ? (
              <p className="gallery-portrait-card__destination">{client.destination}</p>
            ) : null}
          </div>
        </Link>
        );
      })}
    </div>
  );
}

export function ClientPortraitWallHeader() {
  return (
    <div className="gallery-portrait-header">
      <div>
        <p className="text-xs tracking-[0.24em] text-gold uppercase">Client memory wall</p>
        <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
          Travelers we&apos;ve designed for
        </h2>
      </div>
      <Link href="/client-stories" className="gallery-portrait-header__link">
        View all stories
        <ArrowUpRight size={14} aria-hidden />
      </Link>
    </div>
  );
}
