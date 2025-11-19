/**
 * Health check API endpoint for load balancers and monitoring
 * GET /api/health
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple health check without external dependencies
  res.status(200).json({
    status: 'healthy',
    service: 'eddata-www',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  })
}
