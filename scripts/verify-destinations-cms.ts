/** One-off verification for destinations CMS wiring. Run: npx tsx scripts/verify-destinations-cms.ts */
import { getDestinationsPageData, getDestinationDetailData } from "../src/lib/api/destinations";

async function main() {
  console.log("=== Destinations page data ===");
  const page = await getDestinationsPageData();
  console.log("Published destinations:", page.destinations.length);
  console.log(
    "Names:",
    page.destinations.map((d) => `${d.id} (${d.name}, itinerary=${d.hasItinerary})`).join(", ")
  );
  console.log("Categories derived:", page.categories.length);
  console.log("Itinerary lookup keys:", [...page.itineraryByDestinationSlug.keys()].join(", ") || "(none)");

  const withItinerary = page.destinations.find((d) => d.hasItinerary);
  const withoutItinerary = page.destinations.find((d) => !d.hasItinerary);

  if (withItinerary) {
    console.log("\n=== Itinerary detail:", withItinerary.id, "===");
    const detail = await getDestinationDetailData(withItinerary.id);
    console.log("Found:", Boolean(detail));
    console.log("Has itinerary:", Boolean(detail?.itinerary));
    console.log("Component:", detail?.itinerary ? "ItineraryDetail" : "DestinationDetail");
    if (detail?.itinerary) {
      console.log("Itinerary title:", detail.itinerary.title);
      console.log("Days:", detail.itinerary.days.length);
    }
  }

  if (withoutItinerary) {
    console.log("\n=== Destination detail:", withoutItinerary.id, "===");
    const detail = await getDestinationDetailData(withoutItinerary.id);
    console.log("Found:", Boolean(detail));
    console.log("Has itinerary:", Boolean(detail?.itinerary));
    console.log("Component:", detail?.itinerary ? "ItineraryDetail" : "DestinationDetail");
  }

  console.log("\n=== Bogus slug ===");
  const missing = await getDestinationDetailData("this-slug-does-not-exist-xyz");
  console.log("Should be null:", missing === null ? "PASS" : "FAIL");

  console.log("\n=== Filter simulation ===");
  const domestic = page.destinations.filter((d) => d.region === "domestic");
  const international = page.destinations.filter((d) => d.region === "international");
  const withItinFilter = page.destinations.filter((d) => d.hasItinerary);
  const exploreFilter = page.destinations.filter((d) => !d.hasItinerary);
  console.log("Domestic count:", domestic.length);
  console.log("International count:", international.length);
  console.log("Full itinerary filter:", withItinFilter.length);
  console.log("Destination guide filter:", exploreFilter.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
