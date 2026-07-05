import type { NextConfig } from "next";

const cmsApiBase = (process.env.CMS_API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "gsap"],
  },
  async rewrites() {
    return [
      {
        source: "/cms-uploads/:path*",
        destination: `${cmsApiBase}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/hotels", destination: "/luxury-stays", permanent: true },
      { source: "/concierge", destination: "/travel-expert", permanent: true },
      { source: "/always-on-demand", destination: "/travel-expert", permanent: true },
      { source: "/packages", destination: "/destinations", permanent: true },
      { source: "/packages/domestic", destination: "/destinations", permanent: true },
      { source: "/packages/international", destination: "/destinations", permanent: true },
      { source: "/experiences", destination: "/#experiences", permanent: false },
      { source: "/itineraries", destination: "/destinations", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
    ],
  },
};

export default nextConfig;
