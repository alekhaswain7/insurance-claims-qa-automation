import { expect, type Page } from '@playwright/test';

export class ClaimsPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/claims(?:$|\?)/);
    await expect(this.page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
  }

  async startNewClaim(): Promise<void> {
    await this.page.getByRole('button', { name: 'Submit New Claim' }).click();
    await expect(this.page.getByRole('heading', { name: 'Incident Details' })).toBeVisible();
  }
}
