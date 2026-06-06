import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageExplorer } from "@/components/packages/PackageExplorer";

export const metadata: Metadata = {
  title: "Domestic Packages",
  description: "Explore curated luxury travel packages across India.",
};

export default function DomesticPackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pb-20" />}>
      <PackageExplorer region="domestic" />
    </Suspense>
  );
}
