"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useEffect, useCallback } from "react";
>>>>>>> dhaval
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
<<<<<<< HEAD
=======
import { useLenis } from "@/components/providers/LenisContext";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";
>>>>>>> dhaval
import { navLinks, primaryCta } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const mobileLinkVariants = {
<<<<<<< HEAD
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 + i * 0.035, duration: 0.28, ease: "easeOut" as const },
  }),
};

const tabSpring = { type: "spring" as const, stiffness: 400, damping: 34 };

function DesktopNavTrack({ pathname }: { pathname: string }) {
  return (
    <nav className="nav-links-track w-full min-w-0" aria-label="Main sections">
      <ul className="flex w-full items-stretch p-1" role="list">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href} className="relative min-w-0 flex-1">
              {active && (
                <motion.span
                  layoutId="nav-active-tab"
                  className="nav-active-bubble absolute inset-0 rounded-full"
                  transition={tabSpring}
                  aria-hidden
                />
              )}
=======
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
>>>>>>> dhaval
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
<<<<<<< HEAD
                  "nav-link-pill relative z-[1] flex h-full min-h-[2.75rem] items-center justify-center rounded-full px-1 py-2.5 text-center text-[13px] font-medium tracking-wide transition-colors duration-200 sm:text-sm xl:text-[15px]",
                  active ? "nav-link-pill--active" : "nav-link-pill--idle"
                )}
              >
                <span className="truncate">{link.label}</span>
=======
                  "nav-link relative inline-flex items-center whitespace-nowrap px-2.5 py-2 text-[11px] font-medium tracking-[0.11em] uppercase transition-colors duration-300 xl:px-3 xl:text-xs",
                  active ? "nav-link--active" : "nav-link--idle"
                )}
              >
                {link.label}
>>>>>>> dhaval
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
<<<<<<< HEAD
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
=======
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
>>>>>>> dhaval

  const showScrolled = mounted && scrolled;
  const isHome = pathname === "/";
  const isFlushHeroPage = /^\/destinations\/[^/]+$/.test(pathname);
  const hasFlushHero = isHome || isFlushHeroPage;
<<<<<<< HEAD
  const isMinimal = showScrolled && !navHovered && !mobileOpen;
  const isExpanded = showScrolled && (navHovered || mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-scrolled", showScrolled);
    document.documentElement.classList.toggle("nav-flush-hero", hasFlushHero);
    return () => {
      document.documentElement.classList.remove("nav-scrolled", "nav-flush-hero");
    };
  }, [showScrolled, hasFlushHero]);
=======
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
>>>>>>> dhaval

  return (
    <>
      <header
        className={cn(
<<<<<<< HEAD
          "site-header pointer-events-auto fixed top-0 right-0 left-0 z-[100] transition-[padding,background,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          showScrolled ? "px-3 pt-3 md:px-5 md:pt-4" : "px-3 pt-4 md:px-6 md:pt-5",
          showScrolled && "site-header--scrolled"
        )}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        <div
          className={cn(
            "nav-bar pointer-events-auto mx-auto flex max-w-[90rem] items-center gap-3 rounded-3xl border px-3 py-2.5 sm:px-4 md:gap-5 md:rounded-full md:px-4 md:py-2",
            showScrolled && "nav-bar--scrolled",
            isMinimal && "nav-bar--minimal",
            isExpanded && "nav-bar--expanded"
          )}
        >
          <Link
            href="/"
            className="nav-bar-brand nav-chrome-hideable group relative z-10 w-[6.5rem] shrink-0 pl-0.5 sm:w-[7.25rem] md:w-[8rem]"
            aria-label="TRAGUIN home"
          >
            <span className="logo-wrap block transition-opacity duration-[420ms] group-hover:opacity-90">
              <Image
                src="/traguin-logo.png"
                alt="TRAGUIN"
                width={1024}
                height={386}
                className="h-7 w-auto object-contain object-left sm:h-8 md:h-9"
                priority
              />
            </span>
          </Link>

          <div className="nav-bar-links hidden min-w-0 flex-1 items-center lg:flex lg:px-2">
            <DesktopNavTrack pathname={pathname} />
          </div>

          <div className="nav-bar-actions relative z-10 ml-auto flex min-w-[2.25rem] shrink-0 items-center justify-end gap-2 md:min-w-[11.5rem] md:gap-2.5">
=======
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
>>>>>>> dhaval
            <MagneticButton
              as="a"
              href={primaryCta.href}
              variant="primary"
<<<<<<< HEAD
              className="nav-chrome-hideable hidden !px-5 !py-2.5 !text-xs lg:inline-flex"
            >
              {primaryCta.label}
            </MagneticButton>
            <ThemeToggle className="nav-chrome-hideable hidden !h-9 !w-9 md:!flex md:!h-10 md:!w-10" />
            <button
              type="button"
              className={cn(
                "nav-menu-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
                mobileOpen && "nav-menu-btn--open",
                mobileOpen
                  ? "border-gold/50 bg-gold text-on-gold"
                  : "border-glass-border bg-glass text-foreground hover:border-gold/35"
              )}
              onClick={() => setMobileOpen((o) => !o)}
=======
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
>>>>>>> dhaval
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
<<<<<<< HEAD
=======

        <div
          className="site-header-progress pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold/80"
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden
        />
>>>>>>> dhaval
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
<<<<<<< HEAD
              type="button"
              className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-md lg:hidden"
=======
              key="mobile-nav-backdrop"
              type="button"
              className="nav-mobile-backdrop fixed inset-0 z-[90] lg:hidden"
>>>>>>> dhaval
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-label="Close menu"
<<<<<<< HEAD
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
=======
              onClick={closeMobileMenu}
            />
            <motion.div
              key="mobile-nav-panel"
>>>>>>> dhaval
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
<<<<<<< HEAD
              className="nav-mobile-panel fixed inset-x-3 top-[var(--site-header-height)] z-[90] flex max-h-[calc(100dvh-var(--site-header-height)-1rem)] flex-col overflow-hidden rounded-3xl border border-glass-border shadow-2xl lg:hidden"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="nav-links-track mb-4 rounded-2xl p-1.5" aria-label="Main sections">
                  <ul className="flex flex-col gap-1" role="list">
=======
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
>>>>>>> dhaval
                    {navLinks.map((link, i) => {
                      const active = isActive(pathname, link.href);
                      return (
                        <motion.li
                          key={link.href}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={mobileLinkVariants}
<<<<<<< HEAD
                          className="relative"
                        >
                          {active && (
                            <motion.span
                              layoutId="nav-active-tab-mobile"
                              className="nav-active-bubble absolute inset-0 rounded-xl"
                              transition={tabSpring}
                              aria-hidden
                            />
                          )}
=======
                        >
>>>>>>> dhaval
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
<<<<<<< HEAD
                              "relative z-[1] block rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-200",
                              active ? "nav-link-pill--active" : "nav-link-pill--idle"
                            )}
                            onClick={() => setMobileOpen(false)}
=======
                              "nav-mobile-link block rounded-lg px-4 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200",
                              active ? "nav-mobile-link--active" : "nav-mobile-link--idle"
                            )}
                            onClick={closeMobileMenu}
>>>>>>> dhaval
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
<<<<<<< HEAD
                  transition={{ delay: 0.28, duration: 0.25 }}
                  className="border-t border-glass-border pt-4"
=======
                  transition={{ delay: 0.22, duration: 0.28 }}
                  className="mt-5 border-t border-black/8 pt-5"
>>>>>>> dhaval
                >
                  <MagneticButton
                    as="a"
                    href={primaryCta.href}
                    variant="primary"
<<<<<<< HEAD
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
=======
                    className="w-full !rounded-md"
                    onClick={closeMobileMenu}
>>>>>>> dhaval
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
