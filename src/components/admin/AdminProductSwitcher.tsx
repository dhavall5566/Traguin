"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getCrmAppUrl } from "@/lib/admin-links";
import { prefetchCrossApp } from "@/lib/cross-app-prefetch";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth";

type AdminSessionUser = {
  name: string;
  email: string;
  role: string;
};

function formatRoleLabel(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AdminProductSwitcher() {
  const crmUrl = getCrmAppUrl();

  useEffect(() => {
    prefetchCrossApp(crmUrl);
  }, [crmUrl]);

  return (
    <div className="admin-product-switcher" role="tablist" aria-label="Product area">
      <span className="admin-product-tab admin-product-tab--active" role="tab" aria-selected="true">
        CMS
      </span>
      <a
        href={crmUrl}
        className="admin-product-tab admin-product-tab--link"
        role="tab"
        aria-selected="false"
        onMouseEnter={() => prefetchCrossApp(crmUrl)}
        onFocus={() => prefetchCrossApp(crmUrl)}
      >
        CRM
      </a>
    </div>
  );
}

function AdminThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="admin-icon-btn"
      title="Toggle theme"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}

function AdminNotificationsButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="admin-icon-btn"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
      </button>
      {open && (
        <div className="admin-dropdown w-80 p-2 text-xs">
          <div className="border-b border-[var(--glass-border)] px-1 pb-2 mb-2">
            <span className="block font-semibold">Notifications</span>
          </div>
          <div className="py-6 text-center text-[11px] text-[var(--muted)]">
            No notifications yet.
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAccountMenu({ user }: { user: AdminSessionUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  };

  const firstName = user.name.split(/\s+/)[0] || "Account";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className={`group flex max-w-[min(100%,16rem)] items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--surface)_40%,transparent)] py-1.5 pl-2 pr-2 transition-all hover:bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--gold)_40%,transparent)] ${
          open ? "border-[color-mix(in_srgb,var(--gold)_40%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--gold)_25%,transparent)]" : ""
        }`}
      >
        <span className="admin-avatar h-8 w-8 text-[11px] shrink-0">
          {user.name.charAt(0)}
        </span>
        <div className="hidden min-w-0 flex-1 text-left sm:block">
          <span className="block max-w-[9rem] truncate text-[11px] font-semibold leading-tight text-[var(--foreground)]">
            {firstName}
          </span>
          <span className="block max-w-[9rem] truncate text-[9px] font-medium leading-tight text-[var(--muted)]">
            {formatRoleLabel(user.role)}
          </span>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)]">
          <ChevronDown
            className={`h-4 w-4 text-[var(--muted)] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="admin-dropdown w-48">
          <div className="border-b border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] px-3 py-2">
            <span className="block text-xs font-semibold">{user.name}</span>
            <span className="block text-[10px] text-[var(--muted)]">{user.email}</span>
          </div>
          <Link
            href="/admin/cms/account"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[color-mix(in_srgb,var(--gold)_8%,var(--surface))]"
          >
            <Settings className="h-3.5 w-3.5 text-[var(--muted)]" />
            Account settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 border-t border-[var(--glass-border)] px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminTopBar() {
  const [user, setUser] = useState<AdminSessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/admin/auth/session", { credentials: "include" });
        if (!response.ok) return;
        const payload = (await response.json()) as AdminSessionUser;
        if (!cancelled) setUser(payload);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__section admin-topbar__section--start" aria-hidden="true" />

      <div className="admin-topbar__section admin-topbar__section--center">
        <p className="admin-topbar__brand">Traguin Admin CMS</p>
      </div>

      <div className="admin-topbar__section admin-topbar__section--end">
        <AdminProductSwitcher />
        <AdminThemeToggle />
        <AdminNotificationsButton />
        {user ? (
          <AdminAccountMenu user={user} />
        ) : (
          <span className="admin-avatar h-8 w-8 text-[11px] shrink-0" aria-hidden="true">
            ?
          </span>
        )}
      </div>
    </header>
  );
}
