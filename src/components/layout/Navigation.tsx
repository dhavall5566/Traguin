"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, primaryCta } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const mobileLinkVariants = {
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
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-link-pill relative z-[1] flex h-full min-h-[2.75rem] items-center justify-center rounded-full px-1 py-2.5 text-center text-[13px] font-medium tracking-wide transition-colors duration-200 sm:text-sm xl:text-[15px]",
                  active ? "nav-link-pill--active" : "nav-link-pill--idle"
                )}
              >
                <span className="truncate">{link.label}</span>
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

  const showScrolled = mounted && scrolled;
  const isHome = pathname === "/";
  const isFlushHeroPage = /^\/destinations\/[^/]+$/.test(pathname);
  const hasFlushHero = isHome || isFlushHeroPage;
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

  return (
    <>
      <header
        className={cn(
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
            <MagneticButton
              as="a"
              href={primaryCta.href}
              variant="primary"
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
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-md lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="nav-mobile-panel fixed inset-x-3 top-[var(--site-header-height)] z-[90] flex max-h-[calc(100dvh-var(--site-header-height)-1rem)] flex-col overflow-hidden rounded-3xl border border-glass-border shadow-2xl lg:hidden"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="nav-links-track mb-4 rounded-2xl p-1.5" aria-label="Main sections">
                  <ul className="flex flex-col gap-1" role="list">
                    {navLinks.map((link, i) => {
                      const active = isActive(pathname, link.href);
                      return (
                        <motion.li
                          key={link.href}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={mobileLinkVariants}
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
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "relative z-[1] block rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-200",
                              active ? "nav-link-pill--active" : "nav-link-pill--idle"
                            )}
                            onClick={() => setMobileOpen(false)}
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
                  transition={{ delay: 0.28, duration: 0.25 }}
                  className="border-t border-glass-border pt-4"
                >
                  <MagneticButton
                    as="a"
                    href={primaryCta.href}
                    variant="primary"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
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
