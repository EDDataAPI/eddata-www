/**
 * API Proxy to handle CORS issues with eddata API
 * Proxies requests from /api/proxy/* to https://api.eddata.dev/*
 */

import { API_BASE_URL } from '../../../lib/consts'

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Build the target URL
    const { path } = req.query
    const targetPath = Array.isArray(path) ? path.join('/') : path
    const targetUrl = `${API_BASE_URL}/${targetPath}`

    // Add query parameters if they exist
    const queryString = new URLSearchParams(req.query)
    queryString.delete('path') // Remove the path parameter
    const finalUrl = queryString.toString()
      ? `${targetUrl}?${queryString.toString()}`
      : targetUrl

    // Security check: only allow v2/ and api/ endpoints
    const isAllowed =
      targetPath.startsWith('v2/') || targetPath.startsWith('api/')

    if (!isAllowed) {
      console.error(`[API Proxy] Blocked: ${targetPath}`)
      return res
        .status(403)
        .json({ error: 'Endpoint not allowed', path: targetPath })
    }

    console.log(`[API Proxy] ${req.method} ${finalUrl}`)

    // Make the request to the API
    const apiResponse = await fetch(finalUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'EDData-WWW-Proxy/1.0',
        Accept: 'application/json'
      }
    })

    // Forward the response
    const data = await apiResponse.text()

    // Set appropriate headers
    res.setHeader(
      'Content-Type',
      apiResponse.headers.get('content-type') || 'application/json'
    )
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    ) // 5min cache

    return res.status(apiResponse.status).send(data)
  } catch (error) {
    console.error('[API Proxy] Error:', error)
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    })
  }
}
