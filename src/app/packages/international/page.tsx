import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageExplorer } from "@/components/packages/PackageExplorer";

export const metadata: Metadata = {
  title: "International Packages",
  description: "Discover luxury international travel packages worldwide.",
};

export default function InternationalPackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pb-20" />}>
      <PackageExplorer region="international" />
    </Suspense>
  );
}
