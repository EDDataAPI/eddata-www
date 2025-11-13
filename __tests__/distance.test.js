/**
 * Example Jest test
 * Tests for utility functions
 */

import { formatDistance } from '../lib/utils/distance'

describe('Distance Utils', () => {
  test('formatDistance should format numbers correctly', () => {
    expect(formatDistance(1234.56)).toBe('1,234.56')
  })

  test('formatDistance should handle null/undefined', () => {
    expect(formatDistance(null)).toBe('-')
    expect(formatDistance(undefined)).toBe('-')
  })

  test('formatDistance should handle zero', () => {
    expect(formatDistance(0)).toBe('0')
  })
})
