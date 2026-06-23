import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isPriceOnRequest(amount: number, onRequest?: boolean) {
  return onRequest ?? amount <= 0;
}

export function formatPriceLabel(amount: number, onRequest?: boolean) {
  return isPriceOnRequest(amount, onRequest) ? "Inquire for price" : formatPrice(amount);
}
