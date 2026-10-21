# AI Working Journal

This is a working log for the assessment. The candidate must review each entry, add their own reasoning, and remove or correct anything they did not personally verify. Do not claim a test passed unless it was executed.

## Entry 1 — Repository and brief review

- **Prompt/task:** Compare the supplied take-home brief with the supplied demo repository and identify a high-value automation scope.
- **AI suggestion:** Use Playwright with TypeScript for browser journeys and BFF API checks; leave component/unit testing to the repository's existing Vitest/Testing Library and JUnit suites.
- **Decision:** Adopted as the initial approach because the actual UI is Next.js/React and already depends on `@playwright/test`.
- **Reasoning:** It avoids introducing a second browser automation language and can cover UI and API checks with one toolchain. It does not replace native unit/component tests.
- **Candidate verification:** Pending — review the repository and confirm this reflects your decision.

## Entry 2 — Existing Playwright setup

- **Observation:** The original `playwright.config.ts` referenced `tests/e2e/global-setup.ts`, which was absent from the ZIP. The E2E test directory was also absent despite the config pointing to it.
- **Change made:** Added `tests/e2e` tests and page objects, and removed the dangling global setup reference. The tests authenticate through the UI using the documented seeded demo users.
- **Reasoning:** UI login exercises the actual login flow and avoids silently relying on a nonexistent setup file or undocumented cookie injection.
- **Trade-off:** Repeated UI login is slower than storage-state reuse, but simpler and more transparent for a time-boxed assessment.
- **Candidate verification:** Pending — run the suite and document whether this trade-off remains appropriate.

## Entry 3 — Event mode discrepancy

- **Observation:** The README describes direct Kafka as the default, while `docker-compose.apps.yml` sets `APP_EVENTS_CDC_ENABLED` to `"true"`.
- **Decision:** Documented the inconsistency instead of silently changing application behaviour.
- **Reasoning:** Event-path changes could mask or create duplicate-event defects and should be made only after confirming the intended operating mode.
- **Candidate verification:** Pending — check with the application owner or verify the intended mode locally.

## Add an entry for every meaningful AI-assisted change

For each entry, record:

- Prompt or request given to AI.
- Suggestion received.
- What you accepted, challenged, or overrode.
- Why you made that decision.
- How you verified the resulting code and what the test result was.
