/**
 * Health check API endpoint for load balancers and monitoring
 * GET /api/health
 */

import { getHealthStatus } from '@/lib/health'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const status = getHealthStatus()
    res.status(200).json(status)
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    })
  }
}
