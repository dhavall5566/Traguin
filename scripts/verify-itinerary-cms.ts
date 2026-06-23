/** Verification for itinerary CMS wiring. Run: CMS_API_URL=http://127.0.0.1:8001 npx tsx scripts/verify-itinerary-cms.ts */
import {
  getItineraryDetailBySlug,
  getItineraryDetailForDestinationSlug,
} from "../src/lib/api/itineraries";

function printItinerary(label: string, data: Awaited<ReturnType<typeof getItineraryDetailBySlug>>) {
  console.log(`\n=== ${label} ===`);
  if (!data) {
    console.log("NOT FOUND");
    return;
  }
  const { itinerary, destinationName } = data;
  console.log("Title:", itinerary.title);
  console.log("Destination:", destinationName);
  console.log("Days:", itinerary.days.length, itinerary.days.map((d) => `D${d.day}:${d.title}(${d.activities.length} activities)`).join(", "));
  console.log("Hotels:", itinerary.hotels.map((h) => h.name).join(", ") || "(none)");
  console.log("Highlights:", itinerary.highlights.length, itinerary.highlights.join(" | "));
  console.log("Included:", itinerary.included.join(" | ") || "(none)");
  console.log("Excluded:", itinerary.excluded.join(" | ") || "(none)");
  console.log("Gallery images:", itinerary.gallery.length);
  console.log("FAQs:", itinerary.faq.length);
  console.log("Price:", itinerary.startingPrice, "Duration:", itinerary.duration);
}

async function main() {
  printItinerary(
    "Destination slug bali-1781974115",
    await getItineraryDetailForDestinationSlug("bali-1781974115")
  );
  printItinerary(
    "Itinerary slug itin-bali-1781974115",
    await getItineraryDetailBySlug("itin-bali-1781974115")
  );
  printItinerary("Bogus slug", await getItineraryDetailBySlug("does-not-exist"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
