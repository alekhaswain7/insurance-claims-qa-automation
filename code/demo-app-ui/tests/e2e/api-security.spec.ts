import { test, expect } from '@playwright/test';

const bffBaseUrl = process.env.BFF_URL ?? 'http://localhost:8090';

test.describe('BFF API security', () => {
  test('rejects an unauthenticated request to the claims endpoint', async ({ request }) => {
    const response = await request.get(`${bffBaseUrl}/api/claims`);
    expect(response.status()).toBe(401);
  });
});
