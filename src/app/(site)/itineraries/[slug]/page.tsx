import { notFound, redirect } from "next/navigation";
import { resolveLegacyItineraryRedirect } from "@/lib/api/itineraries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy /itineraries/[slug] URLs redirect via CMS redirects table or destination slug lookup. */

export default async function LegacyItineraryRedirect({ params }: PageProps) {
  const { slug } = await params;
  const target = await resolveLegacyItineraryRedirect(slug);
  if (target) {
    redirect(target);
  }
  notFound();
}
