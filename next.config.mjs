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
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Suppress PackFileCacheStrategy warning
    if (!isServer) {
      config.ignoreWarnings = [
        { module: /webpack\.cache\.PackFileCacheStrategy/ },
      ]
    }
    
    // Production optimizations for chunk loading
    if (!isServer && !dev) {
      // Use contenthash for better caching and stable chunk names
      config.output.chunkFilename = 'static/chunks/[name].[contenthash].js'
    }
    
    return config
  },
}

export default nextConfig
