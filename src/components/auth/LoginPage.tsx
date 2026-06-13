"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormField, fieldInputClass } from "@/components/ui/FormField";
import {
  clearFieldError,
  hasErrors,
  validateLoginForm,
  type FieldErrors,
} from "@/lib/form-validation";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(setErrors, key);
    setSubmitError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateLoginForm(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSubmitError("Sign-in is not yet connected. Please contact your travel designer.");
  };

  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-offset))] items-center justify-center pb-12">
<<<<<<< HEAD
      <div className="page-x-padding w-full max-w-md">
=======
      <div className="page-x-padding w-full">
        <div className="site-container site-container--content">
>>>>>>> dhaval
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl tracking-[0.2em]">TRAGUIN</span>
          </Link>
          <h1 className="mt-8 font-display text-3xl text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to your client portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-10 glass rounded-3xl p-8">
          <div className="space-y-4">
            {submitError && (
              <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold" role="status">
                {submitError}
              </p>
            )}
            <FormField label="Email" htmlFor="login-email" error={errors.email}>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={fieldInputClass("email", errors)}
                aria-invalid={!!errors.email}
              />
            </FormField>
            <FormField label="Password" htmlFor="login-password" error={errors.password}>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className={`${fieldInputClass("password", errors)} pr-12`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>
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
<<<<<<< HEAD
=======
        </div>
>>>>>>> dhaval
      </div>
    </div>
  );
}
