import type { Metadata } from "next";
import { EntityTableView } from "@/components/admin/EntityTableView";

export const metadata: Metadata = {
  title: "Client Stories",
};

export default function ClientStoriesAdminPage() {
  return <EntityTableView entityKey="client-stories" />;
}
