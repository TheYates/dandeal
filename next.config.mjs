/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable compression
  compress: true,
  // Enable strict mode for better performance
  reactStrictMode: true,
  // Optimize server rendering
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'lucide-react', 'framer-motion'],
    // Disable Turbopack to use stable webpack
    turbo: false,
  },
}

export default nextConfig
