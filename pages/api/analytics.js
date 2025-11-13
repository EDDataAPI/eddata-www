/**
 * Analytics endpoint for Web Vitals data
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, value, rating, id } = req.body

    // Log Web Vitals data (in production, send to analytics service)
    console.log('Web Vitals:', { name, value, rating, id })

    // TODO: Send to analytics service (e.g., Google Analytics, Plausible, etc.)
    // await sendToAnalytics({ name, value, rating, id })

    res.status(200).json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to process analytics data' })
  }
}
