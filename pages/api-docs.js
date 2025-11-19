import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Layout from 'components/layout'
import { NavigationContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'

export default function ApiDocsPage() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [endpoints, setEndpoints] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNavigationPath([
      { name: 'System Status', path: '/status' },
      { name: 'API Documentation', path: '/api-docs' }
    ])
    loadEndpoints()
  }, [setNavigationPath])

  const loadEndpoints = async () => {
    setLoading(true)

    try {
      // Try to fetch endpoints dynamically first via proxy
      const endpointsRes = await fetch('/api/proxy/v2/endpoints')
      if (endpointsRes.ok) {
        const data = await endpointsRes.json()
        setEndpoints(data)
      } else {
        // Fallback to manually curated list (should not be needed anymore)
        setEndpoints({
          error: `Failed to load endpoints: ${endpointsRes.status}`,
          fallback: true,
          general: [
            {
              method: 'GET',
              path: '/api/health',
              description: 'Primary API health with version & uptime',
              category: 'Health'
            },
            {
              method: 'GET',
              path: '/v2/version',
              description: 'API version information',
              category: 'Information'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to load endpoints:', error)
      setEndpoints({
        error: 'Failed to load API documentation - network error'
      })
    }

    setLoading(false)
  }

  if (!mounted) {
    return null
  }

  const getMethodColor = method => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return '#4CAF50'
      case 'POST':
        return '#2196F3'
      case 'PUT':
        return '#FF9500'
      case 'DELETE':
        return '#f44336'
      default:
        return '#888'
    }
  }

  const renderEndpointGroup = (title, endpoints) => (
    <div key={title} style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          color: 'white',
          margin: '0 0 1rem 0',
          textTransform: 'uppercase',
          borderBottom: '2px solid #00ff00',
          paddingBottom: '0.5rem',
          display: 'inline-block'
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '1rem',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <span
              style={{
                background: getMethodColor(endpoint.method),
                color: 'white',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                minWidth: '60px',
                textAlign: 'center'
              }}
            >
              {endpoint.method}
            </span>
            <code
              style={{
                fontFamily: 'monospace',
                color: '#00ff00',
                fontSize: '1rem',
                flex: '0 0 auto'
              }}
            >
              {endpoint.path}
            </code>
            <span style={{ color: '#888', flex: 1 }}>
              {endpoint.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Layout>
      <Head>
        <title>API Documentation • EDData</title>
      </Head>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              color: 'white',
              textTransform: 'uppercase',
              borderBottom: '2px solid #00ff00',
              paddingBottom: '0.5rem',
              display: 'inline-block',
              margin: 0
            }}
          >
            API Documentation
          </h2>
          <p style={{ color: '#888', marginTop: '1rem' }}>
            Complete reference for all available EDData API endpoints
          </p>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <button
            onClick={loadEndpoints}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            {loading ? 'Loading...' : 'Refresh Documentation'}
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            Loading API documentation...
          </div>
        ) : endpoints?.error ? (
          <div
            style={{ color: '#ff4444', textAlign: 'center', padding: '2rem' }}
          >
            {endpoints.error}
          </div>
        ) : endpoints ? (
          <div>
            <div
              style={{
                background: 'rgba(0,255,0,0.05)',
                border: '1px solid rgba(0,255,0,0.2)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem'
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                Base URL:{' '}
                <code style={{ color: '#00ff00' }}>
                  {endpoints.baseUrl || API_BASE_URL}
                </code>
              </div>
              <div
                style={{
                  color: '#888',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}
              >
                All endpoints should be prefixed with the base URL above
              </div>
              {endpoints.totalEndpoints && (
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  📊 Total Available Endpoints:{' '}
                  <strong>{endpoints.totalEndpoints}</strong>
                </div>
              )}
              {endpoints.note && (
                <div
                  style={{
                    color: '#FF9500',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem'
                  }}
                >
                  ℹ️ {endpoints.note}
                </div>
              )}
              {endpoints.timestamp && (
                <div
                  style={{
                    color: '#888',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                  }}
                >
                  Last updated: {new Date(endpoints.timestamp).toLocaleString()}
                </div>
              )}
            </div>

            {endpoints.categories ? (
              Object.entries(endpoints.categories).map(
                ([category, endpointList]) =>
                  renderEndpointGroup(
                    category.charAt(0).toUpperCase() + category.slice(1),
                    endpointList
                  )
              )
            ) : endpoints.fallback ? (
              <div>
                <div
                  style={{
                    background: 'rgba(255,149,0,0.1)',
                    border: '1px solid rgba(255,149,0,0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '2rem'
                  }}
                >
                  <div style={{ color: '#FF9500', fontWeight: 'bold' }}>
                    ⚠️ Using Fallback Data
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>
                    Could not load dynamic endpoints. Showing basic fallback
                    information.
                  </div>
                </div>
                {Object.entries(endpoints).map(([category, endpointList]) =>
                  category !== 'error' &&
                  category !== 'fallback' &&
                  Array.isArray(endpointList)
                    ? renderEndpointGroup(category, endpointList)
                    : null
                )}
              </div>
            ) : (
              <div
                style={{ color: '#888', textAlign: 'center', padding: '2rem' }}
              >
                Unexpected data format received
              </div>
            )}

            <div
              style={{
                marginTop: '3rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            >
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>
                Additional Information
              </h4>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>
                <p>• All responses are in JSON format</p>
                <p>• Rate limiting may apply to prevent abuse</p>
                <p>
                  • Parameters in curly braces {'{}'} should be replaced with
                  actual values
                </p>
                <p>• Some endpoints may require authentication in the future</p>
                <p>
                  • For detailed parameter information, test endpoints directly
                  or contact the API team
                </p>
                {endpoints.version && (
                  <p>
                    • API Version: <strong>{endpoints.version}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No documentation available
          </div>
        )}
      </div>
    </Layout>
  )
}
