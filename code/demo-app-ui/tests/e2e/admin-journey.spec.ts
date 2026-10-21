import { test, expect } from '@playwright/test';
import { loginAs, testUsers } from './fixtures/auth';
import { AdminPage } from './pages/admin.page';

 test.describe('Administrator workflows', () => {
  test('admin can view dashboard, manage claims, and search users', async ({ page }) => {
    await loginAs(page, testUsers.admin);
    const adminPage = new AdminPage(page);

    await adminPage.openDashboard();
    await expect(page.getByRole('button', { name: 'Refresh dashboard' })).toBeVisible();

    await adminPage.openClaims();
    await expect(page.getByLabel('Filter claims by status')).toBeVisible();
    await page.getByLabel('Filter claims by status').selectOption('SUBMITTED');
    await expect(page.getByRole('heading', { name: 'Claims Management' })).toBeVisible();

    await adminPage.openUsers();
    const search = page.getByRole('textbox', { name: 'Search users' });
    await search.fill(testUsers.admin.email);
    await expect(page.getByText(testUsers.admin.email)).toBeVisible();
  });

  test('claimant is redirected away from administrator dashboard', async ({ page }) => {
    await loginAs(page, testUsers.claimant);
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/claims$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
  });
});
