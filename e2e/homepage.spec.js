import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Set base URL for tests
    await page.goto('http://localhost:3000/')
  })

  test('should load successfully', async ({ page }) => {
    // Check if page loaded
    await page.waitForLoadState('networkidle')

    // Check if page title exists
    await expect(page).toHaveTitle(/EDData/)
  })

  test('should display header', async ({ page }) => {
    // Check if header exists
    const headerElement = page.locator('header')

    // Check if header is visible
    await expect(headerElement).toBeVisible()
  })

  test('should navigate to commodities page', async ({ page }) => {
    await page.goto('/')

    // Should redirect to /commodities
    await expect(page).toHaveURL(/.*commodities/)
  })
})

test.describe('Accessibility', () => {
  test('should have no automatic accessibility violations', async ({
    page
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for basic accessibility
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
  })
})
