/**
 * Analytics endpoint for Web Vitals data
 *
 * Next.js 16 Route Handler Format
 */

export async function POST(request) {
  try {
    const { name, value, rating, id } = await request.json()

    // Log Web Vitals data (in production, send to analytics service)
    console.log('Web Vitals:', { name, value, rating, id })

    // TODO: Send to analytics service (e.g., Google Analytics, Plausible, etc.)
    // await sendToAnalytics({ name, value, rating, id })

    return Response.json({ success: true }, { status: 200 })
  } catch {
    return Response.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    )
  }
}
