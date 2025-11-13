/**
 * Prometheus Metrics Endpoint
 * Exposes application metrics in Prometheus format
 */

let requestCount = 0
let errorCount = 0
const startTime = Date.now()

// Middleware to track requests
export function trackRequest() {
  requestCount++
}

export function trackError() {
  errorCount++
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const uptime = Math.floor((Date.now() - startTime) / 1000)
  const memoryUsage = process.memoryUsage()

  const metrics = `
# HELP eddata_www_requests_total Total number of HTTP requests
# TYPE eddata_www_requests_total counter
eddata_www_requests_total ${requestCount}

# HELP eddata_www_errors_total Total number of errors
# TYPE eddata_www_errors_total counter
eddata_www_errors_total ${errorCount}

# HELP eddata_www_uptime_seconds Application uptime in seconds
# TYPE eddata_www_uptime_seconds gauge
eddata_www_uptime_seconds ${uptime}

# HELP eddata_www_memory_heap_used_bytes Memory heap used in bytes
# TYPE eddata_www_memory_heap_used_bytes gauge
eddata_www_memory_heap_used_bytes ${memoryUsage.heapUsed}

# HELP eddata_www_memory_heap_total_bytes Memory heap total in bytes
# TYPE eddata_www_memory_heap_total_bytes gauge
eddata_www_memory_heap_total_bytes ${memoryUsage.heapTotal}

# HELP eddata_www_memory_rss_bytes Resident set size in bytes
# TYPE eddata_www_memory_rss_bytes gauge
eddata_www_memory_rss_bytes ${memoryUsage.rss}

# HELP eddata_www_memory_external_bytes External memory in bytes
# TYPE eddata_www_memory_external_bytes gauge
eddata_www_memory_external_bytes ${memoryUsage.external}
`.trim()

  res.setHeader('Content-Type', 'text/plain; version=0.0.4')
  res.status(200).send(metrics)
}
