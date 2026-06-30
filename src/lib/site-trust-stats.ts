import { trustHighlights } from "@/data/pageContent";

export type TrustHighlight = {
  value: string;
  label: string;
};

/** Site-wide trust bar stats — shared by Destinations, Client Stories, and all inner pages. */
export function getSiteTrustHighlights(): TrustHighlight[] {
  return [...trustHighlights];
}
