"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth";
import { traguinLogo } from "@/lib/brand/traguin-logo";
import { PasswordInput } from "@/components/admin/PasswordInput";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.detail === "string" ? body.detail : "Login failed.");
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/admin/cms") ? next : "/admin/cms");
    router.refresh();
  };

  return (
    <div className="admin-login-card">
      <div className="admin-login-brand">
        <Image
          src={traguinLogo}
          alt="TRAGUIN"
          className="admin-login-brand__logo"
          priority
        />
      </div>

      <div className="mb-6">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">CMS Admin</p>
        <h1 className="font-display text-2xl font-semibold text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Use your editor account to manage site content.</p>
      </div>

      {error && <div className="admin-alert admin-alert--error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="admin-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="admin-input mt-1 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="admin-label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <button type="submit" className="admin-btn admin-btn--primary w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  };

  return (
    <button type="button" className="admin-btn admin-btn--secondary admin-btn--topbar" onClick={handleLogout}>
      Log out
    </button>
  );
}
