import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/privacy', name: 'privacy policy' },
  { path: '/cookie-policy', name: 'cookie policy' },
];

for (const route of routes) {
  test(`${route.name} meets WCAG 2.2 AA`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.locator('main')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test(`${route.name} exposes a valid page structure`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
}

test('skip link moves keyboard focus to the main content', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('mobile navigation exposes its expanded state to assistive technology', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Toggle navigation' });
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
});

test('theme switch updates and persists the Bootstrap color mode', async ({ page }) => {
  await page.goto('/');

  const themeSwitch = page.getByRole('switch', { name: 'Dark mode' });
  const themeIcons = page.locator('.theme-icon');
  await expect(themeIcons).toHaveCount(2);
  await expect(themeIcons.nth(0).locator('.bi-sun')).toBeVisible();
  await expect(themeIcons.nth(1).locator('.bi-moon')).toBeVisible();
  await expect(themeIcons.nth(0)).toHaveCSS('color', 'rgb(36, 50, 56)');
  await expect(themeSwitch).not.toBeChecked();
  await themeSwitch.check();
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await expect(themeIcons.nth(0)).toHaveCSS('color', 'rgb(222, 226, 230)');

  await page.reload();
  await expect(themeSwitch).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
});

test('contact form controls have programmatic labels and required states', async ({ page }) => {
  await page.goto('/contact');

  for (const name of ['Name', 'Email', 'Message']) {
    await expect(page.getByLabel(name)).toBeVisible();
    await expect(page.getByLabel(name)).toHaveAttribute('required', '');
  }
});