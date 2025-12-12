import { test } from '@dword-design/playwright-fixture-web-extension';
import { expect } from '@playwright/test';
import { execaCommand } from 'execa';

test.beforeAll(() =>
  execaCommand('base build', { env: { NODE_ENV: '' }, stdio: 'inherit' }),
);

test('no release', async ({ page }) => {
  await page.goto('https://github.com/github-latest-release/repo2');
  await expect(page.locator('#repository-container-header')).toHaveScreenshot();
});

test('works', async ({ page }) => {
  await page.goto('https://github.com/github-latest-release/repo1');
  await expect(page.locator('#repository-container-header')).toHaveScreenshot();
});
