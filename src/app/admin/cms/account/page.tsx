"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAccountPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/cms?account=1");
  }, [router]);

  return null;
}
