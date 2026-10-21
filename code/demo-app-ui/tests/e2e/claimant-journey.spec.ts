import { test, expect } from '@playwright/test';
import { loginAs, testUsers } from './fixtures/auth';
import { ClaimsPage } from './pages/claims.page';
import { NewClaimPage } from './pages/new-claim.page';

function yesterdayAsLocalDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test.describe('Claimant claim submission', () => {
  test('submits a valid claim and verifies it appears in My Claims', async ({ page }) => {
    const uniqueMarker = `E2E claim ${Date.now()}`;
    const description = `${uniqueMarker}: water damage caused by a burst pipe in the kitchen.`;

    await loginAs(page, testUsers.claimant);
    const claimsPage = new ClaimsPage(page);
    await claimsPage.expectLoaded();
    await claimsPage.startNewClaim();

    const newClaimPage = new NewClaimPage(page);
    await newClaimPage.completeIncidentDetails({
      incidentDate: yesterdayAsLocalDate(),
      incidentLocation: '123 QA Test Street, Bengaluru',
      claimAmount: '1250.50',
      description,
    });

    await newClaimPage.completeSupportingDetails(description);
    await expect(page.getByText('123 QA Test Street, Bengaluru')).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
    await newClaimPage.submit();

    await expect(page.getByText(/Claim submitted successfully! Claim ID:/)).toBeVisible();
    await expect(page).toHaveURL(/\/claims$/);
    await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
    await expect(page.getByRole('table').getByText(uniqueMarker)).toBeVisible({ timeout: 15_000 });
  });

  test('validates required incident details before advancing', async ({ page }) => {
    await loginAs(page, testUsers.claimant);
    await page.getByRole('button', { name: 'Submit New Claim' }).click();

    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
    await expect(page.getByRole('heading', { name: 'Incident Details' })).toBeVisible();
  });
});
