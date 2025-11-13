import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import { NavigationContext, DialogContext } from 'lib/context'
import 'css/index.css'
import 'public/fonts/icarus-terminal/icarus-terminal.css'
import { playLoadingSound } from 'lib/sounds'

// Lazy load Header component for better performance
const Header = dynamic(() => import('components/header'), {
  loading: () => <div>Loading...</div>
})

const handleOnClick = e => {
  try {
    if (
      e.target.nodeName === 'TD' &&
      e.target.className.includes('rc-table-cell-row-hover') &&
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.includes(
        'data-table--interactive'
      )
    ) {
      playLoadingSound()
    }
  } catch (error) {
    console.error('Click handler error:', error)
  }
}

const applyThemeSettings = () => {
  try {
    const themeSettings = JSON.parse(
      window.localStorage.getItem('theme-settings') || '{}'
    )
    if (themeSettings.hue) {
      document.documentElement.style.setProperty(
        '--color-primary-hue',
        themeSettings.hue
      )
    }
    if (themeSettings.saturation) {
      document.documentElement.style.setProperty(
        '--color-primary-saturation',
        `${themeSettings.saturation}%`
      )
    }
    if (themeSettings.contrast) {
      document.documentElement.style.setProperty(
        '--contrast',
        themeSettings.contrast
      )
    }
    if (themeSettings.highlightHueShift) {
      document.documentElement.style.setProperty(
        '--highlight-hue-shift',
        themeSettings.highlightHueShift
      )
    }
  } catch (error) {
    console.warn('Theme settings could not be applied:', error)
  }
}

export default function App({ Component, pageProps }) {
  const [navigationPath, setNavigationPath] = useState([])
  const [dialog, setDialog] = useState()

  const memoizedNavigationValue = React.useMemo(
    () => [navigationPath, setNavigationPath],
    [navigationPath]
  )

  const memoizedDialogValue = React.useMemo(() => [dialog, setDialog], [dialog])

  useEffect(() => {
    document.body.addEventListener('click', handleOnClick, { passive: true })
    applyThemeSettings()

    return () => {
      document.body.removeEventListener('click', handleOnClick)
    }
  }, [])

  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/icon-180x180.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/icon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/icon-16x16.png'
        />
        <link rel='manifest' href='/manifest.json' />
                <meta
          property='og:image'
          content='https://eddata.app/og-image.png'
          key='og-image'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='layout__frame'>
        <div className='fx__background' />
        <NavigationContext.Provider value={memoizedNavigationValue}>
          <DialogContext.Provider value={memoizedDialogValue}>
            <div
              id='notifications'
              style={{
                transition: '1s all ease-in-out',
                position: 'fixed',
                zIndex: 9999
              }}
            >
              <Toaster
                containerStyle={{
                  bottom: '4.5rem',
                  right: '1rem'
                }}
                gutter={10}
                position='bottom-right'
                toastOptions={{
                  duration: 4000,
                  className: 'notification text-uppercase',
                  style: {
                    borderRadius: '0',
                    border: '.2rem solid var(--color-primary-5)',
                    background: 'var(--color-background-transparent)',
                    color: 'var(--color-text-light)',
                    minWidth: '300px',
                    maxWidth: '600px',
                    textAlign: 'left !important',
                    margin: '0 1rem',
                    boxShadow: '0 0 1rem black',
                    padding: 0
                  }
                }}
              />
            </div>
            <Header />
            <Component {...pageProps} />
          </DialogContext.Provider>
        </NavigationContext.Provider>
      </div>
      <div className='fx__scanlines' />
      <div className='fx__overlay' />
    </>
  )
}
