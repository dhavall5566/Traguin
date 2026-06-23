import { notFound } from "next/navigation";
import { EntityFormView } from "@/components/admin/EntityFormView";
import { getEntityDef, isEnabledEntityKey } from "@/lib/admin/entities";

type PageProps = {
  params: Promise<{ entity: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { entity: entityKey } = await params;
  const entity = getEntityDef(entityKey);
  return { title: entity ? `Edit ${entity.label}` : "CMS" };
}

export default async function EntityEditPage({ params }: PageProps) {
  const { entity: entityKey, id } = await params;
  if (!isEnabledEntityKey(entityKey)) {
    notFound();
  }
  const entity = getEntityDef(entityKey);
  if (!entity || entity.isSingleton) notFound();

  return <EntityFormView entityKey={entityKey} recordId={id} />;
}
