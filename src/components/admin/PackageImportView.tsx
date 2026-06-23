"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PackageImportView() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/cms/packages?import=1");
  }, [router]);

  return null;
}
