/**
 * Detailed status API endpoint
 * GET /api/status
 */

import Package from '../../package.json'

function formatUptime(seconds) {
  const parts = []
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = seconds % 60

  if (days > 0) {
    parts.push(`${days}d`)
  }
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  parts.push(`${secs}s`)

  return parts.join(' ')
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const uptime = Math.round(process.uptime())
  const memory = process.memoryUsage()

  const status = {
    service: 'EDData WWW',
    version: Package.version,
    environment: process.env.NODE_ENV || 'development',
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime)
    },
    nodejs: process.version,
    memory: {
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memory.rss / 1024 / 1024)}MB`
    }
  }

  res.status(200).json(status)
}
