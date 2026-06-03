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
import { useTheme } from "@/components/providers/ThemeProvider";
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
    transition: { delay: 0.05 + i * 0.04, duration: 0.25, ease: "easeOut" as const },
  }),
};

export function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showScrolled = mounted && scrolled;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const heroTransparent = isHome && !showScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          showScrolled
            ? "glass-strong border-b border-glass-border py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            : heroTransparent
              ? theme === "light"
                ? "border-b border-transparent bg-background/50 py-4 backdrop-blur-md md:py-5"
                : "border-b border-transparent bg-transparent py-4 md:py-5"
              : "glass-strong border-b border-glass-border/50 py-4 backdrop-blur-xl md:py-5"
        )}
      >
        <nav
          className="mx-auto flex max-w-[90rem] items-center gap-4 px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo — left */}
          <Link href="/" className="group relative z-10 shrink-0" aria-label="Traguin home">
            <span className="logo-wrap transition-opacity duration-300 group-hover:opacity-90">
              <Image
                src="/traguin-logo.png"
                alt="Traguin"
                width={1024}
                height={386}
                className="h-8 w-auto object-contain object-left sm:h-9 md:h-10"
                priority
              />
            </span>
          </Link>

          {/* Desktop links — center */}
          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <ul className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 xl:gap-x-5">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative whitespace-nowrap px-1 py-1 text-[13px] tracking-wide transition-colors duration-200 xl:text-sm",
                        active
                          ? "text-gold"
                          : "text-foreground/75 hover:text-gold"
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0"
                        )}
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop actions — far right */}
          <div className="relative z-10 hidden shrink-0 items-center gap-3 lg:flex">
            <ThemeToggle />
            <MagneticButton
              as="a"
              href={primaryCta.href}
              variant="primary"
              className="!px-5 !py-2.5 !text-xs whitespace-nowrap"
            >
              {primaryCta.label}
            </MagneticButton>
          </div>

          {/* Mobile — hamburger + theme */}
          <div className="relative z-10 ml-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
                mobileOpen
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-glass-border glass text-foreground hover:border-gold/30"
              )}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
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
              className="fixed inset-x-0 top-0 z-40 flex max-h-[100dvh] flex-col glass-strong border-b border-glass-border pt-[4.5rem] shadow-2xl lg:hidden"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <ul className="flex flex-col gap-1">
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
                            "block rounded-xl px-4 py-3.5 font-display text-xl transition-colors duration-200",
                            active
                              ? "bg-gold/10 text-gold"
                              : "text-foreground hover:bg-gold/5 hover:text-gold"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.25 }}
                  className="mt-8 space-y-3 border-t border-glass-border pt-8"
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
