"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Hotel } from "@/types";
import { HotelDetailContent } from "@/components/hotels/HotelDetailContent";
import { PageShell } from "@/components/layout/PageShell";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";

type HotelDetailPageProps = {
  hotel: Hotel;
  allHotels: Hotel[];
};

export function HotelDetailPage({ hotel, allHotels }: HotelDetailPageProps) {
  return (
    <article>
      <div className="border-b border-glass-border bg-surface/80">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/luxury-stays"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={16} aria-hidden />
            All luxury stays
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-b-3xl border-x border-b border-glass-border bg-surface shadow-xl">
        <HotelDetailContent hotel={hotel} allHotels={allHotels} similarLinkMode="navigate" />
      </div>

      <TrustBar />
      <PageShell noPaddingTop>
        <PageCTA />
      </PageShell>
    </article>
  );
}
