const path = require('path')
const fs = require('fs')

// Valid config file locations
const EDDATA_CONFIG_LOCATIONS = [
  '/etc/eddata.config',
  path.join(__dirname, '../eddata.config'),
  path.join(__dirname, './eddata.config')
]

// Load configuration file if exists
for (const configPath of EDDATA_CONFIG_LOCATIONS.reverse()) {
  if (fs.existsSync(configPath)) {
    require('dotenv').config({ path: configPath })
    break
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'react-icons',
      'react-hot-toast',
      'react-markdown'
    ],
    // Disable CSS optimization in production builds (requires critters dev dependency)
    optimizeCss: false, // Temporarily disabled due to critters module issues
    scrollRestoration: true
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },

  // Webpack configuration for path resolution
  webpack: (config, context) => {
    config.resolve.modules = config.resolve.modules || []
    config.resolve.modules.push(path.resolve(__dirname))

    // Mark Node.js modules as external for client-side builds
    if (!context.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        dotenv: false
      }
    }

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

  // Environment variables exposed to browser
  env: {
    EDDATA_DOMAIN: process.env.EDDATA_DOMAIN,
    EDDATA_API_BASE_URL: process.env.EDDATA_API_BASE_URL,
    EDDATA_AUTH_BASE_URL: process.env.EDDATA_AUTH_BASE_URL
  },

  // Performance and optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  // Headers for security and performance
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://eddata.dev https://*.eddata.dev",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ')
      }
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders
      },
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache images
      {
        source: '/images/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value:
              'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
