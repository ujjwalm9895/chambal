/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ REQUIRED for standalone build (Docker)
  output: "standalone",

  images: {
    unoptimized: true,
    domains: ["localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },

  // ✅ use NEXT_PUBLIC_ for frontend
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  },

  // ✅ Explicitly configure Webpack aliases to prevent "Module not found" in Docker
  webpack: (config, { isServer }) => {
    const path = require('path');
    config.resolve.alias['@'] = path.join(__dirname);
    return config;
  },
};

module.exports = nextConfig;
