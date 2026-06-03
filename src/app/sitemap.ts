import type { MetadataRoute } from "next";
import { getAllDestinationIds } from "@/lib/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://traguin.com";
  const now = new Date();

  const staticRoutes = [
    "",
    "/destinations",
    "/luxury-stays",
    "/concierge",
    "/about",
    "/client-stories",
    "/contact",
    "/login",
  ];

  const destinationRoutes = getAllDestinationIds().map((id) => `/destinations/${id}`);

  return [...staticRoutes, ...destinationRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/destinations/") ? "monthly" : path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/destinations"
          ? 0.9
          : path.startsWith("/destinations/")
            ? 0.85
            : 0.7,
  }));
}
