import { Camera, Images, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ClientPortraitWall, ClientPortraitWallHeader } from "@/components/gallery/ClientPortraitWall";
import { pageHeroes } from "@/data/pageContent";
import type { GalleryPageData } from "@/lib/api/gallery";

const galleryStats = [
  { value: "250+", label: "Journeys documented" },
  { value: "130+", label: "Destinations" },
  { value: "4K", label: "Curated frames" },
] as const;

export function GalleryPage({
  clientWall,
  galleryItems,
  galleryCategories,
}: GalleryPageData) {
  return (
    <>
      <PageHero {...pageHeroes.gallery} />
      <TrustBar />
      <PageShell noPaddingTop className="gallery-page">
        <section className="gallery-page-intro">
          <div className="gallery-page-intro__copy">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.24em] text-gold uppercase">
              <Camera size={14} aria-hidden />
              TRAGUIN visual archive
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-foreground">
              Moments from journeys designed with care.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Client portraits and destination photography from our studio — a living record of
              places, people, and the details that shape every itinerary.
            </p>
          </div>

          <dl className="gallery-page-stats">
            {galleryStats.map((stat) => (
              <div key={stat.label} className="gallery-page-stat">
                <dt className="gallery-page-stat__value">{stat.value}</dt>
                <dd className="gallery-page-stat__label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="gallery-page-section" aria-labelledby="gallery-client-wall-heading">
          <ClientPortraitWallHeader />
          <h2 id="gallery-client-wall-heading" className="sr-only">
            Client portraits
          </h2>
          <div className="mt-6">
            <ClientPortraitWall clients={clientWall} />
          </div>
        </section>

        <section className="gallery-page-section gallery-page-section--archive" aria-labelledby="gallery-archive-heading">
          <div className="gallery-archive-header">
            <div>
              <p className="inline-flex items-center gap-2 text-xs tracking-[0.24em] text-gold uppercase">
                <Images size={14} aria-hidden />
                Visual archive
              </p>
              <h2
                id="gallery-archive-heading"
                className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-foreground"
              >
                Destination frames
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Filter by mood or region. Each frame reflects a route, stay, or landscape from our
                design library.
              </p>
            </div>
            <p className="gallery-archive-header__count">
              <MapPin size={14} className="text-gold" aria-hidden />
              {galleryItems.length} curated {galleryItems.length === 1 ? "frame" : "frames"}
            </p>
          </div>

          <GalleryGrid
            className="mt-8"
            items={galleryItems}
            categories={galleryCategories}
          />
        </section>

        <div className="mt-16 md:mt-20">
          <PageCTA />
        </div>
      </PageShell>
    </>
  );
}
