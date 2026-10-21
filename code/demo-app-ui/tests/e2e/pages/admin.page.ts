import { expect, type Page } from '@playwright/test';

export class AdminPage {
  constructor(private readonly page: Page) {}

  async openDashboard(): Promise<void> {
    await this.page.goto('/admin/dashboard');
    await expect(this.page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  }

  async openClaims(): Promise<void> {
    await this.page.getByRole('button', { name: 'Claims', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Claims Management' })).toBeVisible();
  }

  async openUsers(): Promise<void> {
    await this.page.getByRole('button', { name: 'Users', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  }
}
