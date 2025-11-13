/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://eddata.app',
  generateRobotsTxt: false, // robots.txt manually maintained
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/auth/*',
    '/_app',
    '/_document',
    '/_error',
    '/404',
    '/500',
    '/_test'
  ],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority for specific routes
    const customPriority = {
      '/': 1.0,
      '/commodities': 0.9,
      '/about': 0.8,
      '/news': 0.8
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: customPriority[path] || config.priority,
      lastmod: new Date().toISOString()
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      }
    ]
  }
}
