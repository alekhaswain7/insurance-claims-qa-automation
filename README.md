# Demo App – Insurance Claims Management

## 1. Project Overview

This project is an insurance claims management application used for QA and test automation practice. It has a frontend, backend services, authentication, a database, and event streaming.

The goal of this project is to validate the application at different levels, including unit testing, API testing, end-to-end testing, and security testing.

I have worked on improving the existing automated tests and extending the Playwright end-to-end test coverage.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Java, Spring Boot |
| Authentication | Keycloak, OAuth2/OIDC |
| Database | PostgreSQL |
| Cache | Redis |
| Event streaming | Apache Kafka |
| UI automation | Playwright with TypeScript |
| Frontend unit testing | Vitest |
| Backend unit testing | JUnit 5, Mockito |
| Build tool | Maven |
| Environment | Docker |

## 3. Application Architecture

The application follows a three-tier architecture.

- **Frontend:** Provides the user interface for claimants and administrators.
- **BFF (Backend for Frontend):** Handles frontend-facing API requests and communication with backend services.
- **Claims Service:** Handles the core claims management functionality.
- **Keycloak:** Manages authentication and authorization.
- **PostgreSQL:** Stores application data.
- **Redis:** Provides caching.
- **Kafka:** Supports event-driven communication.

For more details, refer to [ARCHITECTURE.md](ARCHITECTURE.md).

## 4. Prerequisites

Install the following tools before running the application.

- Docker Desktop
- Java JDK 21
- Maven 3.9 or later
- Node.js 20 or later
- npm
- Git

Verify the installations:

```bash
docker --version
java -version
mvn -version
node --version
npm --version
```

The startup scripts use shell commands. On Windows, run them through Git Bash or WSL2 if required by the project setup.

## 5. Getting Started

Clone the repository and navigate to the project directory.

```bash
git clone https://github.com/alekhaswain7/insurance-claims-qa-automation.git
cd demo-app-qa-main-playwright-framework
```

Start the infrastructure and application from the repository root:

```bash
./start-infra.sh
./start-app.sh
```

The first startup may take longer because Docker needs to download images and build services.

### Application URLs

| Service | URL |
|---|---|
| Demo application | http://localhost:3001 |
| BFF Swagger UI | http://localhost:8090/swagger-ui.html |
| Claims Service Swagger UI | http://localhost:8080/swagger-ui.html |
| Keycloak | http://localhost:8180 |
| Kafka UI | http://localhost:9093 |

### Demo Users

| Role | Username | Password |
|---|---|---|
| Admin | `admin@demo.com` | `Admin123!` |
| Claimant | `claimant@demo.com` | `Claimant123!` |

These are local demonstration credentials. Do not use them in production.

## 6. Testing Approach

I use different levels of testing to validate the application.

### Backend unit tests

JUnit 5 and Mockito are used to test business logic, service behavior, event publishing, and error scenarios.

Run the Claims Service tests:

```bash
cd code/claims-service
mvn test
```

Run the BFF Service tests:

```bash
cd code/bff-service
mvn test
```

### Frontend unit tests

Vitest is used for frontend unit testing.

```bash
cd code/demo-app-ui
npm ci
npm test
```

### End-to-end testing

Playwright with TypeScript is used to validate important user journeys through the application UI and API.

The tests are located in:

`code/demo-app-ui/tests/e2e/`

The current suite includes:

| Test file | Purpose |
|---|---|
| `auth.spec.ts` | Authentication and access control |
| `claimant-journey.spec.ts` | Claimant claim submission workflow |
| `admin-journey.spec.ts` | Administrator workflow |
| `api-security.spec.ts` | API security checks |

The tests also use reusable page objects and fixtures to keep common actions separate from test scenarios.

## 7. Playwright Framework Structure

The main Playwright files are organized as follows:

```text
code/demo-app-ui/
├── playwright.config.ts
└── tests/
    ├── e2e/
    │   ├── auth.spec.ts
    │   ├── claimant-journey.spec.ts
    │   ├── admin-journey.spec.ts
    │   ├── api-security.spec.ts
    │   ├── fixtures/
    │   │   └── auth.ts
    │   └── pages/
    │       ├── admin.page.ts
    │       ├── claims.page.ts
    │       ├── login.page.ts
    │       └── new-claim.page.ts
    └── fixtures/
        └── seedUser.ts
```

The framework uses the Page Object Model to keep page interactions reusable and easier to maintain. Shared fixtures help set up common test requirements.

## 8. Running Playwright Tests

Make sure the application and its required services are running before executing the end-to-end tests.

Navigate to the frontend directory:

```bash
cd code/demo-app-ui
```

Install dependencies and the Chromium browser:

```bash
npm ci
npx playwright install chromium
```

Run all Playwright E2E tests:

```bash
npm run test:e2e
```

Run tests with the browser visible:

```bash
npm run test:e2e:headed
```

Run tests in debug mode:

```bash
npm run test:e2e:debug
```

Open the Playwright report:

```bash
npm run test:e2e:report
```

Run a specific test file:

```bash
npx playwright test tests/e2e/claimant-journey.spec.ts
```

Run a specific test by title:

```bash
npx playwright test -g "test title"
```

The exact test title should match a test defined in the project.

## 9. Configuration

The Playwright suite supports the following environment variables:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Frontend URL; defaults to `http://localhost:3001` |
| `BFF_URL` | BFF URL; defaults to `http://localhost:8090` |
| `E2E_CLAIMANT_EMAIL` | Claimant test account |
| `E2E_CLAIMANT_PASSWORD` | Claimant test account password |
| `E2E_ADMIN_EMAIL` | Administrator test account |
| `E2E_ADMIN_PASSWORD` | Administrator test account password |

Use the default demo accounts for local testing or supply suitable environment variables. Avoid committing real credentials to the repository.

## 10. Test Results and Reports

Test results should be checked after each execution.

For backend tests, Maven displays the total number of tests, failures, errors, and skipped tests. Detailed results are available under:

```text
code/claims-service/target/surefire-reports/
code/bff-service/target/surefire-reports/
```

For Playwright, use the generated HTML report to review failed tests, error messages, screenshots, and traces when available.

The Claims Service test suite has passed locally with **197 tests, 0 failures, 0 errors, and 0 skipped tests**. This result applies to the Claims Service suite only; other suites must be executed separately before reporting their status.

## 11. Areas for Further Test Coverage

The following areas can be extended as part of the QA assessment:

- Integration testing using Testcontainers.
- Contract testing between the BFF and Claims Service using Pact.
- Additional positive and negative API scenarios.
- Validation of role-based access control.
- More end-to-end scenarios covering claim creation, updates, and administrator actions.
- Performance and load testing using tools such as k6 or Gatling.
- Manual test scenarios and defect documentation.

Pact and Testcontainers should be described as planned or scaffolded work until their tests are implemented and verified.

## 12. Troubleshooting

### Application is not accessible

Check whether the required Docker containers are running.

```bash
docker compose -f docker-compose.infra.yml ps
docker compose -f docker-compose.apps.yml ps
```

### Backend tests fail

Run the affected module's tests separately and check the Maven output and Surefire reports.

```bash
mvn test
```

### Playwright cannot open the application

- Confirm that the frontend and backend services are running.
- Verify the configured `BASE_URL` and `BFF_URL`.
- Check whether the test accounts are valid.
- Confirm that Chromium is installed.
- Review the Playwright error output and generated report.

### Playwright test fails

Run the affected test in headed or debug mode to inspect the page state and identify whether the issue is related to a locator, test data, authentication, or application behavior.

## 13. Stopping the Application

From the repository root:

```bash
./stop-app.sh
./stop-infra.sh
```

For a complete environment reset, check the project's stop script options before removing volumes, as doing so may delete local database data.


---

**Project focus:** Improve application quality through maintainable automated tests, meaningful test coverage, clear execution instructions, and reliable reporting of test results.
