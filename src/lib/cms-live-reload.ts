export const CMS_LIVE_CHANNEL = "traguin-cms-live";
export const CMS_IMAGE_RELOAD_KEY = "traguin-image-hard-reload";

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export function isMutatingAdminMethod(method: string | undefined): boolean {
  return MUTATING_METHODS.has((method ?? "GET").toUpperCase());
}

export function isLocalCmsImageUrl(url: string | undefined): boolean {
  return Boolean(url && /\/(?:cms-)?uploads\/media\//.test(url));
}

/** Bypass cached HTML/images so CMS photo changes show immediately. */
export function hardRefreshPage(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has("_refresh")) {
    url.searchParams.delete("_refresh");
    window.location.replace(`${url.pathname}${url.search}${url.hash}`);
    return;
  }
  window.location.reload();
}

export function notifyPublicSiteChanged(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CMS_IMAGE_RELOAD_KEY);
    const channel = new BroadcastChannel(CMS_LIVE_CHANNEL);
    channel.postMessage({ type: "cms-updated", at: Date.now() });
    channel.close();
  } catch {
    /* BroadcastChannel unavailable */
  }
}

export function shouldSkipLiveReload(): boolean {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return true;
  if (path.startsWith("/plan-my-journey") || path.startsWith("/contact")) return true;

  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el instanceof HTMLElement && el.isContentEditable;
}
