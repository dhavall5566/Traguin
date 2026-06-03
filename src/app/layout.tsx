import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { isTheme, themeInitScript, THEME_COOKIE_NAME, type Theme } from "@/lib/theme";
import "./globals.css";
import { DevChunkRecovery } from "@/components/providers/DevChunkRecovery";
import { ThreeInit } from "@/components/providers/ThreeInit";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PageTransition } from "@/components/providers/PageTransitionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Traguin — Luxury Travel Platform",
    template: "%s | Traguin Luxury Travel",
  },
  description:
    "Luxury travel concierge crafting extraordinary journeys since 2008. Bespoke destinations, experiences, stays, and white-glove service.",
  keywords: [
    "luxury travel",
    "premium packages",
    "international tours",
    "domestic holidays",
    "luxury hotels",
    "travel concierge",
  ],
  openGraph: {
    title: "Traguin — Luxury Travel Platform",
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
      className={`${playfair.variable} ${jakarta.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background font-body text-foreground antialiased"
      >
        <ThemeProvider>
          <ThreeInit />
          <DevChunkRecovery />
          <LenisProvider>
            <Navigation />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <WhatsAppFloat />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
