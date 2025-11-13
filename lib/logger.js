/**
 * Enhanced error handling and logging utilities
 * Based on eddata-collector pattern
 */

const Package = require('../package.json')

// Prepend timestamp to all console output for better log tracing
const _origConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug ? console.debug.bind(console) : console.log.bind(console)
}

const _ts = () => new Date().toTimeString().substr(0, 8)

// Apply timestamp prefix to all console methods
for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
  console[level] = (...args) => {
    const prefix = `[${_ts()}]`
    if (args.length > 0 && typeof args[0] === 'string') {
      args[0] = `${prefix} ${args[0]}`
      _origConsole[level](...args)
    } else {
      _origConsole[level](prefix, ...args)
    }
  }
}

/**
 * Performance monitoring utilities
 */
const performanceMarks = new Map()

function performanceMark (name) {
  performanceMarks.set(name, performance.now())
}

function getPerformanceDuration (startMark) {
  const start = performanceMarks.get(startMark)
  if (!start) return 0
  return Math.round(performance.now() - start)
}

function getMemoryInfo () {
  const mem = process.memoryUsage()
  return {
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    rss: Math.round(mem.rss / 1024 / 1024),
    external: Math.round(mem.external / 1024 / 1024)
  }
}

/**
 * Error types for better error handling
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, true)
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, true)
  }
}

/**
 * Log application startup
 */
function logStartup() {
  console.log(`EDData WWW v${Package.version} starting`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Node.js: ${process.version}`)
}

/**
 * Log memory usage and performance metrics
 */
function logPerformanceMetrics(startMark = 'app-start') {
  const mem = getMemoryInfo()
  const duration = getPerformanceDuration(startMark)
  
  console.log('Performance Metrics:')
  console.log(`* Runtime: ${duration}ms`)
  console.log(`* Memory (Heap): ${mem.heapUsed}MB / ${mem.heapTotal}MB`)
  console.log(`* Memory (RSS): ${mem.rss}MB`)
}

module.exports = {
  // Performance
  performanceMark,
  getPerformanceDuration,
  getMemoryInfo,
  logPerformanceMetrics,
  
  // Errors
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  
  // Logging
  logStartup
}
