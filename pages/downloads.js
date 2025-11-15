import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { NavigationContext } from 'lib/context'
import Layout from 'components/layout'
import { API_BASE_URL } from 'lib/consts'
import byteSize from 'byte-size'

const databaseDescription = {
  'systems.db': 'Name and location of all star systems in the known galaxy',
  'trade.db': 'Buy and sell orders for commodities',
  'stations.db':
    'Name and location of stations, outposts, ports, settlements, megaships and fleet carriers',
  'locations.db': 'Unusual locations and points of interest'
}

function Downloads() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [databases, setDatabases] = useState()

  useEffect(() => {
    ;(async () => {
      setNavigationPath([
        {
          name: 'Downloads',
          path: '/downloads',
          icon: 'icarus-terminal-download'
        }
      ])
      try {
        const res = await fetch(`${API_BASE_URL}/v2/backup`)
        const databases = (await res.json()).databases
        databases.forEach(database => {
          database.description = databaseDescription?.[database.name]
        })
        setDatabases(databases.reverse())
      } catch (e) {
        console.error(e)
      }
    })()
  }, [setNavigationPath])

  return (
    <Layout
      title='Downloads for EDData software'
      description='Download bulk exports of data for the game Elite Dangerous from EDData'
    >
      <Head>
        <link rel='canonical' href='https://eddata.app/downloads' />
      </Head>
      <div className='fx__fade-in'>
        <p>You can download the source code and data for EDData.</p>
        <p>
          <Link href='/about'>About this software</Link>.
        </p>
        <div className='heading--with-underline'>
          <h2>Source Code</h2>
        </div>
        <p>
          The software consists of three components; this website, a REST API
          and a service that processes the data stream from EDDN.
        </p>
        <ul>
          <li>
            <a
              href='https://github.com/EDDataAPI/eddata-www'
              target='blank'
              className='link-no-underline'
            >
              EDData Website Source Code
            </a>
          </li>
          <li>
            <a
              href='https://github.com/EDDataAPI/eddata-api'
              rel='noreferrer'
              target='_blank'
            >
              EDData API Source Code
            </a>
          </li>
          <li>
            <a
              href='https://github.com/EDDataAPI/eddata-collector'
              rel='noreferrer'
              target='_blank'
            >
              EDData Collector Source Code
            </a>
          </li>
          <li>
            <a
              href='https://github.com/EDDataAPI/eddata-auth'
              target='blank'
              className='link-no-underline'
            >
              EDData Authentication Source Code
            </a>
          </li>
        </ul>
        <p />
        <div className='heading--with-underline'>
          <h2>Download Data</h2>
        </div>
        <p>
          You can download the databases as compressed SQLite Database files.
        </p>
        <p>
          These downloads are updated weekly during the in-game maintenance
          window from 07:00-09:00 UTC on Thursdays.
        </p>
        <p>
          You may wish to avoid downloading these files during the maintenance
          window to avoid interruption when the downloads are updated.
        </p>
        {databases &&
          databases.map(database => (
            <div key={database.name}>
              <div className='heading--with-underline'>
                <h3>{database.name}</h3>
              </div>
              <p>
                <em>{database.description}</em>
              </p>
              <ul>
                {Object.entries(database.tables).map(([k, v]) => (
                  <li
                    key={`${database.name}_${k}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {' '}
                    {k}: {v.toLocaleString()}
                  </li>
                ))}
                {database?.size && (
                  <li>
                    Disk space: {byteSize(database.size).value}{' '}
                    {byteSize(database.size).unit}
                  </li>
                )}
              </ul>
              <p style={{ margin: '1.5rem 0' }}>
                <Link
                  href={database?.download?.url ?? ''}
                  className='button'
                  style={{ padding: '.75rem 1.25rem' }}
                >
                  <i
                    className='icarus-terminal-download'
                    style={{
                      position: 'relative',
                      top: '-.125rem',
                      fontSize: '1.25rem'
                    }}
                  />{' '}
                  <strong>{database.name}.gz</strong>{' '}
                  {database?.download?.size && (
                    <span className='muted'>
                      ({byteSize(database.download.size).value}{' '}
                      {byteSize(database.download.size).unit})
                    </span>
                  )}
                </Link>
              </p>
            </div>
          ))}
      </div>
    </Layout>
  )
}

export default Downloads
