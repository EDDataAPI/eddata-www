/**
 * Health check and status endpoints for EDData WWW
 * Based on eddata-collector pattern
 */

const Package = require('../package.json')
const { getMemoryInfo } = require('./logger')
const { IS_PRODUCTION } = require('./consts')

let startTime = Date.now()

/**
 * Basic health check - for load balancers
 */
function getHealthStatus() {
  return {
    status: 'healthy',
    service: 'eddata-www',
    version: Package.version,
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - startTime) / 1000)
  }
}

/**
 * Detailed status with performance metrics
 */
function getDetailedStatus() {
  const uptime = Math.round((Date.now() - startTime) / 1000)
  const memory = getMemoryInfo()
  
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
      heapUsed: `${memory.heapUsed}MB`,
      heapTotal: `${memory.heapTotal}MB`,
      rss: `${memory.rss}MB`
    }
  }
  
  // Only include detailed info in development
  if (!IS_PRODUCTION) {
    status.debug = {
      pid: process.pid,
      platform: process.platform,
      arch: process.arch
    }
  }
  
  return status
}

/**
 * Format uptime in human-readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = seconds % 60
  
  const parts = []
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

/**
 * Reset start time (for testing)
 */
function resetStartTime() {
  startTime = Date.now()
}

module.exports = {
  getHealthStatus,
  getDetailedStatus,
  formatUptime,
  resetStartTime
}
