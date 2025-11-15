import { useEffect, useContext, useState } from 'react'
import Head from 'next/head'
import Layout from 'components/layout'
import { NavigationContext } from 'lib/context'
import { loadCache, saveCache } from 'lib/cache'
import { getCmdrInfo } from 'lib/cmdr'

function FleetCarrier() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [cmdrFleetCarrier, setCmdrFleetCarrier] = useState()

  const updateFleetCarrier = async () => {
    const _cmdrFleetCarrier = await getCmdrInfo('fleetcarrier')
    setCmdrFleetCarrier(_cmdrFleetCarrier)
    saveCache('cmdrFleetCarrier', _cmdrFleetCarrier)
  }
  useEffect(() => {
    setNavigationPath([{ name: 'Fleet Carrier', path: '/fleetcarrier' }])
    setCmdrFleetCarrier(loadCache('cmdrFleetCarrier'))
    updateFleetCarrier()
  }, [])

  return (
    <Layout
      title='EDData'
      description='EDData is companion software for the game Elite Dangerous'
      navigation={[
        {
          name: 'About Carrier',
          icon: 'icarus-terminal-fleet-carrier',
          url: '/fleetcarrier',
          active: true
        },
        {
          name: 'Cargo',
          icon: 'icarus-terminal-cargo',
          url: '/fleetcarrier/cargo'
        }
      ]}
    >
      <Head>
        <link rel='canonical' href='https://eddata.dev/fleetcarrier' />
      </Head>
      <div className='fx__fade-in' onClick={updateFleetCarrier}>
        <div className='heading--with-underline'>
          <h2 className='text-uppercase'>About fleet carrier</h2>
        </div>
        <pre>
          {cmdrFleetCarrier && JSON.stringify(cmdrFleetCarrier, null, 2)}
        </pre>
      </div>
    </Layout>
  )
}

export default FleetCarrier
