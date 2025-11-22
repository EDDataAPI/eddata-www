/**
 * Example Jest test
 * Tests for utility functions
 */

import { formatDistance } from '../lib/utils/distance'

describe('Distance Utils', () => {
  test('formatDistance should format numbers correctly', () => {
    const result = formatDistance(1234.56)
    // Handle both comma and space as thousands separator depending on locale
    expect(result).toMatch(/^1[\s,]234[.,]56$/)
  })

  test('formatDistance should handle null/undefined', () => {
    expect(formatDistance(null)).toBe('-')
    expect(formatDistance(undefined)).toBe('-')
  })

  test('formatDistance should handle zero', () => {
    expect(formatDistance(0)).toBe('0')
  })
})
