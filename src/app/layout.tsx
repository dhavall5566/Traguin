import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { isTheme, themeInitScript, THEME_COOKIE_NAME, type Theme } from "@/lib/theme";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "TRAGUIN | Luxury Travel Platform",
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
    title: "TRAGUIN | Luxury Travel Platform",
    description: "Travel beyond destinations with curated luxury journeys.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
        <ThemeProvider initialTheme={serverTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
