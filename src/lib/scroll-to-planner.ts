import type Lenis from "lenis";

export const PLANNER_SECTION_ID = "plan-my-journey";
export const PLANNER_SCROLL_PENDING_KEY = "traguin:scroll-to-plan-my-journey";
<<<<<<< HEAD
/** Fast animated scroll — noticeable motion without feeling slow */
=======
/** Fast animated scroll, noticeable motion without feeling slow */
>>>>>>> dhaval
export const PLANNER_SCROLL_DURATION = 1.1;
const MAX_SCROLL_ATTEMPTS = 300;

export function isPlannerHref(href: string): boolean {
  if (href === "/#plan-my-journey" || href === "#plan-my-journey") return true;
  if (href === "/#planner" || href === "#planner") return true;
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://traguin.com");
    return url.pathname === "/" && (url.hash === `#${PLANNER_SECTION_ID}` || url.hash === "#planner");
  } catch {
    return false;
  }
}

export function isHomeHref(href: string): boolean {
  if (href === "/" || href === "") return true;
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://traguin.com");
    return url.pathname === "/" && !url.hash;
  } catch {
    return false;
  }
}

export function markPlannerScrollPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PLANNER_SCROLL_PENDING_KEY, "1");
}

export function clearPlannerScrollPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PLANNER_SCROLL_PENDING_KEY);
}

export function consumePlannerScrollPending(): boolean {
  if (typeof window === "undefined") return false;
  const pending = sessionStorage.getItem(PLANNER_SCROLL_PENDING_KEY) === "1";
  if (pending) {
    sessionStorage.removeItem(PLANNER_SCROLL_PENDING_KEY);
  }
  return pending;
}

function getSiteHeaderOffset(): number {
  if (typeof window === "undefined") return 88;
  const header = document.querySelector<HTMLElement>(".site-header");
  return header?.offsetHeight ?? 88;
}

export function scrollToPlannerSection(lenis: Lenis | null, attempt = 0): boolean {
  if (typeof window === "undefined") return false;

  const target = document.getElementById(PLANNER_SECTION_ID);
  if (!target) {
    if (attempt < MAX_SCROLL_ATTEMPTS) {
      requestAnimationFrame(() => scrollToPlannerSection(lenis, attempt + 1));
    }
    return false;
  }

  const offset = -getSiteHeaderOffset();

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: PLANNER_SCROLL_DURATION,
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

export function scrollToHomeTop(lenis: Lenis | null): void {
  if (typeof window === "undefined") return;

  if (lenis) {
    lenis.scrollTo(0, { duration: 0.6, easing: (t) => 1 - Math.pow(1 - t, 3) });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
