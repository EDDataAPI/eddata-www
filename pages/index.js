import { useEffect, useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Layout from 'components/layout'
import { NavigationContext, DialogContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'
import Markdown from 'react-markdown'
// import commodityCategories from 'lib/commodities/commodity-categories.json'
import Package from 'package.json'

const Cmdr = dynamic(() => import('components/cmdr'), { ssr: false })

function Home() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [, setDialog] = useContext(DialogContext)
  const [galnetNews, setGalnetNews] = useState()
  const [stats, setStats] = useState()
  const [version, setVersion] = useState()
  const [commodityTicker, setCommodityTicker] = useState()

  useEffect(() => {
    setNavigationPath([
      { name: 'Home', path: '/', icon: 'icarus-terminal-home' }
    ])
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v2/news/galnet`)
        if (res.ok) {
          const news = await res.json()
          setGalnetNews(news)
        }
      } catch (e) {
        console.error(e)
      }
    })()
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v2/stats`)
        const stats = await res.json()
        setStats(stats)
      } catch (e) {
        console.error(e)
      }
    })()
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/`)
        const text = await res.text()
        // Parse version from "EDData API v1.0.0 Online"
        const match = text.match(/EDData API v([\d.]+)/)
        if (match) {
          setVersion({ version: match[1] })
        }
      } catch (e) {
        console.error(e)
      }
    })()
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v2/news/commodities`)
        if (res.ok) {
          const ticker = await res.json()
          setCommodityTicker(ticker)
        }
      } catch (e) {
        console.error(e)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      title='EDData - Elite Dangerous'
      description='EDData is companion software for the game Elite Dangerous'
    >
      <Head>
        <link rel='canonical' href='https://eddata.dev/' />
      </Head>
      <div className='home fx__fade-in scrollable'>
        <div className='home__news-feed'>
          <div className='heading--with-underline'>
            <h2 className='text-uppercase'>Galnet News</h2>
          </div>
          {galnetNews && galnetNews.length > 0 ? (
            galnetNews.slice(0, 1).map((newsItem, _i) => (
              <div key={newsItem.url}>
                <div className='home__news-article-body'>
                  <Image
                    src={newsItem.image}
                    width={800}
                    height={450}
                    alt='News article headline'
                    className='home__news-headline-image'
                    priority
                  />
                  <div className='home__news-article-text scrollable'>
                    <h3 className='home__news-article-headline'>
                      {newsItem.title}
                    </h3>
                    <p className='muted text-uppercase'>
                      <a
                        target='_blank'
                        href={`https://www.elitedangerous.com/news/galnet/${newsItem.slug}`}
                        rel='noreferrer'
                      >
                        {newsItem.date} — Galnet
                      </a>
                    </p>
                    <Markdown>{`${newsItem.text.replaceAll('\n', '\n\n')}`}</Markdown>
                    <div className='heading--with-underline'>
                      <h3>More from Galnet</h3>
                    </div>
                    <ul style={{ margin: '1rem 0' }}>
                      {galnetNews.slice(1, 5).map((nextNewsItem, _j) => (
                        <li
                          onClick={() =>
                            setDialog({
                              title: 'Galnet News',
                              contents: (
                                <>
                                  <Image
                                    src={nextNewsItem.image}
                                    width={800}
                                    height={450}
                                    alt='News article headline'
                                    className='home__news-headline-image'
                                    style={{ maxHeight: '10rem' }}
                                  />
                                  <p
                                    style={{ fontSize: '1.5rem' }}
                                    className='text-uppercase'
                                  >
                                    {nextNewsItem.title}
                                  </p>
                                  <p className='muted text-uppercase'>
                                    <a
                                      target='_blank'
                                      href={`https://www.elitedangerous.com/news/galnet/${nextNewsItem.slug}`}
                                      rel='noreferrer'
                                    >
                                      {nextNewsItem.date} — Galnet
                                    </a>
                                  </p>
                                  <Markdown>{`${nextNewsItem.text.replaceAll('\n', '\n\n')}`}</Markdown>
                                </>
                              ),
                              visible: true
                            })
                          }
                          key={nextNewsItem.url}
                          className='text-uppercase'
                          style={{ marginTop: '.5rem' }}
                        >
                          {nextNewsItem.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='home__news-article-body'>
              <div className='home__news-article-text scrollable'>
                <p
                  className='muted text-center'
                  style={{ padding: '2rem 1rem' }}
                >
                  <i
                    className='icarus-terminal-alert'
                    style={{ marginRight: '.5rem' }}
                  />
                  Galnet news currently unavailable. Please check back later.
                </p>
                <p className='text-center'>
                  <a
                    href='https://www.elitedangerous.com/news/galnet'
                    target='_blank'
                    rel='noreferrer'
                    className='button'
                  >
                    Visit Galnet Website
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        <Cmdr />

        <div className='home__ticker'>
          <div className='heading--with-underline'>
            <h2 className='text-uppercase'>🔥 Hot Trades</h2>
          </div>
          {commodityTicker && commodityTicker.hotTrades ? (
            <>
              <div className='ticker-widget scrollable'>
                {commodityTicker.hotTrades.slice(0, 5).map((trade, i) => (
                  <div key={`hot-trade-${i}`} className='trade-opportunity'>
                    <div className='commodity-name text-uppercase'>
                      {trade.commodity}
                    </div>
                    <div className='profit'>
                      +{trade.profit.toLocaleString()} CR (
                      {trade.profitPercent.toFixed(1)}%)
                    </div>
                    <div className='route'>
                      <small>
                        <span className='buy'>
                          Buy @ {trade.buy.price.toLocaleString()} CR
                        </span>
                        {' → '}
                        <span className='sell'>
                          Sell @ {trade.sell.price.toLocaleString()} CR
                        </span>
                      </small>
                    </div>
                    <div className='stock-info'>
                      <small className='text-muted'>
                        Stock: {trade.buy.stock.toLocaleString()} | Demand:{' '}
                        {trade.sell.demand.toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                className='button button--large'
                style={{
                  textAlign: 'center',
                  display: 'block',
                  margin: '.5rem'
                }}
                href='/trading'
              >
                <i
                  className='icon icarus-terminal-cargo'
                  style={{ marginRight: '.5rem' }}
                />
                View All Trading Opportunities
                <i
                  className='icon icarus-terminal-chevron-right'
                  style={{ marginLeft: '.5rem' }}
                />
              </Link>
            </>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <p className='text-muted'>
                <i
                  className='icarus-terminal-alert'
                  style={{ marginRight: '.5rem' }}
                />
                Trading data currently unavailable. Please check back later.
              </p>
            </div>
          )}
        </div>

        <div className='home__about'>
          <div
            className='heading--with-underline is-hidden-desktop'
            style={{ marginBottom: '1rem' }}
          >
            <h2 className='text-uppercase'>About</h2>
          </div>
          <p style={{ textAlign: 'center', margin: '0 0 1rem 0' }}>
            <small>
              <i
                className='icarus-terminal-info'
                style={{ position: 'relative', top: '-.1rem' }}
              />
              <Link href='/about'>
                EDData OS {Package.version} | API {version?.version ?? '?.?.?'}
              </Link>
            </small>
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.systems.toLocaleString() : '…'}
            </span>{' '}
            Star Systems
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.stations.stations.toLocaleString() : '…'}
            </span>{' '}
            Stations/Ports
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.stations.carriers.toLocaleString() : '…'}
            </span>{' '}
            Fleet Carriers
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.trade.orders.toLocaleString() : '…'}
            </span>{' '}
            Buy/Sell Orders
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.trade.markets.toLocaleString() : '…'}
            </span>{' '}
            Markets
          </p>
          <p className='counter'>
            <span className='counter__number'>
              {stats ? stats.pointsOfInterest.toLocaleString() : '…'}
            </span>{' '}
            Points of Interest
          </p>
          <p className='text-uppercase muted' style={{ textAlign: 'center' }}>
            {stats ? stats.updatedInLast24Hours.toLocaleString() : '…'} updates
            <br />
            in the last 24 hours
          </p>
          <Link
            className='button button--large'
            style={{ textAlign: 'center', display: 'block', margin: '.5rem' }}
            href='/commodity/advancedcatalysers'
          >
            <i
              className='icon icarus-terminal-cargo'
              style={{ marginRight: '.5rem' }}
            />
            Commodities
            <i
              className='icon icarus-terminal-chevron-right'
              style={{ marginLeft: '.5rem' }}
            />
          </Link>

          {/* <div className='heading--with-underline' style={{ marginTop: '1rem' }}>
            <h2 className='heading--with-icon text-uppercase' style={{ fontSize: '1rem' }}>
              <i className='icon icarus-terminal-cargo' />
              Commodities
            </h2>
          </div>
          <ul className='home__commodity_categories'>
            {Object.entries(commodityCategories).map(([c, data]) => c).filter(category => category.toLowerCase() !== 'nonmarketable').map(category =>
              <li key={category}><Link href={`/commodities/${category.toLowerCase()}`}>{category}</Link></li>
            )}
          </ul> */}

          <div
            className='heading--with-underline'
            style={{ marginTop: '1.5rem' }}
          >
            <h3 className='text-uppercase'>EDData</h3>
          </div>
          <p>
            EDData is the leading provider of open trade data in the galaxy.
          </p>
          <p>
            Latest commodity prices and buy/sell orders are provided by data
            from the{' '}
            <Link target='_blank' href='https://eddn.edcd.io/' rel='noreferrer'>
              EDDN
            </Link>{' '}
            relay.
          </p>
          <div className='heading--with-underline'>
            <h3>EDData HQ</h3>
          </div>
          <p style={{ margin: 0, padding: '.5rem .25rem' }}>
            <Link
              href='/system/Puppis%20Sector%20GB-X%20b1-5'
              className='text-uppercase'
              style={{ border: 0 }}
            >
              <i className='icon icarus-terminal-outpost' />
              Icarus Terminal
              <br />
              <i className='icon icarus-terminal-star' />
              Puppis Sector GB-X b1-5
              <br />
            </Link>
          </p>
          <br />
          <div className='heading--with-underline'>
            <h3>EDData Carrier</h3>
          </div>
          <p style={{ margin: 0, padding: '.5rem .25rem' }}>
            <span className='text-uppercase'>
              <i className='icon icarus-terminal-fleet-carrier' />
              EDData Pioneer V9G-G7Z
            </span>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Home
