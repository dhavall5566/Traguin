import type {
  ClientStoriesPageData,
  ClientStoryReview,
} from "@/lib/api/client-stories-page";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { SafeImage } from "@/components/ui/SafeImage";
import { pageHeroes } from "@/data/pageContent";

type ClientStoriesPageProps = ClientStoriesPageData;

export function ClientStoriesPage({ photos, reviews }: ClientStoriesPageProps) {
  const hasContent = photos.length > 0 || reviews.length > 0;

  return (
    <>
      <PageHero {...pageHeroes.clientStories} />
      <TrustBar />
      <PageShell noPaddingTop>
        {!hasContent ? (
          <div className="rounded-2xl border border-glass-border bg-surface/60 px-6 py-12 text-center">
            <p className="font-medium text-foreground">Client stories coming soon</p>
            <p className="mt-2 text-sm text-muted">
              We&apos;re preparing new traveler stories. Check back shortly.
            </p>
          </div>
        ) : (
          <>
            {photos.length > 0 && (
              <div className="page-content-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.id}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-xl bg-black/5"
                  >
                    <SafeImage
                      src={photo.image}
                      alt={photo.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col justify-end p-3">
                      <p className="text-xs font-medium text-white">{photo.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviews.length > 0 && (
              <div className={photos.length > 0 ? "mt-16" : undefined}>
                <div className="page-content-grid md:grid-cols-2">
                  {reviews.map((story, index) => (
                    <ReviewCard key={`${story.id}-${index}`} story={story} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <PageCTA />
      </PageShell>
    </>
  );
}

function ReviewCard({ story }: { story: ClientStoryReview }) {
  return (
    <article className="glass rounded-2xl border border-glass-border p-6 md:p-8">
      <blockquote className="text-sm leading-relaxed text-foreground md:text-base">
        &ldquo;{story.quote}&rdquo;
      </blockquote>
      <footer className="mt-6 flex items-center gap-4 border-t border-glass-border pt-6">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <SafeImage
            src={story.image}
            alt={story.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-foreground">{story.name}</p>
          {story.destination ? (
            <p className="text-xs text-gold">{story.destination}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
