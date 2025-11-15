import { AUTH_BASE_URL } from 'lib/consts'

const CAPI_ENDPOINTS = [
  'profile',
  'market',
  'shipyard',
  'profile',
  'communitygoals',
  'journal',
  'fleetcarrier',
  'visitedstars'
]

async function getCmdrInfo(info) {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/cmdr/${info}`, {
      credentials: 'include'
    })
    if (res.ok) {
      return await res.json()
    }
    // Don't log expected "not signed in" errors
    if (res.status === 401 || res.status === 403 || res.status === 500) {
      return null
    }
  } catch (e) {
    // Only log unexpected errors
    if (
      e.message &&
      !e.message.includes('JWT') &&
      !e.message.includes('Not signed in')
    ) {
      console.error(e)
    }
  }
  return null
}

module.exports = {
  getCmdrInfo,
  CAPI_ENDPOINTS
}
