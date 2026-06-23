import { notFound, redirect } from "next/navigation";
import { getEntityDef, isEnabledEntityKey } from "@/lib/admin/entities";

type PageProps = {
  params: Promise<{ entity: string }>;
};

export default async function EntityNewPage({ params }: PageProps) {
  const { entity: entityKey } = await params;
  if (!isEnabledEntityKey(entityKey)) {
    notFound();
  }
  const entity = getEntityDef(entityKey);
  if (!entity || entity.isSingleton || entity.hideCreate) notFound();

  redirect(`/admin/cms/${entityKey}?create=1`);
}
