"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isFlushHeroPage = /^\/destinations\/[^/]+$/.test(pathname);

  return (
    <div
      className={cn(
        "page-content-clip flex-1",
        !isHome && !isFlushHeroPage && "page-below-nav"
      )}
    >
      {children}
    </div>
  );
}
