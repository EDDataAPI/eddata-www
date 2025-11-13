const path = require('path')
const fs = require('fs')

// Valid config file locations
const ARDENT_CONFIG_LOCATIONS = [
  '/etc/ardent.config',
  path.join(__dirname, '../ardent.config'),
  path.join(__dirname, './ardent.config')
]

for (const configPath of ARDENT_CONFIG_LOCATIONS.reverse()) {
  if (fs.existsSync(configPath)) require('dotenv').config({ path: configPath })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  // Webpack configuration for path resolution
  webpack: (config, _context) => {
    config.resolve.modules = config.resolve.modules || []
    config.resolve.modules.push(path.resolve(__dirname))
    
    // Bundle analyzer only in ANALYZE mode
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')()
      config.plugins.push(new BundleAnalyzerPlugin())
    }
    
    return config
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/commodities'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/commodity',
        destination: '/commodities',
        permanent: true
      },
      {
        source: '/system',
        destination: '/',
        permanent: false
      },
      {
        source: '/trade-data',
        destination: '/commodity/advancedcatalysers',
        permanent: false
      }
    ]
  },
  env: {
    ARDENT_DOMAIN: process.env.ARDENT_DOMAIN,
    ARDENT_API_BASE_URL: process.env.ARDENT_API_BASE_URL,
    ARDENT_AUTH_BASE_URL: process.env.ARDENT_AUTH_BASE_URL
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
