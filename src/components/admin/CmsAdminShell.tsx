"use client";

import { Suspense, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminProductSwitcher";
import { AdminToastProvider } from "@/components/admin/AdminToast";

export function CmsAdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminToastProvider>
      <Suspense fallback={<header className="admin-topbar" aria-hidden />}>
        <AdminTopBar />
      </Suspense>
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
    </AdminToastProvider>
  );
}
