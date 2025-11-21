/**
 * Health check API endpoint for load balancers and monitoring
 * GET /api/health
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()

  // Simple health check without external dependencies
  const healthData = {
    status: 'healthy',
    service: 'eddata-www',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  }

  const responseTime = Date.now() - startTime
  res.setHeader('X-Response-Time', `${responseTime}ms`)
  res.status(200).json(healthData)
}
