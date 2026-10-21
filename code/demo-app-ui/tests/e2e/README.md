# Playwright E2E suite

This suite targets the running demo stack. It intentionally does not boot only the Next.js UI, because the core user journeys require Keycloak, the BFF, Claims Service, and PostgreSQL to be available.

## Start the stack

From the repository root:

```bash
./start-infra.sh
./start-app.sh
```

Confirm the UI is available at `http://localhost:3001` and the BFF at `http://localhost:8090`.

## Install and run

```bash
cd code/demo-app-ui
npm ci
npx playwright install chromium
npm run test:e2e
```

Other commands:

```bash
npm run test:e2e:headed
npm run test:e2e:debug
npm run test:e2e:report
```

## Configuration

- `BASE_URL`: UI base URL; default `http://localhost:3001`.
- `BFF_URL`: BFF base URL for API security checks; default `http://localhost:8090`.
- `E2E_CLAIMANT_EMAIL` / `E2E_CLAIMANT_PASSWORD`: claimant credentials.
- `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`: administrator credentials.

Defaults match the seeded demo users documented in the root README. Prefer environment variables for alternate local credentials; do not commit real credentials.

## Reports and debugging

The suite emits a terminal list, an HTML report in `playwright-report/`, and JUnit XML at `playwright-report/results.xml`. Screenshots, videos, and traces are retained for failures in `test-results/`.

Tests are written against accessible labels, roles, and visible user outcomes. Avoid fixed sleeps; wait for meaningful UI state. A failure may indicate a product defect, a test assumption mismatch, or a stack/environment issue—inspect the trace and service logs before classifying it.
