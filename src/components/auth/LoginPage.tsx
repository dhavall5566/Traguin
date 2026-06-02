"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="flex min-h-screen items-center justify-center pt-20 pb-12">
      <div className="section-padding w-full max-w-md pt-0">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl tracking-[0.2em]">TRAGUIN</span>
          </Link>
          <h1 className="mt-8 font-display text-3xl text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to your client portal</p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 glass rounded-3xl p-8"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs tracking-wide text-muted uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs tracking-wide text-muted uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-glass-border bg-input px-4 py-3 pr-12 text-sm outline-none focus:border-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="#" className="text-xs text-gold hover:text-gold-light">
              Forgot password?
            </Link>
          </div>

          <MagneticButton type="submit" variant="primary" className="mt-6 w-full">
            Sign In
          </MagneticButton>

          <p className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/contact" className="text-gold hover:text-gold-light">
              Contact us
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
