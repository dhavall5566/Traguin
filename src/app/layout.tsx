import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isTheme, themeInitScript, THEME_COOKIE_NAME, type Theme } from "@/lib/theme";
import "./globals.css";
import { DevChunkRecovery } from "@/components/providers/DevChunkRecovery";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PageTransition } from "@/components/providers/PageTransitionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "TRAGUIN — Luxury Travel Platform",
    template: "%s | TRAGUIN Luxury Travel",
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
    title: "TRAGUIN — Luxury Travel Platform",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background font-body text-foreground antialiased"
      >
        <ThemeProvider>
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
