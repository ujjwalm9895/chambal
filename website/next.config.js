/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cms-backend-20v6.onrender.com', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms-backend-20v6.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  // Disable ISR memory cache to ensure real-time updates
  isrMemoryCacheSize: 0,
}

module.exports = nextConfig
