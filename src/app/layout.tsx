import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { isTheme, themeInitScript, THEME_COOKIE_NAME, type Theme } from "@/lib/theme";
import "./globals.css";
import { DevChunkRecovery } from "@/components/providers/DevChunkRecovery";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PlannerScrollHandler } from "@/components/providers/PlannerScrollHandler";
import { PageTransition } from "@/components/providers/PageTransitionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
<<<<<<< HEAD
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "TRAGUIN — Luxury Travel Platform",
=======
import { NikiAgent } from "@/components/layout/NikiAgent";
import { PageLoader } from "@/components/layout/PageLoader";

export const metadata: Metadata = {
  title: {
    default: "TRAGUIN | Luxury Travel Platform",
>>>>>>> dhaval
    template: "%s | TRAGUIN Luxury Travel",
  },
  description:
    "Luxury travel experts crafting extraordinary journeys since 2024. Bespoke destinations, experiences, stays, and white-glove service.",
  keywords: [
    "luxury travel",
    "premium packages",
    "international tours",
    "domestic holidays",
    "luxury hotels",
    "travel expert",
  ],
  openGraph: {
<<<<<<< HEAD
    title: "TRAGUIN — Luxury Travel Platform",
=======
    title: "TRAGUIN | Luxury Travel Platform",
>>>>>>> dhaval
    description: "Travel beyond destinations with curated luxury journeys.",
    type: "website",
  },
  icons: {
    icon: "/traguin-logo.png",
  },
};

async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return isTheme(stored) ? stored : "dark";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverTheme = await getServerTheme();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={serverTheme}
      className="h-full"
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background font-body text-foreground antialiased"
      >
        <Script
          id="traguin-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
<<<<<<< HEAD
        <ThemeProvider>
=======
        <Script
          id="traguin-page-loader-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("page-loader-active");`,
          }}
        />
        <ThemeProvider>
          <PageLoader />
>>>>>>> dhaval
          <DevChunkRecovery />
          <LenisProvider>
            <PlannerScrollHandler />
            <Navigation />
            <PageTransition>{children}</PageTransition>
            <Footer />
<<<<<<< HEAD
            <WhatsAppFloat />
=======
            <NikiAgent />
>>>>>>> dhaval
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
