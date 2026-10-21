# QA Assessment — Risk-Based Test Strategy

## Scope and source alignment

The supplied assessment brief describes an Angular + Spring Boot + Kafka application and says the starting application has no tests. The supplied repository is not identical to that description: the actual UI is Next.js 16 / React 19, the backend is Spring Boot, and the repository already contains Vitest/Testing Library frontend tests and JUnit tests. Playwright E2E coverage was scaffolded but the configured `tests/e2e` directory and `tests/e2e/global-setup.ts` were absent in the archive. This strategy is based on the supplied source tree and README, not assumptions from the brief alone.

## Highest-risk areas

| Priority | Risk | Why it matters | Coverage approach |
|---|---|---|---|
| P0 | Authentication and role-based authorization | Claims and user data must not be visible or mutable by an unauthorised user. UI route guards are not a security boundary; the BFF must enforce authorization. | Playwright login, unauthenticated route/API checks, claimant-vs-admin navigation. |
| P0 | Claim submission and validation | Incorrect incident dates, amounts, descriptions, or ownership can create invalid or misattributed financial records. | E2E happy path plus required-field/validation coverage; expand with API boundary cases. |
| P0 | Claim status transitions | Admin changes affect the claim lifecycle and downstream users. Invalid transitions must be rejected. | Existing unit coverage for transition utility; E2E admin status workflow where stable; API negative tests next. |
| P1 | UI ↔ BFF ↔ Claims Service contract | Authentication, serialization, error mapping, and ownership can fail at service boundaries. | BFF API security smoke test; add contract/integration tests in a follow-up. |
| P1 | Kafka/WebSocket event delivery | Users may see stale or duplicated claim status updates if event publishing, CDC, or WebSocket delivery is misconfigured. | Code/config review now; add deterministic event integration tests after choosing one event mode. |
| P1 | Dashboard caching and statistics | Stale or incorrect operational totals can mislead claim administrators. | Admin dashboard smoke coverage; add API/data consistency checks next. |
| P2 | User search and responsive claims display | Useful workflow quality, but lower risk than authorization and claim integrity. | Admin user search and semantic UI checks; broader viewport matrix deferred. |

## Implemented Playwright coverage

- Unauthenticated navigation to `/claims` redirects to login.
- Invalid credentials display an actionable error.
- A seeded claimant can log in and reach My Claims.
- A claimant can submit a valid claim through the three-step wizard and find the claim in the list.
- Required incident details prevent advancing from the first wizard step.
- An admin can view the dashboard, filter claims, and search users.
- A claimant attempting to open the admin dashboard is redirected to My Claims.
- An unauthenticated request to the BFF claims endpoint is rejected.

The tests use page objects for login, claims, claim submission, and admin navigation. They use accessible labels and roles rather than styling classes, use a unique description for the created claim, and rely on Playwright's auto-waiting assertions instead of fixed sleeps.

## Deliberately not covered in this time-box

- Exhaustive unit/component tests: native Vitest/Testing Library and JUnit suites already exist and should remain the owners of isolated logic tests.
- Full Kafka/CDC/WebSocket integration: requires a deterministic event mode and careful handling of asynchronous events; this is a high-priority next step, not something to fake with timing-based assertions.
- Load, stress, and soak testing; cross-browser and full responsive viewport matrices; visual regression; exhaustive status-transition combinations; refresh-token expiry race conditions.
- Direct database assertions from E2E tests: the suite should validate user-visible behaviour and API contracts rather than couple itself to persistence internals.

## Initial code/configuration concerns

1. `docker-compose.apps.yml` sets `APP_EVENTS_CDC_ENABLED: "true"`, while the root README calls direct Kafka publishing the default and says to set this flag to `false` for the normal mode. This should be reconciled because running both event paths can cause duplicate notifications, and selecting CDC requires the connector to be started.
2. The original Playwright configuration referenced `tests/e2e/global-setup.ts`, but that file was not present in the archive. This framework removes the missing global setup dependency and uses UI login per test for clarity and isolation.
3. The assessment brief says Angular and “no tests whatsoever”; the provided repository is a Next.js/React app with existing Vitest tests. Confirm the supplied repository is the intended assessment artifact and explain this discrepancy in the walkthrough.
4. Tests have not been run against the live stack in this environment. Any runtime failures should be recorded as observations and triaged before submission; do not describe unexecuted tests as passing.

## Execution

Start the full stack from the repository root:

```bash
./start-infra.sh
./start-app.sh
```

Then, from `code/demo-app-ui`:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

Set `BASE_URL` to override the UI URL and `BFF_URL` to override the BFF URL. Seeded demo credentials can be overridden with `E2E_CLAIMANT_EMAIL`, `E2E_CLAIMANT_PASSWORD`, `E2E_ADMIN_EMAIL`, and `E2E_ADMIN_PASSWORD`.

## Exit criteria

- All selected tests pass against a freshly started stack, or failures are triaged and documented as real defects/environment issues.
- The HTML report and traces for failures are reviewed.
- Each test is understood and defensible by the author; tests that can pass regardless of application behaviour must be removed or corrected.
