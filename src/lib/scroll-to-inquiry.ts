/** Scroll to #inquiry after navigating to a destination itinerary page */
export function scrollToInquirySection() {
  if (typeof window === "undefined" || window.location.hash !== "#inquiry") return;

  const scroll = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(scroll);
  });
}
