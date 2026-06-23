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
  ChevronDown,
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
  Settings,
  Sparkles,
  Star,
  UserCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_ENTITY_GROUPS, getEnabledEntities } from "@/lib/admin/entities";
import type { AdminEntityDef } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

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

function entityHref(key: string) {
  return `/admin/cms/${key}`;
}

function entityIcon(entity: AdminEntityDef) {
  return ENTITY_ICONS[entity.key] ?? Folder;
}

function groupContainsPath(pathname: string, entityKeys: string[]) {
  return entityKeys.some((key) => {
    const href = entityHref(key);
    return pathname === href || pathname.startsWith(`${href}/`);
  });
}

export function AdminSidebar() {
  const pathname = usePathname();
  const entities = getEnabledEntities();

  const groupedEntities = useMemo(
    () =>
      ADMIN_ENTITY_GROUPS.map((group) => ({
        group,
        items: entities.filter((e) => e.group === group.id),
      })).filter((entry) => entry.items.length > 0),
    [entities],
  );

  const activeGroupId = useMemo(() => {
    for (const { group, items } of groupedEntities) {
      if (groupContainsPath(pathname, items.map((e) => e.key))) {
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

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__scroll">
        <div className="admin-sidebar-brand">
          <div className="admin-agency-mark" aria-hidden>
            T
          </div>
          <div className="admin-sidebar-brand__copy">
            <span className="admin-sidebar-brand__title">Traguin CMS</span>
            <span className="admin-sidebar-brand__plan">Content Admin</span>
          </div>
        </div>

        <nav aria-label="CMS entities" className="admin-sidebar-nav">
          {groupedEntities.map(({ group, items }) => {
            const isOpen = isGroupOpen(group.id);

            return (
              <div key={group.id} className="admin-nav-group">
                <button
                  type="button"
                  className="admin-nav-section-toggle"
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={cn("admin-nav-section-chevron", isOpen && "admin-nav-section-chevron--open")}
                    aria-hidden
                  />
                </button>

                {isOpen && (
                  <div className="admin-nav-group-items">
                    {items.map((entity) => {
                      const href = entityHref(entity.key);
                      const active = pathname === href || pathname.startsWith(`${href}/`);
                      const Icon = entityIcon(entity);

                      return (
                        <Link
                          key={entity.key}
                          href={href}
                          className={cn("admin-nav-link", active && "admin-nav-link--active")}
                          title={entity.pluralLabel}
                        >
                          <Icon className="admin-nav-link__icon" aria-hidden />
                          <span>{entity.pluralLabel}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-footer shrink-0 border-t border-[var(--glass-border)] pt-3 mt-2">
        <Link href="/" className="admin-nav-link">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
