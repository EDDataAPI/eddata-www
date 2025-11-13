/**
 * Detailed status API endpoint
 * GET /api/status
 */

import { getDetailedStatus } from '@/lib/health'
import { IS_PRODUCTION } from '@/lib/consts'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Only allow in development or with specific auth token
  if (
    IS_PRODUCTION &&
    req.headers.authorization !== `Bearer ${process.env.STATUS_TOKEN}`
  ) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  try {
    const status = getDetailedStatus()
    res.status(200).json(status)
  } catch {
    res.status(500).json({
      error: 'Status check failed',
      timestamp: new Date().toISOString()
    })
  }
}
