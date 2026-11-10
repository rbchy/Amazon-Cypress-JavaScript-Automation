# Amazon Automation - Cypress + JavaScript BDD Framework

Complete test automation framework for Amazon e-commerce workflows using Cypress, JavaScript, and Cucumber BDD.

## 📋 Test Coverage

All **13 Amazon features** covered:
- TC-001: User Registration
- TC-002: User Login
- TC-003: User Logout
- TC-004: Search Products
- TC-005: Add to Cart
- TC-006: Remove from Cart
- TC-007: Checkout Process
- TC-008: Product Return
- TC-009: Prime Membership
- TC-010: Browsing History
- TC-011: Purchase History
- TC-012: Amazon Visa Card
- TC-013: Amazon Affiliate

## 🏗️ Project Structure

```
amazon-automation-cypress/
├── cypress/
│   ├── features/
│   │   ├── 01-registration.feature
│   │   ├── 02-login-logout.feature
│   │   ├── 03-search.feature
│   │   ├── 04-cart.feature
│   │   ├── 05-checkout.feature
│   │   ├── 06-returns.feature
│   │   ├── 07-membership.feature
│   │   ├── 08-history.feature
│   │   └── 09-affiliate.feature
│   ├── support/
│   │   └── step_definitions/
│   │       ├── common.js
│   │       ├── auth.js
│   │       ├── search.js
│   │       ├── cart.js
│   │       ├── checkout.js
│   │       └── account.js
│   ├── pages/
│   │   ├── basePage.js
│   │   ├── homePage.js
│   │   ├── loginPage.js
│   │   ├── searchPage.js
│   │   ├── cartPage.js
│   │   ├── checkoutPage.js
│   │   ├── accountPage.js
│   │   └── ordersPage.js
│   ├── fixtures/
│   │   ├── testData.json
│   │   └── selectors.json
│   └── support/
│       └── e2e.js
├── cypress.config.js
├── package.json
├── .env
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 14+ and npm
- Cypress 13+
- @badeball/cypress-cucumber-preprocessor

### Step 1: Install Dependencies

```bash
npm install
npm install --save-dev cypress @badeball/cypress-cucumber-preprocessor @babel/core @babel/preset-env
```

### Step 2: Configure Environment

```bash
# Create .env file
echo "AMAZON_URL=https://www.amazon.com
TEST_EMAIL=your-test@gmail.com
TEST_PASSWORD=Your@Password123" > .env
```

### Step 3: Update Selectors

Edit `cypress/fixtures/selectors.json` with actual Amazon element selectors:

```json
{
  "signin_button": "a[data-nav-role='signin']",
  "email_input": "input#ap_email",
  "password_input": "input#ap_password",
  "search_box": "input#twotabsearchtextbox",
  "add_to_cart": "button#add-to-cart-button"
}
```

## 📝 Running Tests

### Open Cypress Interactive UI
```bash
npm run open
```

### Run All Tests Headless
```bash
npm run test
```

### Run Specific Feature
```bash
npm run test -- cypress/features/01-registration.feature
```

### Run with HTML Report
```bash
npm run test:report
```

## 🎯 Test Scenarios

### Registration (TC-001)
- New user creates account
- Email verification
- Password validation
- Account creation success

### Login/Logout (TC-002, TC-003)
- Login with valid credentials
- Invalid password handling
- Session management
- Logout confirmation

### Search (TC-004)
- Search by keyword
- Apply filters
- Sort results
- Pagination

### Shopping Cart (TC-005, TC-006)
- Add single/multiple items
- Update quantities
- Remove items
- Cart total recalculation

### Checkout (TC-007)
- Address selection
- Shipping method selection
- Payment method selection
- Order confirmation

### Returns (TC-008)
- Initiate return
- Select return reason
- Generate return label
- Track return status

### Prime Membership (TC-009)
- View Prime benefits
- Subscribe to Prime
- Manage membership
- View Prime orders

### History (TC-010, TC-011)
- View browsing history
- View purchase history
- Filter by date range
- Download invoices

### Amazon Visa Card (TC-012)
- View card benefits
- Apply for card
- Manage card account

### Amazon Affiliate (TC-013)
- Enroll in Associates
- Generate affiliate links
- Track affiliate earnings

## 🔧 Configuration

### cypress.config.js Example

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.AMAZON_URL || 'https://www.amazon.com',
    specPattern: 'cypress/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    stepDefinitions: 'cypress/support/step_definitions/**/*.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    waitForNavigation: 5000,
    requestTimeout: 10000
  }
});
```

## 📊 Test Data

Test data stored in `cypress/fixtures/testData.json`:

```json
{
  "user": {
    "email": "test@gmail.com",
    "password": "Test@123456",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "products": {
    "laptop": "Dell Laptop 15-inch",
    "book": "Clean Code"
  }
}
```

## 🛠️ Page Object Model

Each page is encapsulated in a separate file:

```javascript
// pages/homePage.js
class HomePage {
  visit() {
    cy.visit('/');
  }
  
  clickSignIn() {
    cy.get(selectors.signin_button).click();
  }
  
  clickSearch() {
    cy.get(selectors.search_box).click();
  }
}

module.exports = HomePage;
```

## 📝 Writing Tests

### Feature File Example

```gherkin
Feature: User Registration
  As a new customer
  I want to create an account
  So that I can shop on Amazon

  Scenario: Successful registration with valid data
    Given I am on the Amazon home page
    When I click on Sign In
    And I click on Create Account
    And I enter email "test@gmail.com"
    And I enter password "Test@123456"
    And I click Create Account button
    Then I should see the account dashboard
    And I should be logged in as "test@gmail.com"
```

### Step Definition Example

```javascript
// support/step_definitions/auth.js
const HomePage = require('../../pages/homePage');
const LoginPage = require('../../pages/loginPage');

Given('I am on the Amazon home page', () => {
  const home = new HomePage();
  home.visit();
});

When('I click on Sign In', () => {
  const home = new HomePage();
  home.clickSignIn();
});

And('I enter email {string}', (email) => {
  const login = new LoginPage();
  login.enterEmail(email);
});
```

## ⚠️ Important Notes

### Amazon Bot Detection
- Amazon may block automated access with CAPTCHA/OTP challenges
- Use the following workarounds:
  1. **Test on sandbox environment** (practice.qabrains.com or similar)
  2. **Use API testing** for critical flows
  3. **Add delays** between actions (cy.wait(2000))
  4. **Use different user agents** to avoid detection

### Selectors
- Amazon frequently updates DOM structure
- Selectors may break after page updates
- Maintain selector library in `fixtures/selectors.json`
- Use data-attributes when available

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Amazon Automation Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test:headless
      - uses: actions/upload-artifact@v2
        with:
          name: cypress-report
          path: cypress/results/
```

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cucumber for Cypress](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Page Object Model](https://www.cypress.io/blog/2019/12/11/page-object-model/)
- [Amazon Selectors](https://www.selenium.dev/)

## 👤 Author

RB Chowdhury (@rbchy)
- GitHub: https://github.com/rbchy
- LinkedIn: https://linkedin.com/in/rbchy

## 📄 License

MIT License - feel free to use for learning and commercial projects
