import { useEffect, useContext } from 'react'
import Head from 'next/head'
import Layout from 'components/layout'
import About from 'components/about'
import { NavigationContext } from 'lib/context'

const AboutPage = () => {
  const [, setNavigationPath] = useContext(NavigationContext)
  useEffect(() => {
    setNavigationPath([
      { name: 'About EDData', path: '/about', icon: 'icarus-terminal-info' }
    ])
  }, [setNavigationPath])
  return (
    <Layout
      title='About EDData for Elite Dangerous'
      description='EDData is companion software for the game Elite Dangerous'
    >
      <Head>
        <link rel='canonical' href='https://eddata.app/about' />
      </Head>
      <div className='fx__fade-in'>
        <div className='clear'>
          <About />
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
