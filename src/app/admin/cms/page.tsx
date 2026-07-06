import { redirect } from "next/navigation";
import { CMS_DEFAULT_LANDING_PATH } from "@/lib/admin/entities";

export default function CmsAdminIndexPage() {
  redirect(CMS_DEFAULT_LANDING_PATH);
}
