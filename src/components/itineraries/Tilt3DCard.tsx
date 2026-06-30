"use client";

import type { ReactNode } from "react";
import { useTilt3D } from "@/hooks/useTilt3D";
import { useMotionLite } from "@/hooks/useMotionLite";
import { cn } from "@/lib/utils";

type Tilt3DCardProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
};

export function Tilt3DCard({ children, className, max = 10, scale = 1.02 }: Tilt3DCardProps) {
  const motionLite = useMotionLite();
  const ref = useTilt3D<HTMLDivElement>({ max, scale });

  if (motionLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("[transform-style:preserve-3d] will-change-transform", className)}>
      {children}
    </div>
  );
}
