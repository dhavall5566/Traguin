import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with TRAGUIN luxury travel architects.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
