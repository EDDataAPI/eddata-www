/**
 * Web Vitals tracking for performance monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

export function reportWebVitals(metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(metric)
  }

  // Send to analytics endpoint in production
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType
    })

    // Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body)
    } else {
      fetch('/api/analytics', {
        body,
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(console.error)
    }
  }

  // Optional: Send to external service like Sentry
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //     event_label: metric.id,
  //     non_interaction: true
  //   })
  // }
}
