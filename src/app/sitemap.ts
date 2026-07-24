import type { MetadataRoute } from "next";
import { getAllExperienceSlugs } from "@/data/experienceDetails";
import { getAllDestinationIds } from "@/lib/destinations";
import { getAllItinerarySlugs } from "@/lib/itineraries";
import { isLuxuryStaysVisible } from "@/lib/site-features";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes = [
    "",
    "/destinations",
    "/travel-expert",
    "/about",
    "/client-stories",
    "/gallery",
    "/careers",
    "/contact",
    "/plan-my-journey",
    "/privacy-policy",
    "/terms-of-service",
    ...(isLuxuryStaysVisible() ? ["/luxury-stays"] : []),
  ];

  const dynamicRoutes = [
    ...getAllDestinationIds().map((id) => `/destinations/${id}`),
    ...getAllItinerarySlugs().map((slug) => `/itineraries/${slug}`),
    ...getAllExperienceSlugs().map((slug) => `/experiences/${slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency:
      path.startsWith("/destinations/") || path.startsWith("/itineraries/")
        ? "monthly"
        : path === ""
          ? "weekly"
          : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/destinations"
          ? 0.9
          : path.startsWith("/destinations/")
            ? 0.85
            : path.startsWith("/itineraries/")
              ? 0.8
              : 0.7,
  }));
}
