import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { testUsers, loginAs } from './fixtures/auth';

 test.describe('Authentication and access control', () => {
  test('redirects an unauthenticated visitor away from protected claims', async ({ page }) => {
    await page.goto('/claims');

    await expect(page).toHaveURL(/\/login\?/);
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
  });

  test('shows a clear error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('invalid-user@example.com', 'DefinitelyWrong123!');

    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/\/login/);
  });

  test('claimant can authenticate and reach My Claims', async ({ page }) => {
    await loginAs(page, testUsers.claimant);

    await expect(page).toHaveURL(/\/claims$/);
    await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit New Claim' })).toBeVisible();
  });
});
