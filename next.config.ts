import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product / brand art is served from /public today. When assets move to
    // Supabase Storage, add the project host here and nothing else changes.
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
