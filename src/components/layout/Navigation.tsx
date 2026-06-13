"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLenis } from "@/components/providers/LenisContext";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";
import { navLinks, primaryCta } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.03 + i * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

function DesktopNavTrack({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden min-w-0 flex-1 lg:block" aria-label="Main sections">
      <ul className="flex items-center justify-center gap-1 xl:gap-2" role="list">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-link relative inline-flex items-center whitespace-nowrap px-2.5 py-2 text-[11px] font-medium tracking-[0.11em] uppercase transition-colors duration-300 xl:px-3 xl:text-xs",
                  active ? "nav-link--active" : "nav-link--idle"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useModalScrollLock(mobileOpen);

  useEffect(() => {
    setMounted(true);

    const readScroll = () => lenis?.scroll ?? window.scrollY;

    const onScroll = () => {
      const y = readScroll();
      setScrolled(y > 16);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
    };

    onScroll();

    if (lenis) {
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lenis]);

  const showScrolled = mounted && scrolled;
  const isHome = pathname === "/";
  const isFlushHeroPage = /^\/destinations\/[^/]+$/.test(pathname);
  const hasFlushHero = isHome || isFlushHeroPage;
  const isHeroTop = hasFlushHero && !showScrolled;

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobileMenu]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-flush-hero", hasFlushHero);
    document.documentElement.classList.toggle("nav-scrolled", showScrolled);
    return () => {
      document.documentElement.classList.remove("nav-flush-hero", "nav-scrolled");
    };
  }, [hasFlushHero, showScrolled]);

  return (
    <>
      <header
        className={cn(
          "site-header pointer-events-auto fixed inset-x-0 top-0 z-[100] w-full border-b px-[var(--layout-gutter-x)] transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isHeroTop ? "site-header--hero" : "site-header--solid"
        )}
      >
        <div className="site-container flex h-[var(--nav-height)] w-full items-center gap-3 sm:gap-4 lg:gap-6">
          <Link
            href="/"
            className="nav-bar-brand group relative z-10 shrink-0"
            aria-label="TRAGUIN home"
          >
            <Image
              src="/traguin-logo.png"
              alt="TRAGUIN"
              width={1024}
              height={386}
              className="h-7 w-auto object-contain object-left sm:h-8 md:h-9"
              priority
            />
          </Link>

          <DesktopNavTrack pathname={pathname} />

          <div className="nav-bar-actions relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <MagneticButton
              as="a"
              href={primaryCta.href}
              variant="primary"
              className="nav-cta hidden !rounded-md !px-4 !py-2.5 !text-[10px] !tracking-[0.1em] uppercase lg:inline-flex xl:!px-5 xl:!text-[11px]"
            >
              {primaryCta.label}
            </MagneticButton>
            <ThemeToggle className="nav-theme-toggle hidden !h-9 !w-9 shrink-0 md:!flex md:!h-10 md:!w-10" />
            <button
              type="button"
              className={cn(
                "nav-menu-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all duration-300 lg:hidden",
                mobileOpen && "nav-menu-btn--open"
              )}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          className="site-header-progress pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold/80"
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden
        />
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              className="nav-mobile-backdrop fixed inset-0 z-[90] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <motion.div
              key="mobile-nav-panel"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="nav-mobile-panel fixed inset-x-0 top-[var(--nav-height)] z-[95] flex max-h-[calc(100dvh-var(--nav-height))] flex-col overflow-hidden border-t lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              data-lenis-prevent
            >
              <div className="flex-1 overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-6 [-webkit-overflow-scrolling:touch]">
                <nav aria-label="Main sections">
                  <ul className="flex flex-col gap-0.5" role="list">
                    {navLinks.map((link, i) => {
                      const active = isActive(pathname, link.href);
                      return (
                        <motion.li
                          key={link.href}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={mobileLinkVariants}
                        >
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "nav-mobile-link block rounded-lg px-4 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200",
                              active ? "nav-mobile-link--active" : "nav-mobile-link--idle"
                            )}
                            onClick={closeMobileMenu}
                          >
                            {link.label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.28 }}
                  className="mt-5 border-t border-black/8 pt-5"
                >
                  <MagneticButton
                    as="a"
                    href={primaryCta.href}
                    variant="primary"
                    className="w-full !rounded-md"
                    onClick={closeMobileMenu}
                  >
                    {primaryCta.label}
                  </MagneticButton>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
