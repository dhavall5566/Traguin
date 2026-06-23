import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminProductSwitcher";

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminTopBar />
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
