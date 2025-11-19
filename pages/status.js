import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/layout'
import { NavigationContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'

export default function StatusPage() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [localStatus, setLocalStatus] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [apiPerformance, setApiPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only showing content after mount
  useEffect(() => {
    setMounted(true)
    setNavigationPath([{ name: 'System Status', path: '/status' }])
    loadStatusData()
  }, [setNavigationPath])

  const loadStatusData = async () => {
    setLoading(true)

    // Track API performance
    const performanceStart = Date.now()

    // Load local status
    try {
      const localRes = await fetch('/api/status')
      if (localRes.ok) {
        setLocalStatus(await localRes.json())
      } else {
        setLocalStatus({ error: `Local API error: ${localRes.status}` })
      }
    } catch (e) {
      setLocalStatus({ error: 'Failed to load local status' })
    }

    // Load comprehensive API status using all available endpoints
    try {
      // Primary health endpoint with uptime
      const healthRes = await fetch(`${API_BASE_URL}/api/health`)
      if (healthRes.ok) {
        const healthData = await healthRes.json()

        // Get database health and stats
        const [dbRes, statsRes, versionRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/health/database`).catch(() => null),
          fetch(`${API_BASE_URL}/v2/stats`).catch(() => null),
          fetch(`${API_BASE_URL}/v2/version`).catch(() => null)
        ])

        const dbData = dbRes?.ok ? await dbRes.json() : null
        const statsData = statsRes?.ok ? await statsRes.json() : null
        const versionData = versionRes?.ok ? await versionRes.json() : null

        const totalTime = Date.now() - performanceStart
        setApiPerformance({
          totalResponseTime: totalTime,
          healthResponseTime: healthRes.headers.get('X-Response-Time') || 'N/A',
          lastCheck: new Date().toISOString()
        })

        setApiStatus({
          service: 'EDData API',
          status: healthData.status,
          version: healthData.version || versionData?.version || '1.0.0',
          uptime: healthData.uptime,
          timestamp: healthData.timestamp,
          database: dbData?.database || null,
          statistics: statsData || null,
          lastUpdated: statsData?.timestamp || null
        })
      } else {
        // Fallback to v2/health if api/health fails
        const v2HealthRes = await fetch(`${API_BASE_URL}/v2/health`)
        if (v2HealthRes.ok) {
          const v2HealthData = await v2HealthRes.json()
          const totalTime = Date.now() - performanceStart
          setApiPerformance({
            totalResponseTime: totalTime,
            fallbackUsed: true,
            lastCheck: new Date().toISOString()
          })
          setApiStatus({
            service: 'EDData API',
            status:
              v2HealthData.status === 'ok' ? 'healthy' : v2HealthData.status,
            uptime: v2HealthData.uptime,
            timestamp: v2HealthData.timestamp
          })
        } else {
          setApiStatus({ error: `API error: ${healthRes.status}` })
        }
      }
    } catch (e) {
      setApiStatus({ error: 'Failed to load API status' })
    }

    setLoading(false)
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <Layout>
      <Head>
        <title>System Status • EDData</title>
      </Head>

      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
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
          System Status
        </h2>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <button
          onClick={loadStatusData}
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
          {loading ? 'Loading...' : 'Refresh Status'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}
      >
        {/* Frontend Status */}
        <div
          style={{
            border: `2px solid ${localStatus?.error ? '#ff4444' : '#00ff00'}`,
            borderRadius: '8px',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>
            Frontend (eddata-www)
          </h3>

          {localStatus?.error ? (
            <div style={{ color: '#ff4444' }}>{localStatus.error}</div>
          ) : localStatus ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Status:</span>
                <span style={{ color: '#00ff00' }}>Healthy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Version:</span>
                <span style={{ color: 'white' }}>{localStatus.version}</span>
              </div>
              {localStatus.uptime && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Uptime:</span>
                  <span style={{ color: 'white' }}>
                    {localStatus.uptime.formatted}
                  </span>
                </div>
              )}
              {localStatus.environment && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Environment:</span>
                  <span style={{ color: 'white' }}>
                    {localStatus.environment}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#888' }}>Loading...</div>
          )}
        </div>
        {/* API Status */}
        <div
          style={{
            border: `2px solid ${apiStatus?.error ? '#ff4444' : '#00ff00'}`,
            borderRadius: '8px',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>API Backend</h3>

          {apiStatus?.error ? (
            <div style={{ color: '#ff4444' }}>{apiStatus.error}</div>
          ) : apiStatus ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Status:</span>
                <span style={{ color: '#00ff00' }}>Healthy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Service:</span>
                <span style={{ color: 'white' }}>
                  {apiStatus.service || 'EDData API'}
                </span>
              </div>
              {apiStatus.uptime && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Uptime:</span>
                  <span style={{ color: 'white' }}>
                    {Math.floor(apiStatus.uptime / 3600)}h{' '}
                    {Math.floor((apiStatus.uptime % 3600) / 60)}m
                  </span>
                </div>
              )}
              {apiStatus.timestamp && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Last Check:</span>
                  <span style={{ color: 'white' }}>
                    {new Date(apiStatus.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
              {apiStatus.database && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: '#888' }}>Database:</span>
                    <span
                      style={{
                        color: apiStatus.database.connected
                          ? '#00ff00'
                          : '#ff4444'
                      }}
                    >
                      {apiStatus.database.connected
                        ? 'Connected'
                        : 'Disconnected'}
                    </span>
                  </div>
                  {apiStatus.database.systems && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: '#888' }}>Systems in DB:</span>
                      <span style={{ color: 'white' }}>
                        {apiStatus.database.systems.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {apiStatus.database.stations && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: '#888' }}>Stations in DB:</span>
                      <span style={{ color: 'white' }}>
                        {apiStatus.database.stations.toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={{ color: '#888' }}>Loading...</div>
          )}
        </div>

        {/* Performance Metrics Card */}
        {apiPerformance && (
          <div
            style={{
              border: '2px solid #FF9500',
              borderRadius: '8px',
              padding: '1.5rem',
              background: 'rgba(255,149,0,0.02)'
            }}
          >
            <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>
              API Performance
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Total Response Time:</span>
                <span
                  style={{
                    color:
                      apiPerformance.totalResponseTime > 2000
                        ? '#ff4444'
                        : apiPerformance.totalResponseTime > 1000
                          ? '#FF9500'
                          : '#00ff00'
                  }}
                >
                  {apiPerformance.totalResponseTime}ms
                </span>
              </div>
              {apiPerformance.healthResponseTime && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Health Endpoint:</span>
                  <span style={{ color: 'white' }}>
                    {apiPerformance.healthResponseTime}
                  </span>
                </div>
              )}
              {apiPerformance.fallbackUsed && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Fallback Used:</span>
                  <span style={{ color: '#FF9500' }}>v2/health endpoint</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Last Performance Check:</span>
                <span style={{ color: 'white' }}>
                  {new Date(apiPerformance.lastCheck).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Statistics Card */}
        {apiStatus && !apiStatus.error && apiStatus.statistics && (
          <div
            style={{
              border: '2px solid #00ff00',
              borderRadius: '8px',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.02)',
              gridColumn: 'span 2'
            }}
          >
            <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>
              Database Statistics
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Total Systems:</span>
                <span style={{ color: 'white' }}>
                  {apiStatus.statistics.systems?.toLocaleString()}
                </span>
              </div>
              {apiStatus.statistics.pointsOfInterest && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Points of Interest:</span>
                  <span style={{ color: 'white' }}>
                    {apiStatus.statistics.pointsOfInterest.toLocaleString()}
                  </span>
                </div>
              )}
              {apiStatus.statistics.stations && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: '#888' }}>Stations:</span>
                    <span style={{ color: 'white' }}>
                      {apiStatus.statistics.stations.stations?.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: '#888' }}>Fleet Carriers:</span>
                    <span style={{ color: 'white' }}>
                      {apiStatus.statistics.stations.carriers?.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              {apiStatus.statistics.trade && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: '#888' }}>Trade Orders:</span>
                    <span style={{ color: 'white' }}>
                      {apiStatus.statistics.trade.orders?.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: '#888' }}>Markets:</span>
                    <span style={{ color: 'white' }}>
                      {apiStatus.statistics.trade.markets?.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              {apiStatus.statistics.updatedInLast24Hours && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Updated (24h):</span>
                  <span style={{ color: 'white' }}>
                    {apiStatus.statistics.updatedInLast24Hours.toLocaleString()}
                  </span>
                </div>
              )}
              {apiStatus.lastUpdated && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#888' }}>Stats Updated:</span>
                  <span style={{ color: 'white' }}>
                    {new Date(apiStatus.lastUpdated).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px'
        }}
      >
        <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>Quick Links</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href='/api-docs'
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(0,255,0,0.1)',
              border: '1px solid rgba(0,255,0,0.3)',
              color: '#00ff00',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background 0.3s'
            }}
          >
            📚 API Documentation
          </Link>
          <button
            onClick={() => window.open(`${API_BASE_URL}`, '_blank')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔗 API Base URL
          </button>
        </div>
      </div>
    </Layout>
  )
}
