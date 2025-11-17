import { useEffect, useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/layout'
import { NavigationContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'
import StationIcon from 'components/station-icon'
import { timeBetweenTimestamps } from 'lib/utils/dates'

function FleetCarriers() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [fleetCarriers, setFleetCarriers] = useState()
  const [loading, setLoading] = useState(true)
  const [accessFilter, setAccessFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setNavigationPath([
      { name: 'Home', path: '/', icon: 'icarus-terminal-home' },
      {
        name: 'Fleet Carriers',
        path: '/fleetcarriers',
        icon: 'icarus-terminal-fleet-carrier'
      }
    ])
    ;(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/v2/stations?type=FleetCarrier&limit=500`
        )
        if (res.ok) {
          const carriers = await res.json()
          setFleetCarriers(carriers)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCarriers = fleetCarriers?.filter(carrier => {
    // Filter by access
    if (accessFilter && carrier.carrierDockingAccess !== accessFilter) {
      return false
    }
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        carrier.stationName?.toLowerCase().includes(query) ||
        carrier.systemName?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <Layout
      title='Fleet Carriers - EDData'
      description='Browse all Fleet Carriers in Elite Dangerous'
    >
      <Head>
        <link rel='canonical' href='https://eddata.dev/fleetcarriers' />
      </Head>
      <div className='fx__fade-in scrollable' style={{ padding: '1rem' }}>
        <div className='heading--with-underline'>
          <h1 className='heading--with-icon'>
            <i className='icon icarus-terminal-fleet-carrier' />
            Fleet Carriers
          </h1>
        </div>

        <div
          className='form-options'
          style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor='search-input' className='text-uppercase'>
              <small>Search</small>
            </label>
            <input
              id='search-input'
              type='text'
              placeholder='Search by carrier or system name...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ minWidth: '200px' }}>
            <label htmlFor='access-filter' className='text-uppercase'>
              <small>Docking Access</small>
            </label>
            <select
              id='access-filter'
              value={accessFilter}
              onChange={e => setAccessFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value=''>All Fleet Carriers</option>
              <option value='all'>✓ Publicly Accessible</option>
              <option value='squadronFriends'>⚠ Squadron & Friends</option>
              <option value='none'>✕ Private</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className='loading-bar' style={{ margin: '2rem 0' }} />
        )}

        {!loading && !fleetCarriers && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className='text-muted'>
              <i
                className='icarus-terminal-alert'
                style={{ marginRight: '.5rem' }}
              />
              Fleet carrier data currently unavailable. Please check back later.
            </p>
          </div>
        )}

        {!loading && filteredCarriers && (
          <>
            <p className='text-muted' style={{ marginBottom: '1rem' }}>
              Showing {filteredCarriers.length.toLocaleString()} fleet carrier
              {filteredCarriers.length !== 1 ? 's' : ''}
              {accessFilter && (
                <>
                  {' '}
                  with {accessFilter === 'all' && 'public access'}
                  {accessFilter === 'squadronFriends' &&
                    'squadron & friends access'}
                  {accessFilter === 'none' && 'private access'}
                </>
              )}
            </p>

            <div className='rc-table data-table data-table--striped data-table--sticky-heading'>
              <div className='rc-table-container'>
                <div className='rc-table-content'>
                  <table>
                    <thead className='rc-table-thead'>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Carrier Name</th>
                        <th style={{ textAlign: 'left' }}>System</th>
                        <th style={{ textAlign: 'left' }}>Docking Access</th>
                        <th style={{ textAlign: 'right' }}>Updated</th>
                      </tr>
                    </thead>
                    <tbody className='rc-table-tbody'>
                      {filteredCarriers.map(carrier => (
                        <tr key={carrier.marketId}>
                          <td>
                            <StationIcon station={carrier}>
                              {carrier.stationName}
                            </StationIcon>
                          </td>
                          <td>
                            <Link
                              href={`/system/${carrier.systemName?.replaceAll(' ', '_')}`}
                            >
                              {carrier.systemName}
                            </Link>
                          </td>
                          <td>
                            {carrier.carrierDockingAccess ? (
                              <span
                                className={`access-badge access-${carrier.carrierDockingAccess}`}
                              >
                                {carrier.carrierDockingAccess === 'all' &&
                                  '✓ Public'}
                                {carrier.carrierDockingAccess ===
                                  'squadronFriends' && '⚠ Squadron & Friends'}
                                {carrier.carrierDockingAccess === 'none' &&
                                  '✕ Private'}
                              </span>
                            ) : (
                              <span className='text-muted'>Unknown</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {carrier.updatedAt ? (
                              <small>
                                {timeBetweenTimestamps(carrier.updatedAt)}
                              </small>
                            ) : (
                              <small className='text-muted'>—</small>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredCarriers.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className='text-center text-muted'
                            style={{ padding: '2rem' }}
                          >
                            No fleet carriers found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default FleetCarriers
