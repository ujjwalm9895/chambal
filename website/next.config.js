/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Cloud Run compatibility
  output: 'standalone',
}

module.exports = nextConfig
