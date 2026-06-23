"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  ChevronRight,
  Compass,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  HelpCircle,
  Image,
  Images,
  Inbox,
  Layers,
  LayoutGrid,
  Link2,
  ListOrdered,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquareQuote,
  MousePointerClick,
  Package,
  PanelTop,
  Route,
  Scale,
  Search,
  Settings,
  Sparkles,
  Star,
  UserCircle,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_ENTITY_GROUPS, getEnabledEntities } from "@/lib/admin/entities";
import { prefetchAdminList } from "@/lib/admin/admin-data-cache";
import type { AdminEntityDef } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const CUSTOM_CMS_LINKS = [
  {
    key: "homepage-hero-slider",
    label: "Homepage Hero Slider",
    href: "/admin/cms/homepage-hero-slider",
    group: "site-config",
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
  media: Image,
  "client-stories": MessageSquareQuote,
  "gallery-categories": LayoutGrid,
  "gallery-items": Images,
  faqs: HelpCircle,
  specializations: Compass,
  "company-stats": BarChart3,
  "site-settings": Settings,
  "navigation-links": Link2,
  "site-ctas": MousePointerClick,
  "global-page-cta": Megaphone,
  "page-metadata": FileText,
  "page-heroes": PanelTop,
  redirects: ArrowRightLeft,
  "journey-process-steps": ListOrdered,
  "value-propositions": Star,
  "concierge-services": Sparkles,
  "homepage-region-panels": Globe,
  "about-story-sections": BookOpen,
  "homepage-promo": Megaphone,
  "travel-expert-settings": UserCircle,
  "about-page-header": FileText,
  "job-openings": Briefcase,
  "legal-pages": Scale,
  "careers-page-extras": GraduationCap,
  "chat-agent-settings": Bot,
  "chat-agent-welcome-messages": MessageCircle,
  "chat-agent-quick-replies": Zap,
  "form-submissions": Inbox,
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

function groupContainsPath(pathname: string, groupId: string, entityKeys: string[]) {
  if (
    CUSTOM_CMS_LINKS.some(
      (link) =>
        link.group === groupId &&
        (pathname === link.href || pathname.startsWith(`${link.href}/`)),
    )
  ) {
    return true;
  }
  return entityKeys.some((key) => {
    const href = entityHref(key);
    return pathname === href || pathname.startsWith(`${href}/`);
  });
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
  const entities = getEnabledEntities();
  const [search, setSearch] = useState("");

  const groupedEntities = useMemo(
    () =>
      ADMIN_ENTITY_GROUPS.map((group) => ({
        group,
        items: entities.filter((e) => e.group === group.id),
      })).filter((entry) => entry.items.length > 0),
    [entities],
  );

  const navCatalog = useMemo(() => {
    const items: NavItem[] = [];

    for (const { group, items: groupItems } of groupedEntities) {
      for (const entity of groupItems) {
        items.push({
          key: entity.key,
          label: entity.pluralLabel,
          href: entityHref(entity.key),
          groupId: group.id,
          groupLabel: group.label,
          icon: entityIcon(entity),
          endpoint: entity.endpoint,
        });
      }

      for (const link of CUSTOM_CMS_LINKS) {
        if (link.group !== group.id) continue;
        items.push({
          key: link.key,
          label: link.label,
          href: link.href,
          groupId: group.id,
          groupLabel: group.label,
          icon: link.icon,
        });
      }
    }

    return items;
  }, [groupedEntities]);

  const activeGroupId = useMemo(() => {
    for (const { group, items } of groupedEntities) {
      if (groupContainsPath(pathname, group.id, items.map((e) => e.key))) {
        return group.id;
      }
    }
    return groupedEntities[0]?.group.id ?? null;
  }, [groupedEntities, pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isGroupOpen = (groupId: string) => openGroups[groupId] ?? groupId === activeGroupId;

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !(prev[groupId] ?? groupId === activeGroupId),
    }));
  };

  const searchQuery = search.trim().toLowerCase();
  const isSearching = searchQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return navCatalog.filter((item) => {
      const haystack = `${item.label} ${item.groupLabel}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }, [isSearching, navCatalog, searchQuery]);

  const visibleGroups = useMemo(() => {
    if (!isSearching) return groupedEntities;

    const matchingGroupIds = new Set(searchResults.map((item) => item.groupId));
    return groupedEntities.filter(({ group }) => matchingGroupIds.has(group.id));
  }, [groupedEntities, isSearching, searchResults]);

  const groupItemsFor = (groupId: string) => {
    const entityItems = navCatalog.filter((item) => item.groupId === groupId);
    if (!isSearching) return entityItems;
    return entityItems.filter((item) => {
      const haystack = `${item.label} ${item.groupLabel}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  };

  const activeItem = navCatalog.find((item) => isNavActive(pathname, item.href));

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <div className="admin-sidebar-brand">
          <div className="admin-agency-mark" aria-hidden>
            T
          </div>
          <div className="admin-sidebar-brand__copy">
            <span className="admin-sidebar-brand__title">Traguin CMS</span>
            <span className="admin-sidebar-brand__plan">Content workspace</span>
          </div>
        </div>

        <label className="admin-sidebar-search">
          <Search aria-hidden className="admin-sidebar-search__icon" />
          <input
            type="search"
            className="admin-sidebar-search__input"
            placeholder="Search navigation…"
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
        {activeItem && !isSearching && (
          <div className="admin-sidebar-current" aria-label="Current page">
            <span className="admin-sidebar-current__eyebrow">Current</span>
            <span className="admin-sidebar-current__title">{activeItem.label}</span>
            <span className="admin-sidebar-current__group">{activeItem.groupLabel}</span>
          </div>
        )}

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

          {!isSearching &&
            visibleGroups.map(({ group }) => {
              const groupItems = groupItemsFor(group.id);
              if (groupItems.length === 0) return null;

              const isOpen = isGroupOpen(group.id);
              const groupActive = group.id === activeGroupId;

              return (
                <section
                  key={group.id}
                  className={cn(
                    "admin-nav-group",
                    isOpen && "admin-nav-group--open",
                    groupActive && "admin-nav-group--active",
                  )}
                >
                  <button
                    type="button"
                    className="admin-nav-section-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span className="admin-nav-section-toggle__label">
                      <span className="admin-nav-section-toggle__text">{group.label}</span>
                      <span className="admin-nav-group__count">{groupItems.length}</span>
                    </span>
                    <ChevronRight
                      className={cn(
                        "admin-nav-section-chevron",
                        isOpen && "admin-nav-section-chevron--open",
                      )}
                      aria-hidden
                    />
                  </button>

                  <div className="admin-nav-group-panel" hidden={!isOpen}>
                    <div className="admin-nav-group-items">
                      {groupItems.map((item) => (
                        <NavLinkItem key={item.key} item={item} pathname={pathname} />
                      ))}
                    </div>
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
