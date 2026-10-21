import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export type TestUsers = {
  claimant: { email: string; password: string };
  admin: { email: string; password: string };
};

export const testUsers: TestUsers = {
  claimant: {
    email: process.env.E2E_CLAIMANT_EMAIL ?? 'claimant@demo.com',
    password: process.env.E2E_CLAIMANT_PASSWORD ?? 'Claimant123!',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@demo.com',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'Admin123!',
  },
};

export async function loginAs(page: Page, user: TestUsers['claimant'] | TestUsers['admin']) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 15_000 });
}

export { base as test, expect };
