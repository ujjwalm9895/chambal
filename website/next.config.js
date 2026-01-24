/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cms-backend-20v6.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms-backend-20v6.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
  // Vercel deployment - no standalone output needed
}

module.exports = nextConfig
