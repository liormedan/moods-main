/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Suppress warnings about missing dependencies
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Handle static files
  async rewrites() {
    return []
  },
  
  // Force localhost in development
  ...(process.env.NODE_ENV === 'development' && {
    // Disable prefetching to prevent production URL issues
    experimental: {
      optimizePackageImports: [],
    },
  }),
  
  // Suppress webpack cache warnings
  webpack: (config, { isServer }) => {
    // Suppress PackFileCacheStrategy warning
    if (!isServer) {
      config.ignoreWarnings = [
        { module: /webpack\.cache\.PackFileCacheStrategy/ },
      ]
    }
    return config
  },
}

export default nextConfig
