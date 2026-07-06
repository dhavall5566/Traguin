export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isGoogleAnalyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}
