/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // Disable Turbopack, gunakan Webpack
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
