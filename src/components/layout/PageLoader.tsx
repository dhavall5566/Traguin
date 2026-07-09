"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const EXIT_MS = 650;
const MAX_BEFORE_LOAD = 94;
const MAX_WAIT_MS = 2500;
const SESSION_KEY = "traguin-page-loader-seen";

function LoaderBrand() {
  return (
    <div className="page-loader__brand" aria-hidden>
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
  );
}

export function PageLoader() {
  const [progress, setProgress] = useState(8);
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setPhase("done");
      return;
    }

    document.documentElement.classList.add("page-loader-active");

    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(MAX_BEFORE_LOAD, current + 1.5));
    }, 80);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      window.clearInterval(progressTimer);
      setProgress(100);
      setPhase("exit");
      window.setTimeout(() => {
        setPhase("done");
        document.documentElement.classList.remove("page-loader-active");
      }, EXIT_MS);
    };

    const dismissTimer = window.setTimeout(dismiss, MAX_WAIT_MS);

    if (document.readyState === "complete") {
      window.setTimeout(dismiss, 120);
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(dismissTimer);
      window.removeEventListener("load", dismiss);
      document.documentElement.classList.remove("page-loader-active");
    };
  }, []);

  if (phase === "done") return null;

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      className={cn("page-loader", phase === "exit" && "page-loader--exit")}
      role="alert"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label={`Loading TRAGUIN, ${displayProgress} percent`}
    >
      <div className="page-loader__inner">
        <LoaderBrand />
        <p className="page-loader__percent">{displayProgress}%</p>
        <div className="page-loader__track" aria-hidden>
          <div className="page-loader__bar" style={{ width: `${displayProgress}%` }} />
        </div>
        <p className="page-loader__caption">Preparing your luxury journey</p>
      </div>
    </div>
  );
}
