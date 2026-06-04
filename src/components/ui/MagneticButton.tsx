"use client";

import { type MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
}

export function MagneticButton({
  children,
  className,
  as = "button",
  href,
  onClick,
  type = "button",
  variant = "primary",
}: MagneticButtonProps) {
  const variants = {
    primary:
      "bg-gold text-on-gold hover:bg-gold-light shadow-lg shadow-gold/20",
    secondary:
      "glass text-foreground hover:border-gold/40 border border-glass-border",
    ghost: "text-foreground hover:text-gold border border-transparent hover:border-gold/30",
  };

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-300",
    variants[variant],
    className
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={classes} data-cursor="pointer">
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} data-cursor="pointer">
      {children}
    </button>
  );
}
