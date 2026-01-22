/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ REQUIRED for standalone build (Docker)
  output: "standalone",

  images: {
    unoptimized: true,
    domains: ["localhost", "127.0.0.1", "storage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },

  // ✅ use NEXT_PUBLIC_ for frontend
  env: {
    // NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000", // Not needed with Server Actions
  },
};

module.exports = nextConfig;
