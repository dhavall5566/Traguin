const API_MEDIA_HOSTS = new Set(["api.traguin.in", "127.0.0.1", "localhost"]);

/**
 * Serve API upload files through the website origin (/cms-uploads/…)
 * so gallery and client-story images load even when api.traguin.in is blocked or misconfigured in DNS.
 */
export function toPublicMediaUrl(url: string): string {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/uploads/")) return url;
    if (!API_MEDIA_HOSTS.has(parsed.hostname)) return url;
    return `/cms-uploads${parsed.pathname.slice("/uploads".length)}`;
  } catch {
    if (url.startsWith("/uploads/")) {
      return `/cms-uploads${url.slice("/uploads".length)}`;
    }
    return url;
  }
}
