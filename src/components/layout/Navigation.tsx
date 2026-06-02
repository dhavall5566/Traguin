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

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/packages/domestic", label: "Domestic" },
  { href: "/packages/international", label: "International" },
  { href: "/always-on-demand", label: "On Demand" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-strong py-3"
            : theme === "light"
              ? "bg-background/75 py-4 backdrop-blur-sm md:py-5"
              : "bg-transparent py-4 md:py-5"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group shrink-0">
            <span className="logo-wrap transition-opacity group-hover:opacity-90">
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

          <div className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm tracking-wide transition-colors duration-200 hover:text-gold",
                  isActive(pathname, link.href) ? "text-gold" : "text-foreground/80"
                )}
              >
                {link.label}
                {isActive(pathname, link.href) && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-gold" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold"
            >
              Login
            </Link>
            <MagneticButton as="a" href="/contact" variant="primary" className="!px-5 !py-2.5 !text-xs">
              Plan My Trip
            </MagneticButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="rounded-lg p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass-strong pt-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-display text-xl text-foreground",
                    isActive(pathname, link.href) && "text-gold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="font-display text-xl text-muted">
                Login
              </Link>
              <MagneticButton as="a" href="/contact" variant="primary" className="mt-2 w-full">
                Plan My Trip
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
