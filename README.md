
# Amazon Cypress—JavaScript-Automation BDD Cucumber Test Framework

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-14.x-04C38E?logo=cypress&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-brightgreen?logo=cucumber)
![Node](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)
![Chrome](https://img.shields.io/badge/Chrome-Supported-4285F4?logo=googlechrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-Supported-FF7139?logo=firefox&logoColor=white)
![Edge](https://img.shields.io/badge/Edge-Supported-0078D7?logo=microsoftedge&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

**Author:** Ranajit Baran Chowdhury — Software Developer & QA Automation Engineer  
**Email:** chyranajit@gmail.com  
**GitHub:** [@ranajitchowdhury](https://github.com/ranajitchowdhury)

A production-grade end-to-end test automation framework for **Amazon.com** using **Behavior-Driven Development (BDD)** principles. Built with Cypress 14 + Cucumber, covering authentication, shopping workflows, and full account management — with cross-browser support, Cypress Cloud integration, and multiple report formats.

🌐 **Live Application:** [amazon.com](https://www.amazon.com)

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | JavaScript (ES6+) | Core programming language |
| **Test Tool** | Cypress 14.x | Browser automation & assertions |
| **BDD Framework** | Cucumber (`@badeball/cypress-cucumber-preprocessor` v24) | Gherkin-based feature files |
| **Bundler** | esbuild (`@bahmutov/cypress-esbuild-preprocessor`) | Fast spec compilation |
| **Reporter 1** | `multiple-cucumber-html-reporter` | Rich Cucumber HTML dashboard |
| **Reporter 2** | Mochawesome + mochawesome-merge | Combined Mochawesome HTML report |
| **Cloud** | Cypress Cloud (`projectId: ptk1hs`) | Test recording & parallelism |
| **Env Config** | dotenv | Environment variable management |
| **Code Quality** | ESLint + Prettier | Linting and formatting |
| **Runtime** | Node.js v18+ | JavaScript runtime |

---

## 📁 Project Structure

```
AmazonCypressJavaScriptAutomation/
│
├── cypress/
│   ├── features/                      ← BDD Gherkin feature files
│   │   ├── 01-authentication.feature  ← TC-001 to TC-003: Login, Registration, Logout
│   │   ├── 02-shopping.feature        ← TC-004 to TC-007: Search, Cart, Checkout
│   │   └── 03-account-management.feature ← TC-008 to TC-013: Returns, Prime, Orders
│   │
│   ├── fixtures/                      ← External test data & selectors
│   │   ├── testData.json              ← User credentials and test inputs
│   │   ├── selectors.json             ← Centralised CSS/XPath selector registry
│   │   ├── testData-selectors.json    ← Combined data + selector reference
│   │   └── example.json              ← Cypress default fixture reference
│   │
│   ├── results/                       ← Generated reports (after test run)
│   │   ├── cucumber-html-report/      ← Rich Cucumber HTML dashboard (index.html)
│   │   ├── cucumber-json/             ← Cucumber JSON output
│   │   ├── cucumber-report.html       ← Built-in Cucumber HTML report
│   │   ├── report.html                ← Mochawesome HTML report
│   │   └── report.json                ← Mochawesome JSON output
│   │
│   ├── screenshots/                   ← Auto-captured on test failure
│   ├── videos/                        ← Test execution recordings (optional)
│   │
│   └── support/
│       ├── commands.js                ← Custom Cypress commands
│       ├── e2e.js                     ← Global support configuration
│       ├── amazon-mock.js             ← Amazon-specific mock helpers
│       └── step_definitions/          ← Cucumber step implementations
│           ├── auth.js                ← Authentication step definitions
│           ├── shopping.js            ← Shopping workflow step definitions
│           └── checkout-account.js   ← Checkout & account step definitions
│
├── scripts/
│   └── generate-report.js             ← Cucumber HTML report generator
│
├── cypress.config.js                  ← Cypress + Cucumber + Cloud configuration
├── .env                               ← Environment variables (not committed)
├── selectors.json                     ← Root-level selector reference
├── testData.json                      ← Root-level test data reference
└── package.json                       ← Dependencies & npm scripts
```

---

## 🎯 Test Coverage

### 🔐 Authentication — `01-authentication.feature`

| Test Case | Scenario |
|-----------|----------|
| TC-001 | New user registration with valid data |
| TC-001 | Registration with invalid email format — error validation |
| TC-001 | Registration with weak password — strength validation |
| TC-002 | Login with valid credentials — successful dashboard access |
| TC-002 | Login with incorrect password — error message assertion |
| TC-002 | Login with non-existent email — error message assertion |
| TC-003 | Logout from account — session termination and redirect |
| TC-003 | Session expires after logout — protected page redirect |
| TC-002 | Remember Me functionality — pre-filled email on next login |
| TC-002 | Two-Factor Authentication (2FA) setup and OTP verification |

### 🛒 Shopping Workflows — `02-shopping.feature`

| Test Case | Scenario |
|-----------|----------|
| TC-004 | Search product by keyword — results with price, rating, images |
| TC-004 | Search with filters — price range, brand, star rating |
| TC-004 | Sort search results — Low to High, Highest Rating, Newest |
| TC-005 | Add single product to cart — confirmation and cart count |
| TC-005 | Add multiple items to cart — quantity accumulation |
| TC-005 | Add out-of-stock product — disabled button, Notify Me |
| TC-006 | Remove product from cart — cart update and count decrease |
| TC-006 | Update cart quantity — subtotal recalculation |
| TC-006 | Clear entire cart — empty cart message |
| TC-007 | Complete checkout process — address, shipping, payment, order confirm |
| TC-007 | Checkout with new shipping address |
| TC-007 | Apply coupon code — discount and updated order total |
| TC-007 | Checkout with different payment methods — Amazon Pay, Credit/Debit Card |

### 👤 Post-Purchase & Account Management — `03-account-management.feature`

| Test Case | Scenario |
|-----------|----------|
| TC-008 | Initiate product return — reason, method, return label |
| TC-008 | Track return status — tracking number and refund date |
| TC-008 | Return for wrong item — replacement flow |
| TC-009 | Subscribe to Amazon Prime — plan selection and activation |
| TC-009 | Prime membership features — shipping, Video, Music, Reading |
| TC-009 | Cancel Prime membership |
| TC-010 | View and clear browsing history |
| TC-010 | Filter browsing history by date range |
| TC-011 | View full purchase history with order details |
| TC-011 | Filter orders by date range |
| TC-011 | Download invoice PDF |
| TC-012 | View Amazon Visa card benefits and apply |
| TC-012 | Manage Amazon Visa card account |
| TC-013 | Enroll in Amazon Associates affiliate program |
| TC-013 | Generate affiliate links with QR code and HTML embed |

**Total: 35+ scenarios across 3 feature files**

---

## ✨ Framework Features

| Feature | Description |
|---------|-------------|
| ✅ BDD with Cucumber | Gherkin syntax for human-readable, stakeholder-friendly scenarios |
| ✅ Page Object Model | Selectors centralised in `fixtures/selectors.json` — no hard-coded locators in tests |
| ✅ Cross-Browser Testing | Runs on Chrome, Firefox, Edge, and Electron headless |
| ✅ Multi-Reporter | Both Mochawesome HTML and Cucumber HTML reports generated |
| ✅ Cypress Cloud | Test recording, parallelism, and flake detection via projectId |
| ✅ Auto Retry | Failed tests automatically retry once in `runMode` |
| ✅ Auto Screenshot on Failure | Cypress captures a screenshot on any test failure |
| ✅ Environment Variables | Credentials and URLs managed via `.env` and dotenv |
| ✅ Reusable Step Definitions | Shared steps across all feature files |
| ✅ ESLint + Prettier | Enforced code style and linting across all step files |
| ✅ esbuild Compilation | Near-instant spec bundling — no Webpack overhead |
| ✅ Amazon Mock Helpers | `amazon-mock.js` for stubbing Amazon-specific interactions |

---

## 📋 Prerequisites

Ensure the following are installed before running the tests:

- ✅ **Node.js v18+** — [nodejs.org](https://nodejs.org)
- ✅ **npm v8+** — bundled with Node.js
- ✅ **Git** — for cloning the repository
- ✅ **Chrome / Firefox / Edge** — for browser-specific runs
- ✅ **Amazon test account** — set credentials in `.env`

---

## ⚙️ Installation & Setup

**1. Clone the repository:**
```bash
git clone https://github.com/ranajitchowdhury/AmazonCypressJavaScriptAutomation.git
cd AmazonCypressJavaScriptAutomation
```

**2. Install all dependencies:**
```bash
npm install
# or run the one-step setup script:
npm run setup
```

**3. Configure environment variables:**

Create a `.env` file in the project root (or copy from the template):
```env
AMAZON_URL=https://www.amazon.com
TEST_EMAIL=your_test_email@example.com
TEST_PASSWORD=YourTestPassword@123
```

> ⚠️ Never commit real credentials. The `.env` file is excluded from version control.

---

## ▶️ Running the Tests

### Run all tests (Electron headless)
```bash
npm test
```

### Run all tests + generate Cucumber HTML report
```bash
npm run test:cucumber-report
```

### Run all tests + generate Mochawesome report
```bash
npm run test:report
```

### Run in headed mode (visible browser)
```bash
npm run test:debug
```

### Run on specific browsers
```bash
npm run test:chrome       # Chrome
npm run test:firefox      # Firefox
npm run test:edge         # Microsoft Edge
npm run test:headless     # Headless Electron
```

### Run individual feature files
```bash
npm run test:single       # Authentication only (01-authentication.feature)
npm run test:shopping     # Shopping workflows (02-shopping.feature)
npm run test:account      # Account management (03-account-management.feature)
npm run test:feature      # All .feature files
```

### Run for CI/CD pipeline
```bash
npm run test:ci           # Headless Chrome — optimised for CI
```

### Open Cypress interactive UI
```bash
npm run open
```

### Generate Cucumber HTML report from existing JSON
```bash
node scripts/generate-report.js
```

---

## 📊 Test Reports

### 1. Cucumber HTML Dashboard
```
cypress/results/cucumber-html-report/index.html
```
Open in any browser. Shows feature-level pass/fail, scenario details, step durations, browser metadata, and execution summary with charts.

### 2. Built-in Cucumber HTML
```
cypress/results/cucumber-report.html
```

### 3. Cucumber JSON (raw data)
```
cypress/results/cucumber-json/cucumber-report.json
```
Source data for HTML reports. Can be consumed by CI/CD tools (Jenkins, GitHub Actions, Azure DevOps).

### 4. Mochawesome HTML Report
```
cypress/results/report.html
```
Generated by `npm run test:report`. Provides a clean, styled test result page per spec.

### 5. Screenshot on Failure
```
cypress/screenshots/<FeatureName>/<Scenario> (failed).png
```
Automatically captured by Cypress whenever a test fails.

---

## 🏷️ Test Case Reference

Tests are organised by numbered test case IDs matching the test plan:

| Test Case ID | Module | Description |
|---|---|---|
| TC-001 | Authentication | User Registration |
| TC-002 | Authentication | Login & Session |
| TC-003 | Authentication | Logout |
| TC-004 | Shopping | Product Search & Filtering |
| TC-005 | Shopping | Cart Management |
| TC-006 | Shopping | Cart Update & Removal |
| TC-007 | Shopping | Checkout & Payment |
| TC-008 | Account | Returns Management |
| TC-009 | Account | Amazon Prime |
| TC-010 | Account | Browsing History |
| TC-011 | Account | Purchase History & Invoices |
| TC-012 | Account | Amazon Visa Card |
| TC-013 | Account | Amazon Associates Program |

---

## 🏗️ Framework Architecture

```
Feature Files (.feature — Gherkin)
            ↓
Step Definitions (support/step_definitions/*.js)
            ↓
Fixtures (selectors.json + testData.json)
            ↓
Cypress Commands (support/commands.js)
            ↓
Chrome / Firefox / Edge / Electron
            ↓
Amazon.com (www.amazon.com)
            ↓
Mochawesome + Cucumber HTML Reports
```

### Design Patterns Applied

- **Selector Registry** — all CSS selectors centralised in `fixtures/selectors.json`; step definitions never contain hard-coded locators
- **Test Data Separation** — test inputs managed in `fixtures/testData.json` and `.env`
- **BDD (Gherkin / Cucumber)** — Given / When / Then for non-technical stakeholder readability
- **Shared Background Steps** — `Given I am on Amazon home page` and login state reused across all features
- **Auto Retry** — `retries: { runMode: 1 }` catches transient network flakiness automatically
- **Environment Abstraction** — `AMAZON_URL` in `.env` allows switching between staging and production with no code change

---

## 🧩 npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `cypress run` | Run all specs headless (Electron) |
| `test:chrome` | `cypress run --browser chrome` | Run on Chrome |
| `test:firefox` | `cypress run --browser firefox` | Run on Firefox |
| `test:edge` | `cypress run --browser edge` | Run on Edge |
| `test:headless` | `cypress run --headless` | Headless Electron |
| `test:feature` | `cypress run --spec features/**/*.feature` | All feature files |
| `test:single` | `--spec 01-authentication.feature` | Auth suite only |
| `test:shopping` | `--spec 02-shopping.feature` | Shopping suite only |
| `test:account` | `--spec 03-account-management.feature` | Account suite only |
| `test:report` | `cypress run && mochawesome-merge` | Run + Mochawesome report |
| `test:cucumber-report` | `cypress run && node scripts/generate-report.js` | Run + Cucumber HTML |
| `test:debug` | `cypress run --headed --no-exit` | Visible browser, stays open |
| `test:ci` | `cypress run --headless --browser chrome` | CI/CD optimised |
| `open` | `cypress open` | Launch Cypress interactive UI |
| `lint` | `eslint step_definitions/*.js` | Lint all step files |
| `format` | `prettier --write "cypress/**/*.js"` | Auto-format all JS |
| `clean` | `rm -rf results screenshots videos node_modules` | Clean all generated files |
| `setup` | `npm install` | One-step project setup |

---

## 📈 Roadmap & Future Enhancements

- [ ] CI/CD Integration — GitHub Actions pipeline with automatic report publishing
- [ ] Parallel Execution — multi-spec parallelism via Cypress Cloud
- [ ] Data-Driven Testing — parameterised scenarios with Cucumber Examples tables
- [ ] Accessibility Testing — `cypress-axe` integration for WCAG compliance
- [ ] API Testing — `cy.request()` for Amazon backend contract validation
- [ ] Mobile Viewport Testing — responsive testing at common mobile resolutions
- [ ] Visual Regression — screenshot comparison via `cypress-image-snapshot`
- [ ] Docker Support — containerised test execution for consistent CI environments
- [ ] Performance Metrics — Lighthouse integration for page performance baselines
- [ ] Database Validation — order and account state verification via API

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/improvement`
3. Commit your changes: `git commit -m 'Add improvement'`
4. Push to the branch: `git push origin feature/improvement`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — provided for educational and professional QA automation purposes.

---

## 👤 Author

**Ranajit Baran Chowdhury**  
Software Programmer & QA Automation Engineer

- 📧 Email: chyranajit@gmail.com
- 🐙 GitHub: [@ranajitchowdhury](https://github.com/ranajitchowdhury)

---

**Version:** 1.0.0  
**Last Updated:** June 2026
