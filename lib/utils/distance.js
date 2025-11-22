// Calculate distance between two points
const calculateDistance = (p1, p2, format = 'string') => {
  let distance = 0
  try {
    const x = p1[0] - p2[0]
    const y = p1[1] - p2[1]
    const z = p1[2] - p2[2]
    distance = Math.sqrt(x * x + y * y + z * z)
  } catch (e) {}
  if (format === 'string') {
    distance = distance.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }
  return distance
}

// Format distance number with commas
const formatDistance = value => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (value === 0) {
    return '0'
  }
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

module.exports = calculateDistance
module.exports.formatDistance = formatDistance
module.exports.calculateDistance = calculateDistance
