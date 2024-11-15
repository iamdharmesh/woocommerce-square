## E2E Tests

This directory contains end-to-end tests for the project, utilizing [Playwright](https://playwright.dev) to run tests in Chromium browser.

### Prerequisites
- **Node.js** (v20)
- **Docker**
- A [Square account](https://app.squareup.com/signup)

### Running Tests
#### Test Setup
To prepare the test environment, follow these steps:
1. Run `npm install` to install the required dependencies.
2. Run `npx playwright install` to install Playwright browsers.
3. Run `npm run env:install-plugins` to install necessary plugins (eg: `subscriptions`).
4. Start the environment by running `npm run env:start`. *(Ensure Docker is running before executing this command.)*
5. Add your Square account credentials to the `/tests/e2e/config/.env` file.

#### Test Execution
To execute the tests, use the following commands:

1. Run all tests:  
`npm run test:e2e`

2. Run tests in UI mode:
`npm run test:e2e -- --ui`

3. Run tests for a specific group:
`npm run test:e2e -- --grep @giftcard`
