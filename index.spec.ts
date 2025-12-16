import { test } from '@dword-design/playwright-fixture-web-extension';
import { expect } from '@playwright/test';
import { execaCommand } from 'execa';

test.beforeAll(() => execaCommand('base build', { stdio: 'inherit' }));

test('no release', async ({ page }) => {
  await page.goto('https://github.com/github-latest-release/repo2');
  await expect(page.locator('.github-latest-release')).toBeAttached();
  await expect(page.locator('#repository-container-header')).toHaveScreenshot();
});

test('works', async ({ page }) => {
  await page.goto('https://github.com/github-latest-release/repo1');
  await expect(page.locator('.github-latest-release.Label')).toBeVisible();
  await expect(page.locator('#repository-container-header')).toHaveScreenshot();
});
