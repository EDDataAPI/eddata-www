/**
 * Sentry Configuration for Error Tracking
 * Initialize Sentry in production for error monitoring
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Environment
    environment: process.env.NODE_ENV,
    release: process.env.npm_package_version,

    // Error filtering
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Network errors
      'NetworkError',
      'Failed to fetch'
    ],

    // Breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console') {
        return null
      }
      return breadcrumb
    },

    // Custom error processing
    beforeSend(event, hint) {
      // Don't send errors in development
      if (process.env.NODE_ENV === 'development') {
        return null
      }

      // Filter out known errors
      if (event.exception) {
        const error = hint.originalException
        if (
          error &&
          error.message &&
          error.message.includes('ResizeObserver')
        ) {
          return null
        }
      }

      return event
    }
  })
}

export default Sentry
