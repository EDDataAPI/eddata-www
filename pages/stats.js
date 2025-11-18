import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { NavigationContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'

export default function StatsPage() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNavigationPath([{ name: 'Database Statistics', path: '/stats' }])
    loadStats()
  }, [setNavigationPath])

  const loadStats = async () => {
    setLoading(true)

    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch(`${API_BASE_URL}/v2/stats`),
        fetch(`${API_BASE_URL}/api/health/database`).catch(() => null)
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        const healthData = healthRes?.ok ? await healthRes.json() : null

        setStats({
          ...statsData,
          database: healthData?.database || null
        })
      } else {
        setStats({ error: `Failed to load stats: ${statsRes.status}` })
      }
    } catch (error) {
      setStats({ error: 'Failed to load statistics' })
    }

    setLoading(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Database Statistics • EDData</title>
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
            Database Statistics
          </h2>
          <p style={{ color: '#888', marginTop: '1rem' }}>
            Real-time statistics and metrics from the EDData database
          </p>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <button
            onClick={loadStats}
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
            {loading ? 'Loading...' : 'Refresh Statistics'}
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            Loading statistics...
          </div>
        ) : stats?.error ? (
          <div
            style={{ color: '#ff4444', textAlign: 'center', padding: '2rem' }}
          >
            {stats.error}
          </div>
        ) : stats ? (
          <div style={{ display: 'grid', gap: '2rem' }}>
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
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  🌌
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {stats.systems?.toLocaleString()}
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
                {stats.database?.systems && (
                  <div
                    style={{
                      color: '#00ff00',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    DB: {stats.database.systems.toLocaleString()}
                  </div>
                )}
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
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  🚀
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {(
                    stats.stations?.stations + stats.stations?.carriers
                  )?.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Total Stations & Carriers
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem'
                  }}
                >
                  <div>
                    <div style={{ color: '#2196F3', fontWeight: 'bold' }}>
                      {stats.stations?.stations?.toLocaleString()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Stations
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#2196F3', fontWeight: 'bold' }}>
                      {stats.stations?.carriers?.toLocaleString()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Fleet Carriers
                    </div>
                  </div>
                </div>
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
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  💰
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {stats.trade?.orders?.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Trade Orders
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem'
                  }}
                >
                  <div>
                    <div style={{ color: '#FF9500', fontWeight: 'bold' }}>
                      {stats.trade?.markets?.toLocaleString()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Markets
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#FF9500', fontWeight: 'bold' }}>
                      {stats.trade?.uniqueCommodities}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Commodities
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div
                style={{
                  border: '2px solid #4CAF50',
                  borderRadius: '12px',
                  padding: '2rem',
                  background: 'rgba(76,175,80,0.02)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  📊
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {stats.updatedInLast24Hours?.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Updated in 24h
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem'
                  }}
                >
                  <div>
                    <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      {stats.stations?.updatedInLast24Hours?.toLocaleString()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Stations
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      {stats.trade?.updatedInLast24Hours?.toLocaleString()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                      Trade Data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points of Interest */}
            {stats.pointsOfInterest && (
              <div
                style={{
                  border: '2px solid #9C27B0',
                  borderRadius: '12px',
                  padding: '2rem',
                  background: 'rgba(156,39,176,0.02)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>🌟</span>
                  <div>
                    <h3 style={{ color: 'white', margin: 0 }}>
                      Points of Interest
                    </h3>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      Special locations and notable sites
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {stats.pointsOfInterest.toLocaleString()}
                </div>
              </div>
            )}

            {/* Data Freshness */}
            {stats.timestamp && (
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>
                  Data Freshness
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      Statistics Last Updated:
                    </div>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>
                      {new Date(stats.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {stats.database && (
                    <div>
                      <div style={{ color: '#888', fontSize: '0.9rem' }}>
                        Database Status:
                      </div>
                      <div
                        style={{
                          color: stats.database.connected
                            ? '#4CAF50'
                            : '#ff4444',
                          fontWeight: 'bold'
                        }}
                      >
                        {stats.database.connected
                          ? 'Connected'
                          : 'Disconnected'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No statistics available
          </div>
        )}
      </div>
    </>
  )
}
