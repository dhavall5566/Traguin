import type { CSSProperties } from "react";
import Link from "next/link";
import { Images, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SafeImage } from "@/components/ui/SafeImage";
import { pageHeroes } from "@/data/pageContent";
import type { GalleryPageData } from "@/lib/api/gallery";

const galleryStats = [
  { value: "250+", label: "journeys documented" },
  { value: "15+", label: "destinations framed" },
  { value: "4K", label: "photo-led inspiration" },
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
      <PageShell noPaddingTop>
        <section className="gallery-studio relative overflow-hidden rounded-[2rem] border border-glass-border p-5 sm:p-8 md:p-10 lg:p-12">
          <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-gold/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-4 h-64 w-64 rounded-full bg-foreground/[0.04] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.22em] text-gold uppercase">
                <Sparkles size={14} aria-hidden />
                Client Memory Wall
              </p>
              <h2 className="mt-5 font-display text-[clamp(2.15rem,5vw,4.35rem)] leading-[0.98] tracking-tight text-foreground">
                Travel stories, pinned like art.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
                Portraits, places, and private moments from journeys designed with a personal
                rhythm. This is the human side of the TRAGUIN archive.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {galleryStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-glass-border bg-surface/65 p-4">
                    <p className="font-display text-2xl text-foreground">{stat.value}</p>
                    <p className="mt-1 text-[0.65rem] tracking-[0.16em] text-muted uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {clientWall.length > 0 ? (
              <div className="gallery-client-collage" aria-label="Client photo wall">
                {clientWall.map((client, index) => (
                  <Link
                    key={client.id}
                    href="/client-stories"
                    className="gallery-hanging-photo gallery-hanging-photo--collage group"
                    style={
                      {
                        "--rotate": `${client.rotate}deg`,
                        "--index": index,
                      } as CSSProperties
                    }
                    aria-label={`View client stories, ${client.name}, ${client.destination}`}
                  >
                    <span className="gallery-hanging-photo__pin" aria-hidden />
                    <div className="aspect-[4/5] overflow-hidden rounded-[1.05rem] bg-background">
                      <SafeImage
                        src={client.image}
                        alt={`${client.name} in ${client.destination}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="font-body text-sm font-semibold text-foreground">{client.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-glass-border bg-surface/40 px-6 py-16 text-center">
                <p className="font-display text-lg text-foreground">Client stories coming soon</p>
                <p className="mt-2 text-sm text-muted">
                  Portraits from recent journeys will appear here as our archive grows.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="gallery-section-heading">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.24em] text-gold uppercase">
              <Images size={14} aria-hidden />
              Visual Archive
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-[0.8fr_1fr] md:items-end">
              <h2 className="font-display text-3xl leading-tight text-foreground md:text-5xl">
                Destination frames with room to breathe.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted md:justify-self-end">
                A curated, filterable wall of places, textures, routes, and stays that shape our
                travel design language.
              </p>
            </div>
          </div>

          <GalleryGrid
            className="mt-8"
            items={galleryItems}
            categories={galleryCategories}
          />
        </section>

        <PageCTA />
      </PageShell>
    </>
  );
}
