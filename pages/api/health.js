/**
 * Health check API endpoint for load balancers and monitoring
 * GET /api/health
 *
 * Next.js 16 Route Handler Format
 */

export async function GET() {
  const startTime = Date.now()

  // Simple health check without external dependencies
  const healthData = {
    status: 'healthy',
    service: 'eddata-www',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  }

  const responseTime = Date.now() - startTime

  return Response.json(healthData, {
    status: 200,
    headers: {
      'X-Response-Time': `${responseTime}ms`
    }
  })
}
