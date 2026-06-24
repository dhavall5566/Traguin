import { CmsAdminShell } from "@/components/admin/CmsAdminShell";

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return <CmsAdminShell>{children}</CmsAdminShell>;
}
