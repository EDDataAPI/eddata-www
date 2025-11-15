// Only load fs/path on server-side (not in browser)
const isServer = typeof window === 'undefined'

// Load environment variables from eddata.config if it exists (eddata-collector pattern)
if (isServer) {
  const path = require('path')
  const fs = require('fs')

  const EDDATA_CONFIG_LOCATIONS = [
    '/etc/eddata.config',
    path.join(__dirname, '../eddata.config'),
    path.join(__dirname, '../../eddata.config')
  ]

  for (const configPath of EDDATA_CONFIG_LOCATIONS.reverse()) {
    if (fs.existsSync(configPath)) {
      require('dotenv').config({ path: configPath })
      break
    }
  }
}

// Environment Configuration
const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_PRODUCTION = NODE_ENV === 'production'
const IS_DEVELOPMENT = NODE_ENV === 'development'

// Detect container environment (eddata-collector pattern)
// Only check filesystem on server-side
let IS_CONTAINER_ENV = IS_PRODUCTION
if (isServer) {
  const fs = require('fs')
  IS_CONTAINER_ENV =
    IS_PRODUCTION ||
    fs.existsSync('/.dockerenv') ||
    fs.existsSync('/run/.containerenv') ||
    !!process.env.KUBERNETES_SERVICE_HOST ||
    fs.existsSync('/home/container')
}

// Modern environment variable handling for Next.js 15
const EDDATA_DOMAIN = process.env.EDDATA_DOMAIN ?? 'eddata.app'
const API_BASE_URL =
  process.env.EDDATA_API_BASE_URL ?? `https://api.${EDDATA_DOMAIN}`
const AUTH_BASE_URL =
  process.env.EDDATA_AUTH_BASE_URL ?? `https://auth.${EDDATA_DOMAIN}`

const SOL_COORDINATES = [0, 0, 0]
const COLONIA_COORDINATES = [-9530.5, -910.28125, 19808.125]
const GALACTIC_CENTER_COORDINATES = [25.21875, -20.90625, 25899.96875]

// Directory Configuration (eddata-collector pattern)
// Only needed on server-side
let DEFAULT_DATA_DIR = ''
let DEFAULT_CACHE_DIR = ''

if (isServer) {
  const path = require('path')
  DEFAULT_DATA_DIR = IS_CONTAINER_ENV
    ? path.join(process.cwd(), 'eddata-data')
    : path.join(__dirname, '../eddata-data')

  DEFAULT_CACHE_DIR = IS_CONTAINER_ENV
    ? path.join(process.cwd(), 'eddata-data/cache')
    : path.join(__dirname, '../eddata-data/cache')
}

const EDDATA_DATA_DIR = process.env.EDDATA_DATA_DIR || DEFAULT_DATA_DIR
const EDDATA_CACHE_DIR = process.env.EDDATA_CACHE_DIR || DEFAULT_CACHE_DIR

// Cache Configuration (eddata-collector pattern)
const DEFAULT_CACHE_CONTROL = IS_PRODUCTION
  ? 'public, max-age=900, stale-while-revalidate=3600, stale-if-error=3600' // 15 min cache, 1h stale
  : 'no-cache, no-store, must-revalidate'

// These defaults should ideally match the API defaults for best performance.
// If these are changed in future, the defaults for the API should be changed
// to match, or more explicitly caching strategy implemented, for performance.
const COMMODITY_FILTER_MAX_DAYS_AGO_DEFAULT = '30'
const COMMODITY_FILTER_FLEET_CARRIER_DEFAULT = 'excluded'
const COMMODITY_FILTER_MIN_VOLUME_DEFAULT = '1'
const COMMODITY_FILTER_LOCATION_DEFAULT = ''
const COMMODITY_FILTER_DISTANCE_DEFAULT = 'Any distance'
const COMMODITY_FILTER_DISTANCE_WITH_LOCATION_DEFAULT = '100'
const NO_DEMAND_TEXT = '-'

const SIGN_IN_URL = `${AUTH_BASE_URL}/signin`
const SIGN_OUT_URL = `${AUTH_BASE_URL}/signout`

// Pagination & Limits (eddata-collector pattern)
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 1000
const DEFAULT_NEARBY_DISTANCE = 50 // Light years
const MAX_NEARBY_DISTANCE = 500 // Light years

// These are systems that actually exist in game but that are not "real" systems
// systems you can normally visit; in some cases it makes sense to hide them
const HIDDEN_SYSTEMS = [
  '7780433924818', // Test
  '9154823459538', // Test2
  '9704579273426', // TestRender
  '349203072180', // SingleLightTest
  '353498039476', // BinaryLightTest
  '8055311864530', // Training (Tutorial)
  '7780433924818' // Destination (Tutorial)
]

module.exports = {
  // Environment
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_CONTAINER_ENV,

  // API
  API_BASE_URL,
  AUTH_BASE_URL,
  SIGN_IN_URL,
  SIGN_OUT_URL,
  EDDATA_DOMAIN,

  // Coordinates
  SOL_COORDINATES,
  COLONIA_COORDINATES,
  GALACTIC_CENTER_COORDINATES,

  // Directories
  EDDATA_DATA_DIR,
  EDDATA_CACHE_DIR,

  // Cache
  DEFAULT_CACHE_CONTROL,

  // Pagination
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_NEARBY_DISTANCE,
  MAX_NEARBY_DISTANCE,

  // Commodity Filters
  COMMODITY_FILTER_MAX_DAYS_AGO_DEFAULT,
  COMMODITY_FILTER_FLEET_CARRIER_DEFAULT,
  COMMODITY_FILTER_MIN_VOLUME_DEFAULT,
  COMMODITY_FILTER_LOCATION_DEFAULT,
  COMMODITY_FILTER_DISTANCE_DEFAULT,
  COMMODITY_FILTER_DISTANCE_WITH_LOCATION_DEFAULT,
  NO_DEMAND_TEXT,
  HIDDEN_SYSTEMS
}
