import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  noPaddingTop?: boolean;
};

/** Standard inner-page wrapper, aligns with nav & home section width */
export function PageShell({
  children,
  className,
  containerClassName,
  noPaddingTop = false,
}: PageShellProps) {
  return (
    <div className={cn("page-shell pb-16 md:pb-20", !noPaddingTop && "page-shell--spaced", className)}>
      <div className="page-x-padding">
        <div className={cn("site-container", containerClassName)}>{children}</div>
      </div>
    </div>
  );
}
