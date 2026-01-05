/**
 * API Proxy to handle CORS issues with eddata API
 * Proxies requests from /api/proxy/* to https://api.eddata.dev/*
 *
 * Next.js 16 Route Handler Format
 */

import { API_BASE_URL } from '../../../lib/consts'

const ALLOWED_ENDPOINTS = [
  '/v2/system/',
  '/v2/news/',
  '/v2/stats',
  '/v2/endpoints',
  '/v2/health',
  '/v2/version',
  '/v2/backup',
  '/v2/commodities',
  '/v2/market/',
  '/v2/stations',
  '/v2/commodity/',
  '/v2/fleetcarrier/',
  '/api/health',
  '/'
]

export async function GET(request, context) {
  try {
    // Get the path segments from the context params
    const params = await context.params
    const pathSegments = params.path || []
    const targetPath = Array.isArray(pathSegments)
      ? pathSegments.join('/')
      : pathSegments

    // Get the URL to access query parameters
    const { searchParams } = new URL(request.url)

    console.log('[API Proxy] Incoming request:', {
      pathSegments,
      targetPath,
      searchParams: Object.fromEntries(searchParams)
    })

    // Build the target URL
    const targetUrl = `${API_BASE_URL}/${targetPath}`
    const finalUrl = searchParams.toString()
      ? `${targetUrl}?${searchParams.toString()}`
      : targetUrl

    // Security check: only allow specific API endpoints
    const isAllowed = ALLOWED_ENDPOINTS.some(endpoint => {
      const endpointWithoutSlash = endpoint.substring(1)
      const matches = targetPath.startsWith(endpointWithoutSlash)
      console.log('[API Proxy] Check:', {
        endpoint,
        endpointWithoutSlash,
        targetPath,
        matches
      })
      return matches
    })

    console.log('[API Proxy] Final isAllowed:', isAllowed)

    if (!isAllowed) {
      console.error('[API Proxy] BLOCKED:', targetPath)
      return Response.json(
        { error: 'Endpoint not allowed', path: targetPath },
        { status: 403 }
      )
    }

    console.log(`[API Proxy] GET ${finalUrl}`)

    // Make the request to the API
    const apiResponse = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'EDData-WWW-Proxy/1.0',
        Accept: 'application/json'
      }
    })

    // Forward the response with appropriate headers
    const data = await apiResponse.text()

    return new Response(data, {
      status: apiResponse.status,
      headers: {
        'Content-Type':
          apiResponse.headers.get('content-type') || 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('[API Proxy] Error:', error)
    return Response.json(
      {
        error: 'Proxy request failed',
        message: error.message
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
