import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EntityFormView } from "@/components/admin/EntityFormView";
import { EntityTableView } from "@/components/admin/EntityTableView";
import { getEntityDef, isEnabledEntityKey } from "@/lib/admin/entities";

type PageProps = {
  params: Promise<{ entity: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { entity: entityKey } = await params;
  const entity = getEntityDef(entityKey);
  return { title: entity?.pluralLabel ?? "CMS" };
}

export default async function EntityListPage({ params }: PageProps) {
  const { entity: entityKey } = await params;
  if (!isEnabledEntityKey(entityKey)) {
    notFound();
  }
  const entity = getEntityDef(entityKey);
  if (!entity) notFound();

  if (entity.isSingleton) {
    return <EntityFormView entityKey={entityKey} singleton />;
  }

  return (
    <Suspense fallback={<div className="admin-page-state">Loading…</div>}>
      <EntityTableView entityKey={entityKey} />
    </Suspense>
  );
}
