import { expect, type Page } from '@playwright/test';

export interface ClaimDraft {
  incidentDate: string;
  incidentLocation: string;
  claimAmount: string;
  description: string;
}

export class NewClaimPage {
  constructor(private readonly page: Page) {}

  async completeIncidentDetails(draft: ClaimDraft): Promise<void> {
    await this.page.getByLabel(/When did the incident occur/).fill(draft.incidentDate);
    await this.page.getByLabel(/Where did the incident occur/).fill(draft.incidentLocation);
    await this.page.getByLabel('Claim Amount').fill(draft.claimAmount);
    await this.page.getByRole('button', { name: 'Next' }).click();
    await expect(this.page.getByRole('heading', { name: 'Supporting Details' })).toBeVisible();
  }

  async completeSupportingDetails(description: string): Promise<void> {
    await this.page.getByLabel(/Describe what happened/).fill(description);
    await this.page.getByRole('button', { name: 'Next' }).click();
    await expect(this.page.getByRole('heading', { name: 'Review Your Claim' })).toBeVisible();
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Submit Claim' }).click();
  }
}
