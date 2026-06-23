import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminAuth";

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
