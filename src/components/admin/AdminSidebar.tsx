"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  Handshake,
  HelpCircle,
  Image as ImageIcon,
  Images,
  Layers,
  LayoutGrid,
  MapPin,
  MessageSquareQuote,
  Package,
  PanelTop,
  Route,
  Scale,
  Search,
  Sparkles,
  UserCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { getEnabledEntities } from "@/lib/admin/entities";
import { isLuxuryStaysVisible } from "@/lib/site-features";
import {
  CMS_NAV_SECTIONS,
  getCustomLinkNavSectionId,
  getEntityNavSectionId,
  getNavSectionLabel,
} from "@/lib/admin/cms-nav-sections";
import { prefetchAdminList } from "@/lib/admin/admin-data-cache";
import { traguinLogo } from "@/lib/brand/traguin-logo";
import type { AdminEntityDef } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const CUSTOM_CMS_LINKS = [
  {
    key: "homepage-hero-slider",
    label: "Homepage Hero Slider",
    href: "/admin/cms/homepage-hero-slider",
    icon: PanelTop,
  },
] as const;

const ENTITY_ICONS: Record<string, LucideIcon> = {
  destinations: MapPin,
  "destination-categories": Layers,
  packages: Package,
  itineraries: Route,
  hotels: Building2,
  experiences: Sparkles,
  media: ImageIcon,
  "client-stories": MessageSquareQuote,
  "gallery-categories": LayoutGrid,
  "gallery-items": Images,
  faqs: HelpCircle,
  "homepage-region-panels": Globe,
  "about-story-sections": BookOpen,
  "about-client-logos": Handshake,
  "travel-expert-settings": UserCircle,
  "about-page-header": FileText,
  "job-openings": Briefcase,
  "legal-pages": Scale,
  "careers-page-extras": GraduationCap,
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  groupId: string;
  groupLabel: string;
  icon: LucideIcon;
  endpoint?: string;
};

function entityHref(key: string) {
  return `/admin/cms/${key}`;
}

function entityIcon(entity: AdminEntityDef) {
  return ENTITY_ICONS[entity.key] ?? Folder;
}

function groupContainsPath(pathname: string, sectionId: string, keys: string[]) {
  if (
    CUSTOM_CMS_LINKS.some(
      (link) =>
        getCustomLinkNavSectionId(link.key) === sectionId &&
        (pathname === link.href || pathname.startsWith(`${link.href}/`)),
    )
  ) {
    return true;
  }

  return keys.some((key) => {
    const href = key.startsWith("/") ? key : entityHref(key);
    return pathname === href || pathname.startsWith(`${href}/`);
  });
}

const NAV_RECENT_STORAGE_KEY = "traguin-cms-nav-recent";

function readRecentNavKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NAV_RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecentNavKey(key: string) {
  if (typeof window === "undefined") return;
  const next = [key, ...readRecentNavKeys().filter((item) => item !== key)].slice(0, 5);
  window.localStorage.setItem(NAV_RECENT_STORAGE_KEY, JSON.stringify(next));
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinkItem({
  item,
  pathname,
  compact,
}: {
  item: NavItem;
  pathname: string;
  compact?: boolean;
}) {
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn("admin-nav-link", active && "admin-nav-link--active")}
      title={item.label}
      aria-current={active ? "page" : undefined}
      onMouseEnter={() => {
        if (item.endpoint) prefetchAdminList(item.endpoint);
      }}
      onFocus={() => {
        if (item.endpoint) prefetchAdminList(item.endpoint);
      }}
      onClick={() => writeRecentNavKey(item.key)}
    >
      <span className={cn("admin-nav-link__icon-wrap", active && "admin-nav-link__icon-wrap--active")}>
        <Icon className="admin-nav-link__icon" aria-hidden />
      </span>
      <span className="admin-nav-link__label">
        <span className="admin-nav-link__text">{item.label}</span>
        {compact && <span className="admin-nav-link__meta">{item.groupLabel}</span>}
      </span>
      {active && <span className="admin-nav-link__rail" aria-hidden />}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const entities = getEnabledEntities().filter(
    (entity) =>
      !entity.hideFromNav && (isLuxuryStaysVisible() || entity.key !== "hotels"),
  );
  const [search, setSearch] = useState("");
  const [recentNavKeys, setRecentNavKeys] = useState<string[]>([]);

  useEffect(() => {
    setRecentNavKeys(readRecentNavKeys());
  }, [pathname]);

  const navCatalog = useMemo(() => {
    const items: NavItem[] = [];

    for (const entity of entities) {
      const sectionId = getEntityNavSectionId(entity.key);
      items.push({
        key: entity.key,
        label: entity.pluralLabel,
        href: entityHref(entity.key),
        groupId: sectionId,
        groupLabel: getNavSectionLabel(sectionId),
        icon: entityIcon(entity),
        endpoint: entity.endpoint,
      });
    }

    for (const link of CUSTOM_CMS_LINKS) {
      const sectionId = getCustomLinkNavSectionId(link.key);
      items.push({
        key: link.key,
        label: link.label,
        href: link.href,
        groupId: sectionId,
        groupLabel: getNavSectionLabel(sectionId),
        icon: link.icon,
      });
    }

    return items.sort((a, b) => {
      const sectionOrder =
        CMS_NAV_SECTIONS.findIndex((section) => section.id === a.groupId) -
        CMS_NAV_SECTIONS.findIndex((section) => section.id === b.groupId);
      if (sectionOrder !== 0) return sectionOrder;
      return a.label.localeCompare(b.label);
    });
  }, [entities]);

  const activeGroupId = useMemo(() => {
    for (const section of CMS_NAV_SECTIONS) {
      const sectionKeys = navCatalog
        .filter((item) => item.groupId === section.id)
        .map((item) => item.key);

      if (groupContainsPath(pathname, section.id, sectionKeys)) {
        return section.id;
      }
    }

    return CMS_NAV_SECTIONS[0]?.id ?? null;
  }, [navCatalog, pathname]);

  const recentNavItems = useMemo(
    () =>
      recentNavKeys
        .map((key) => navCatalog.find((item) => item.key === key))
        .filter((item): item is NavItem => item !== undefined),
    [navCatalog, recentNavKeys],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchQuery = search.trim().toLowerCase();
  const isSearching = searchQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return navCatalog.filter((item) => {
      const haystack = `${item.label} ${item.groupLabel}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }, [isSearching, navCatalog, searchQuery]);

  const visibleSections = useMemo(() => {
    const sectionsWithItems = CMS_NAV_SECTIONS.map((section) => ({
      section,
      items: navCatalog.filter((item) => item.groupId === section.id),
    })).filter((entry) => entry.items.length > 0);

    if (!isSearching) return sectionsWithItems;

    const matchingSectionIds = new Set(searchResults.map((item) => item.groupId));
    return sectionsWithItems.filter(({ section }) => matchingSectionIds.has(section.id));
  }, [isSearching, navCatalog, searchResults]);

  const sectionItemsFor = (sectionId: string) => {
    const sectionItems = navCatalog.filter((item) => item.groupId === sectionId);
    if (!isSearching) return sectionItems;
    return sectionItems.filter((item) => {
      const haystack = `${item.label} ${item.groupLabel}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <div className="admin-sidebar-brand">
          <Image
            src={traguinLogo}
            alt="Traguin"
            className="admin-sidebar-brand__logo"
            priority
          />
          <div className="admin-sidebar-brand__copy">
            <span className="admin-sidebar-brand__title">Traguin CMS</span>
          </div>
        </div>

        <label className="admin-sidebar-search">
          <Search aria-hidden className="admin-sidebar-search__icon" />
          <input
            ref={searchInputRef}
            type="search"
            className="admin-sidebar-search__input"
            placeholder="Search navigation… (⌘K)"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search CMS navigation"
          />
          {search && (
            <button
              type="button"
              className="admin-sidebar-search__clear"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X aria-hidden className="admin-sidebar-search__clear-icon" />
            </button>
          )}
        </label>
      </div>

      <div className="admin-sidebar__scroll">
        <nav aria-label="CMS entities" className="admin-sidebar-nav">
          {isSearching && searchResults.length === 0 && (
            <div className="admin-sidebar-empty">
              <p className="admin-sidebar-empty__title">No matches</p>
              <p className="admin-sidebar-empty__text">Try a package name, destination, or section label.</p>
            </div>
          )}

          {isSearching && searchResults.length > 0 && (
            <section className="admin-nav-group admin-nav-group--flat">
              <div className="admin-nav-group__header">
                <span className="admin-nav-group__title">Results</span>
                <span className="admin-nav-group__count">{searchResults.length}</span>
              </div>
              <div className="admin-nav-group-items">
                {searchResults.map((item) => (
                  <NavLinkItem key={item.key} item={item} pathname={pathname} compact />
                ))}
              </div>
            </section>
          )}

          {!isSearching && recentNavItems.length > 0 && (
            <section className="admin-nav-group admin-nav-group--flat admin-nav-group--recent">
              <div className="admin-nav-group__header">
                <span className="admin-nav-group__title">Recent</span>
                <span className="admin-nav-group__count">{recentNavItems.length}</span>
              </div>
              <div className="admin-nav-group-items">
                {recentNavItems.map((item) => (
                  <NavLinkItem key={`recent-${item.key}`} item={item} pathname={pathname} compact />
                ))}
              </div>
            </section>
          )}

          {!isSearching &&
            visibleSections.map(({ section }) => {
              const sectionItems = sectionItemsFor(section.id);
              if (sectionItems.length === 0) return null;

              const groupActive = section.id === activeGroupId;

              return (
                <section
                  key={section.id}
                  className={cn(
                    "admin-nav-group admin-nav-group--flat admin-nav-group--always-open",
                    groupActive && "admin-nav-group--active",
                  )}
                >
                  <div className="admin-nav-group__header">
                    <span className="admin-nav-group__title">{section.label}</span>
                    <span className="admin-nav-group__count">{sectionItems.length}</span>
                  </div>
                  <div className="admin-nav-group-items">
                    {sectionItems.map((item) => (
                      <NavLinkItem key={item.key} item={item} pathname={pathname} />
                    ))}
                  </div>
                </section>
              );
            })}
        </nav>
      </div>

      <div className="admin-sidebar__footer">
        <span className="admin-sidebar__footer-label">Traguin CMS</span>
        <span className="admin-sidebar__footer-meta">Enterprise content admin</span>
      </div>
    </aside>
  );
}
