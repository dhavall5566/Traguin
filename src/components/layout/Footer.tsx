import Link from "next/link";
import Image from "next/image";
import { FooterContactList, FooterSocialLinks } from "@/components/layout/FooterContact";
import { footerExploreLinks, footerCompanyLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer relative border-t border-glass-border bg-surface">
      <div className="absolute inset-0 luxury-gradient opacity-20" />
      <div className="home-section relative">
      <div className="site-container">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="logo-wrap">
                <Image
                  src="/traguin-logo.png"
                  alt="TRAGUIN"
                  width={1024}
                  height={386}
                  className="h-9 w-auto object-contain object-left"
                />
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Curating extraordinary journeys for discerning travelers since 2024.
              Where luxury meets authentic experience.
            </p>
            <FooterSocialLinks />
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-gold uppercase">Explore</h4>
            <ul className="space-y-3">
              {footerExploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-gold uppercase">Company</h4>
            <ul className="space-y-3">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-gold uppercase">Contact</h4>
            <FooterContactList />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} TRAGUIN Luxury Travel. All rights reserved.
            </p>
            <p className="text-xs tracking-wide text-muted">
              TRAGUIN brand powered by ARKINOX
            </p>
          </div>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
