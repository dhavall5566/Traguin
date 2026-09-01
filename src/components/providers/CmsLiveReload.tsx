"use client";

import { useEffect } from "react";
import {
  CMS_LIVE_CHANNEL,
  hardRefreshPage,
  shouldSkipLiveReload,
} from "@/lib/cms-live-reload";

/**
 * When CMS images or homepage content are saved, public tabs hard-refresh
 * so the browser does not keep showing the previous cached photos.
 */
export function CmsLiveReload() {
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    let timer: number | null = null;

    const reloadSoon = () => {
      if (shouldSkipLiveReload()) return;
      if (timer != null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        hardRefreshPage();
      }, 400);
    };

    try {
      channel = new BroadcastChannel(CMS_LIVE_CHANNEL);
      channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
        if (event.data?.type === "cms-updated") reloadSoon();
      };
    } catch {
      return undefined;
    }

    return () => {
      if (timer != null) window.clearTimeout(timer);
      channel?.close();
    };
  }, []);

  return null;
}
