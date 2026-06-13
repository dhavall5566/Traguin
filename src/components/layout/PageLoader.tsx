"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 1400;
const EXIT_MS = 650;
const MAX_BEFORE_LOAD = 94;

function TraguinPenguin() {
  return (
    <div className="page-loader__penguin" aria-hidden>
      <svg viewBox="0 0 120 140" className="page-loader__penguin-svg" fill="none">
        <ellipse cx="60" cy="118" rx="34" ry="6" className="page-loader__shadow" />
        <g className="page-loader__penguin-body">
          <ellipse cx="60" cy="72" rx="38" ry="46" fill="#141414" />
          <ellipse cx="60" cy="78" rx="24" ry="30" fill="#f5f2ec" />
          <circle cx="48" cy="58" r="5" fill="#141414" />
          <circle cx="72" cy="58" r="5" fill="#141414" />
          <circle cx="49" cy="57" r="1.8" fill="#ffffff" />
          <circle cx="73" cy="57" r="1.8" fill="#ffffff" />
          <path
            d="M60 64 L52 72 L68 72 Z"
            fill="var(--gold)"
            stroke="#141414"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <ellipse cx="38" cy="76" rx="10" ry="18" fill="#141414" className="page-loader__wing page-loader__wing--left" />
          <ellipse cx="82" cy="76" rx="10" ry="18" fill="#141414" className="page-loader__wing page-loader__wing--right" />
        </g>
        <g className="page-loader__feet">
          <ellipse cx="48" cy="116" rx="10" ry="5" fill="var(--gold)" />
          <ellipse cx="72" cy="116" rx="10" ry="5" fill="var(--gold)" />
        </g>
      </svg>
      <div className="page-loader__logo-mark">
        <span className="page-loader__logo-wrap">
          <Image
            src="/traguin-logo.png"
            alt=""
            width={160}
            height={60}
            className="h-7 w-auto object-contain"
            priority
          />
        </span>
      </div>
    </div>
  );
}

export function PageLoader() {
  const [progress, setProgress] = useState(8);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
  const progressRef = useRef(8);
  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = performance.now();
    setReady(true);
    document.documentElement.classList.add("page-loader-active");

    intervalRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= MAX_BEFORE_LOAD) {
          progressRef.current = current;
          return current;
        }
        const step =
          current < 35 ? 2.4 + Math.random() * 2.6 : current < 70 ? 1.2 + Math.random() * 1.6 : 0.5 + Math.random() * 0.8;
        const next = Math.min(MAX_BEFORE_LOAD, current + step);
        progressRef.current = next;
        return next;
      });
    }, 48);

    const finish = () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const elapsed = performance.now() - startedAtRef.current;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      setProgress(100);
      progressRef.current = 100;

      window.setTimeout(() => {
        setPhase("exit");
        window.setTimeout(() => {
          setPhase("done");
          document.documentElement.classList.remove("page-loader-active");
        }, EXIT_MS);
      }, remaining + 280);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
      window.removeEventListener("load", finish);
      document.documentElement.classList.remove("page-loader-active");
    };
  }, []);

  if (phase === "done") return null;

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      className={cn("page-loader", ready && "page-loader--ready", phase === "exit" && "page-loader--exit")}
      role="alert"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label={`Loading TRAGUIN, ${displayProgress} percent`}
    >
      <div className="page-loader__inner">
        <TraguinPenguin />
        <p className="page-loader__percent">{displayProgress}%</p>
        <div className="page-loader__track" aria-hidden>
          <div className="page-loader__bar" style={{ width: `${displayProgress}%` }} />
        </div>
        <p className="page-loader__caption">Preparing your luxury journey</p>
      </div>
    </div>
  );
}
