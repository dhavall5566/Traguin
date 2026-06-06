"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={cn("flex-1", !isHome && "page-below-nav")}>{children}</div>
  );
}
