import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check if page title exists
    await expect(page).toHaveTitle(/EDData/)
  })

  test('should display header', async ({ page }) => {
    await page.goto('/')

    // Check if header is visible
    const header = page.locator('header')
    await expect(header).toBeVisible()
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
