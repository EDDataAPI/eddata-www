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

  // Helper function to calculate time since update
  const getTimeSinceUpdate = timestamp => {
    const now = new Date()
    const updateTime = new Date(timestamp)
    const diffMs = now - updateTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) {
      return 'just now'
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`
    }
    return `${diffDays}d ago`
  }

  // Helper to calculate percentage
  const getPercentage = (part, whole) => {
    if (!whole || whole === 0) {
      return 0
    }
    return ((part / whole) * 100).toFixed(1)
  }

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
      // Primary health endpoint with uptime (local)
      const healthRes = await fetch('/api/health')
      if (healthRes.ok) {
        const healthData = await healthRes.json()

        // Get database health and stats via proxy
        const [dbRes, statsRes, versionRes, dbSizeRes] = await Promise.all([
          fetch('/api/proxy/api/health/database').catch(() => null),
          fetch('/api/proxy/v2/stats').catch(() => null),
          fetch('/api/proxy/v2/version').catch(() => null),
          fetch('/api/proxy/v2/stats/database/size').catch(() => null)
        ])

        const dbData = dbRes?.ok ? await dbRes.json() : null
        const statsData = statsRes?.ok ? await statsRes.json() : null
        const versionData = versionRes?.ok ? await versionRes.json() : null
        const dbSizeData = dbSizeRes?.ok ? await dbSizeRes.json() : null

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
          databaseSize: dbSizeData?.summary || null,
          lastUpdated: statsData?.timestamp || null
        })
      } else {
        // Fallback to v2/health via proxy if local health fails
        const v2HealthRes = await fetch('/api/proxy/v2/health')
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

  // Progress bar component
  const ProgressBar = ({ current, total, color = '#00ff00' }) => {
    const percentage = (current / total) * 100
    return (
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginTop: '0.5rem'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s'
          }}
        />
      </div>
    )
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
      </div>

      {/* Database Statistics - Full Width */}
      {apiStatus && !apiStatus.error && apiStatus.statistics && (
        <div style={{ marginTop: '2rem' }}>
          <h2
            style={{
              color: 'white',
              textTransform: 'uppercase',
              borderBottom: '2px solid #00ff00',
              paddingBottom: '0.5rem',
              display: 'inline-block',
              marginBottom: '2rem'
            }}
          >
            Database Statistics
          </h2>

          {/* Overview Cards */}
          <div
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}
          >
            {/* Systems Card */}
            <div
              style={{
                border: '2px solid #00ff00',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(0,255,0,0.02)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌌</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.systems?.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Star Systems
              </div>
            </div>

            {/* Stations Card */}
            <div
              style={{
                border: '2px solid #2196F3',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(33,150,243,0.02)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏢</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.stations?.stations?.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.75rem'
                }}
              >
                Stations
              </div>
              <div
                style={{
                  color: '#2196F3',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.stations?.updatedInLast24Hours?.toLocaleString()}{' '}
                updated (
                {getPercentage(
                  apiStatus.statistics.stations?.updatedInLast24Hours,
                  apiStatus.statistics.stations?.stations
                )}
                %)
              </div>
              <ProgressBar
                current={apiStatus.statistics.stations?.updatedInLast24Hours}
                total={apiStatus.statistics.stations?.stations}
                color='#2196F3'
              />
            </div>

            {/* Fleet Carriers Card */}
            <div
              style={{
                border: '2px solid #FF6F00',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(255,111,0,0.02)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.stations?.carriers?.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.75rem'
                }}
              >
                Fleet Carriers
              </div>
              <div
                style={{
                  color: '#FF6F00',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.stations?.stations &&
                apiStatus.statistics.stations?.carriers
                  ? getPercentage(
                      apiStatus.statistics.stations?.carriers,
                      apiStatus.statistics.stations?.stations +
                        apiStatus.statistics.stations?.carriers
                    )
                  : 0}
                % of total
              </div>
              <ProgressBar
                current={apiStatus.statistics.stations?.carriers}
                total={
                  apiStatus.statistics.stations?.stations +
                  apiStatus.statistics.stations?.carriers
                }
                color='#FF6F00'
              />
            </div>

            {/* Trade Card */}
            <div
              style={{
                border: '2px solid #FF9500',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(255,149,0,0.02)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.trade?.orders?.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.75rem'
                }}
              >
                Trade Orders
              </div>
              <div
                style={{
                  color: '#FF9500',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.trade?.updatedInLast24Hours?.toLocaleString()}{' '}
                updated (
                {getPercentage(
                  apiStatus.statistics.trade?.updatedInLast24Hours,
                  apiStatus.statistics.trade?.orders
                )}
                %)
              </div>
              <ProgressBar
                current={apiStatus.statistics.trade?.updatedInLast24Hours}
                total={apiStatus.statistics.trade?.orders}
                color='#FF9500'
              />
            </div>

            {/* Markets Card */}
            <div
              style={{
                border: '2px solid #4CAF50',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(76,175,80,0.02)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏪</div>
              <div
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {apiStatus.statistics.trade?.markets?.toLocaleString()}
              </div>
              <div
                style={{
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Markets
              </div>
              <div
                style={{
                  color: '#4CAF50',
                  fontSize: '0.9rem',
                  marginTop: '0.75rem'
                }}
              >
                {apiStatus.statistics.trade?.uniqueCommodities} unique
                commodities
              </div>
            </div>

            {/* Points of Interest Card */}
            {apiStatus.statistics.pointsOfInterest && (
              <div
                style={{
                  border: '2px solid #9C27B0',
                  borderRadius: '12px',
                  padding: '2rem',
                  background: 'rgba(156,39,176,0.02)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  🌟
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {apiStatus.statistics.pointsOfInterest.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Points of Interest
                </div>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <h3
              style={{
                color: '#888',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Activity Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <div>
                <div
                  style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  Total Updated in 24h
                </div>
                <div
                  style={{
                    color: '#00ff00',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {apiStatus.statistics.updatedInLast24Hours?.toLocaleString()}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  Last Update
                </div>
                <div
                  style={{
                    color: '#FFD700',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getTimeSinceUpdate(apiStatus.lastUpdated)}
                </div>
              </div>
            </div>
          </div>

          {/* Database Size */}
          {apiStatus.databaseSize && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <h3
                style={{
                  color: '#888',
                  margin: '0 0 1rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Storage Information
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem'
                }}
              >
                <div>
                  <div
                    style={{
                      color: '#888',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Total Size
                  </div>
                  <div
                    style={{
                      color: '#64c8ff',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {apiStatus.databaseSize.totalEstimatedSizeGB?.toFixed(2)} GB
                  </div>
                  <div
                    style={{
                      color: '#666',
                      fontSize: '0.8rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    {apiStatus.databaseSize.totalEstimatedSizeMB?.toLocaleString()}{' '}
                    MB
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: '#888',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Total Records
                  </div>
                  <div
                    style={{
                      color: '#00ff00',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {apiStatus.databaseSize.totalRecords?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Metadata */}
          {apiStatus.lastUpdated && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                fontSize: '0.85rem',
                color: '#666',
                textAlign: 'right'
              }}
            >
              Stats Updated: {new Date(apiStatus.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
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
