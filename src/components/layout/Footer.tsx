import Link from "next/link";
import Image from "next/image";
import { Share2, Globe, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { contactInfo } from "@/data/contact";
import { footerExploreLinks, footerCompanyLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-surface">
      <div className="absolute inset-0 luxury-gradient opacity-20" />
      <div className="section-padding relative mx-auto max-w-7xl">
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
              Curating extraordinary journeys for discerning travelers since 2008.
              Where luxury meets authentic experience.
            </p>
            <div className="mt-5 flex gap-4">
              <a
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={contactInfo.emailHref}
                className="flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="Website"
              >
                <Globe size={16} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full glass transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="Share"
              >
                <Share2 size={16} />
              </a>
            </div>
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
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Phone size={16} className="shrink-0 text-gold" />
                <a href={contactInfo.phoneHref} className="hover:text-foreground">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <MessageCircle size={16} className="shrink-0 text-gold" />
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {contactInfo.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Mail size={16} className="shrink-0 text-gold" />
                <a href={contactInfo.emailHref} className="hover:text-foreground">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>{contactInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 md:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} TRAGUIN Luxury Travel. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
