import { redirect } from "next/navigation";
import { ADMIN_ENABLED_ENTITY_KEYS } from "@/lib/admin/entities";

export default function CmsAdminIndexPage() {
  redirect(`/admin/cms/${ADMIN_ENABLED_ENTITY_KEYS[0]}`);
}
