"use client";

import { MessageCircle } from "lucide-react";
import { contactInfo } from "@/data/contact";

export function WhatsAppFloat() {
  return (
    <a
      href={contactInfo.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="currentColor" />
    </a>
  );
}
