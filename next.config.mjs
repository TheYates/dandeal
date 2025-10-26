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
  },
}

export default nextConfig
