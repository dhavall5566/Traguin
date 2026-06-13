import type { CSSProperties } from "react";
import { Camera, Film, Images, Play, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageShell } from "@/components/layout/PageShell";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SafeImage } from "@/components/ui/SafeImage";
import { galleryClientWall, galleryMoments, type GalleryMoment } from "@/data/gallery";
import { pageHeroes } from "@/data/pageContent";

const galleryStats = [
  { value: "250+", label: "journeys documented" },
  { value: "15+", label: "destinations framed" },
  { value: "4K", label: "photo-led inspiration" },
] as const;

export function GalleryPage() {
  const filmMoments = galleryMoments.filter((moment) => moment.type === "video");

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

            <div className="gallery-client-collage" aria-label="Client photo wall">
              {galleryClientWall.map((client, index) => (
                <article
                  key={client.id}
                  className="gallery-hanging-photo gallery-hanging-photo--collage group"
                  style={
                    {
                      "--rotate": `${client.rotate}deg`,
                      "--index": index,
                    } as CSSProperties
                  }
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
                    <h3 className="font-body text-sm font-semibold text-foreground">{client.destination}</h3>
                    <p className="mt-1 text-[0.68rem] text-muted">{client.tripType}</p>
                  </div>
                </article>
              ))}
            </div>
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

          <GalleryGrid className="mt-8" />
        </section>

        <section className="mt-16 md:mt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs tracking-[0.24em] text-gold uppercase">
                <Film size={14} aria-hidden />
                Short Films
              </p>
              <h2 className="mt-3 font-display text-3xl text-foreground md:text-5xl">Cinematic moments</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              Moving postcards from private arrivals, destination tables, and the atmosphere around
              a journey.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filmMoments.map((moment) => (
              <GalleryMomentCard key={moment.id} moment={moment} compact />
            ))}
          </div>
        </section>

        <PageCTA />
      </PageShell>
    </>
  );
}

function GalleryMomentCard({ moment, compact = false }: { moment: GalleryMoment; compact?: boolean }) {
  const isVideo = moment.type === "video";
  const image = isVideo ? moment.poster : moment.image;

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[1.5rem] border border-glass-border bg-surface shadow-[0_18px_50px_-32px_rgba(0,0,0,0.45)]",
        compact ? "min-h-[20rem]" : "min-h-[18rem]",
      ].join(" ")}
    >
      {isVideo ? (
        <video
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          poster={image}
          muted
          loop
          playsInline
          preload="metadata"
          controls
        >
          <source src={moment.src} type="video/mp4" />
        </video>
      ) : (
        <SafeImage
          src={image}
          alt={moment.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
      {isVideo && (
        <div className="pointer-events-none absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md">
          <Play size={17} fill="currentColor" aria-hidden />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.2em] text-gold-light uppercase">
          {isVideo ? <Film size={13} aria-hidden /> : <Camera size={13} aria-hidden />}
          {moment.destination}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight">{moment.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/78">{moment.caption}</p>
      </div>
    </article>
  );
}
