import type Lenis from "lenis";

export const CONSULTATION_SECTION_ID = "consultation";

function getSiteHeaderOffset(): number {
  if (typeof window === "undefined") return 88;
  const header = document.querySelector<HTMLElement>(".site-header");
  return header?.offsetHeight ?? 88;
}

export function isConsultationHref(href: string): boolean {
  if (href === "/contact#consultation" || href === "#consultation") return true;
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://traguin.com");
    return url.pathname === "/contact" && url.hash === `#${CONSULTATION_SECTION_ID}`;
  } catch {
    return false;
  }
}

export function scrollToConsultationSection(lenis: Lenis | null, attempt = 0): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.hash !== `#${CONSULTATION_SECTION_ID}`) return false;

  const target = document.getElementById(CONSULTATION_SECTION_ID);
  if (!target) {
    if (attempt < 120) {
      requestAnimationFrame(() => scrollToConsultationSection(lenis, attempt + 1));
    }
    return false;
  }

  const offset = -getSiteHeaderOffset();

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      force: true,
    });
    return true;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}
