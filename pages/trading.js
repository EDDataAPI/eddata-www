import { useEffect, useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/layout'
import { NavigationContext } from 'lib/context'
import { API_BASE_URL } from 'lib/consts'

function Trading() {
  const [, setNavigationPath] = useContext(NavigationContext)
  const [commodityTicker, setCommodityTicker] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setNavigationPath([
      { name: 'Home', path: '/', icon: 'icarus-terminal-home' },
      { name: 'Trading', path: '/trading', icon: 'icarus-terminal-cargo' }
    ])
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v2/news/commodities`)
        if (res.ok) {
          const ticker = await res.json()
          setCommodityTicker(ticker)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      title='Trading Dashboard - EDData'
      description='Best trading opportunities in Elite Dangerous'
    >
      <Head>
        <link rel='canonical' href='https://eddata.dev/trading' />
      </Head>
      <div className='fx__fade-in scrollable' style={{ padding: '1rem' }}>
        <div className='heading--with-underline'>
          <h1 className='heading--with-icon'>
            <i className='icon icarus-terminal-cargo' />
            Trading Dashboard
          </h1>
        </div>

        {loading && (
          <div className='loading-bar' style={{ margin: '2rem 0' }} />
        )}

        {!loading && !commodityTicker && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className='text-muted'>
              <i
                className='icarus-terminal-alert'
                style={{ marginRight: '.5rem' }}
              />
              Trading data currently unavailable. Please check back later.
            </p>
          </div>
        )}

        {commodityTicker && (
          <>
            <div className='heading--with-underline'>
              <h2 className='text-uppercase'>🔥 Hot Trades (Top 20)</h2>
            </div>
            <p className='text-muted'>
              Best current trading opportunities sorted by absolute profit
            </p>
            <div className='rc-table data-table data-table--striped'>
              <div className='rc-table-container'>
                <div className='rc-table-content'>
                  <table>
                    <thead className='rc-table-thead'>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Commodity</th>
                        <th style={{ textAlign: 'right' }}>Profit</th>
                        <th style={{ textAlign: 'right' }}>Buy Price</th>
                        <th style={{ textAlign: 'right' }}>Sell Price</th>
                        <th style={{ textAlign: 'right' }}>Stock</th>
                        <th style={{ textAlign: 'right' }}>Demand</th>
                      </tr>
                    </thead>
                    <tbody className='rc-table-tbody'>
                      {commodityTicker.hotTrades &&
                        commodityTicker.hotTrades.map((trade, i) => (
                          <tr key={`hot-trade-${i}`}>
                            <td className='text-uppercase'>
                              {trade.commodity}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className='text-positive'>
                                +{trade.profit?.toLocaleString() ?? 0} CR
                              </span>
                              <br />
                              <small className='text-muted'>
                                {trade.profitPercent?.toFixed(1) ?? 0}%
                              </small>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {trade.buy?.price?.toLocaleString() ?? 0} CR
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {trade.sell?.price?.toLocaleString() ?? 0} CR
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {trade.buy?.stock?.toLocaleString() ?? 0}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {trade.sell?.demand?.toLocaleString() ?? 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className='heading--with-underline'
              style={{ marginTop: '2rem' }}
            >
              <h2 className='text-uppercase'>💎 High Value Commodities</h2>
            </div>
            <p className='text-muted'>
              Luxury goods with highest prices in the galaxy
            </p>
            <div className='rc-table data-table data-table--striped'>
              <div className='rc-table-container'>
                <div className='rc-table-content'>
                  <table>
                    <thead className='rc-table-thead'>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Commodity</th>
                        <th style={{ textAlign: 'right' }}>Max Price</th>
                        <th style={{ textAlign: 'right' }}>Markets</th>
                        <th style={{ textAlign: 'right' }}>Total Stock</th>
                        <th style={{ textAlign: 'right' }}>Total Demand</th>
                      </tr>
                    </thead>
                    <tbody className='rc-table-tbody'>
                      {commodityTicker.highValue &&
                        commodityTicker.highValue.map((commodity, i) => (
                          <tr key={`high-value-${i}`}>
                            <td className='text-uppercase'>
                              <Link
                                href={`/commodity/${commodity.commodity.toLowerCase()}`}
                              >
                                {commodity.commodity}
                              </Link>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className='text-warning'>
                                {commodity.maxPrice?.toLocaleString() ?? 0} CR
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.markets?.toLocaleString() ?? 0}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.totalStock?.toLocaleString() ?? 0}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.totalDemand?.toLocaleString() ?? 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className='heading--with-underline'
              style={{ marginTop: '2rem' }}
            >
              <h2 className='text-uppercase'>📊 Most Active Commodities</h2>
            </div>
            <p className='text-muted'>
              Most traded commodities in the last 24 hours
            </p>
            <div className='rc-table data-table data-table--striped'>
              <div className='rc-table-container'>
                <div className='rc-table-content'>
                  <table>
                    <thead className='rc-table-thead'>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Commodity</th>
                        <th style={{ textAlign: 'right' }}>Active Markets</th>
                        <th style={{ textAlign: 'right' }}>Avg Buy Price</th>
                        <th style={{ textAlign: 'right' }}>Avg Sell Price</th>
                        <th style={{ textAlign: 'right' }}>Total Stock</th>
                        <th style={{ textAlign: 'right' }}>Total Demand</th>
                      </tr>
                    </thead>
                    <tbody className='rc-table-tbody'>
                      {commodityTicker.mostActive &&
                        commodityTicker.mostActive.map((commodity, i) => (
                          <tr key={`most-active-${i}`}>
                            <td className='text-uppercase'>
                              <Link
                                href={`/commodity/${commodity.commodity.toLowerCase()}`}
                              >
                                {commodity.commodity}
                              </Link>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className='text-info'>
                                {commodity.activeMarkets?.toLocaleString() ?? 0}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.avgBuyPrice?.toLocaleString() ?? 0} CR
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.avgSellPrice?.toLocaleString() ?? 0} CR
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.totalStock?.toLocaleString() ?? 0}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {commodity.totalDemand?.toLocaleString() ?? 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {commodityTicker.timestamp && (
              <p
                className='text-center text-muted'
                style={{ marginTop: '2rem' }}
              >
                Last updated:{' '}
                {new Date(commodityTicker.timestamp).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Trading
