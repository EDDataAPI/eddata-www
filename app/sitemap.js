import { getCommoditiesWithPricing } from 'lib/commodities'

export default async function sitemap() {
  const sitemap = [
    {
      url: 'https://eddata.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://eddata.app/commodities',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7
    },
    {
      url: 'https://eddata.app/about',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.3
    },
    {
      url: 'https://eddata.app/downloads',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.3
    }
  ]

  try {
    // Fetching the live commodities list requires the API to be online.
    // This is wrapped in a try/catch block to suppress errors if the API is
    // unavailable (e.g. when deploying during a maintenance window)
    const commodities = await getCommoditiesWithPricing()
    const symbols = Object.keys(commodities)
      .map(symbol => commodities[symbol])
      .filter(commodity => commodity?.category)
      .map(commodity => commodity.symbol)
      .map(symbol => ({
        url: `https://eddata.app/commodity/${symbol}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.8
      }))
    sitemap.push(...symbols)
  } catch {
    console.warn(
      'WARNING: Skipped building sitemap for commodites - API may be unavailable'
    )
  }

  return sitemap
}
