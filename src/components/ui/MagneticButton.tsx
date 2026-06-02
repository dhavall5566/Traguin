"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  as = "button",
  href,
  onClick,
  type = "button",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

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
      <a ref={ref} href={href} className={classes} data-cursor="pointer">
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} onClick={onClick} className={classes} data-cursor="pointer">
      {children}
    </button>
  );
}
