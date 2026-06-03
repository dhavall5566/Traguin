"use client";

import { useEffect } from "react";

const RELOAD_KEY = "traguin-dev-chunk-reload";

function isChunkLoadError(reason: unknown): boolean {
  if (!reason || typeof reason !== "object") return false;
  const err = reason as { name?: string; message?: string };
  return (
    err.name === "ChunkLoadError" ||
    (typeof err.message === "string" && err.message.includes("Failed to load chunk"))
  );
}

/**
 * In dev, Turbopack HMR can leave the browser with stale chunk URLs.
 * One automatic reload usually fixes it without a manual hard refresh.
 */
export function DevChunkRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isChunkLoadError(event.reason)) return;

      event.preventDefault();

      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        return;
      }

      sessionStorage.removeItem(RELOAD_KEY);
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return null;
}
