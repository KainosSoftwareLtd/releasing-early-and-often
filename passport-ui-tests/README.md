# Passport UI Tests

Selenium-based UI test pack for the Passport Application.

## Prerequisites

- Node.js 18 or higher
- Chrome browser installed
- Frontend application running (default: http://localhost:3000)
- Backend application running (default: http://localhost:8080)

## Project Structure

```
passport-ui-tests/
├── config/
│   └── config.js              # Test configuration
├── pages/                      # Page Object classes
│   ├── BasePage.js
│   ├── AddressPage.js
│   ├── DateOfBirthPage.js
│   └── PreviousPassportPage.js
├── support/
│   └── driver.js              # WebDriver setup helpers
├── tests/                      # Test files
│   ├── address.test.js
│   ├── date-of-birth.test.js
│   └── previous-passport.test.js
├── package.json
└── README.md
```

## Installation

```bash
cd passport-ui-tests
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headless mode (for CI/CD)
```bash
npm run test:headless
```

### Run tests against a different URL
```bash
BASE_URL=http://localhost:3000 npm test
```

### Run a specific test file
```bash
npm run test:specific -- tests/previous-passport.test.js
```

### Run with both options
```bash
HEADLESS=true BASE_URL=http://staging.example.com npm test
```

## Adding New Tests

1. **Create a Page Object** (if needed) in `pages/`
   - Extend `BasePage`
   - Define locators and interaction methods

2. **Create a Test File** in `tests/`
   - Import the driver helper and page objects
   - Use Mocha's `describe`/`it` structure
   - Use Chai for assertions

## Dependencies

- **selenium-webdriver** - Browser automation
- **chromedriver** - Chrome WebDriver
- **mocha** - Test framework
- **chai** - Assertion library
