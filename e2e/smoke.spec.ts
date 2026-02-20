import { test, expect } from '@playwright/test';

/**
 * Smoke test: verifies the app loads and renders the main page.
 * Clinical justification: ensures the app is accessible after deployment.
 */
test('app loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Hand Talk/i);
});
