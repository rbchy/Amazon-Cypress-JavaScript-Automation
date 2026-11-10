# 🚀 Quick Reference Guide - Amazon Automation Cypress Tests

## 📋 Quick Command Reference

### Installation & Setup
```bash
# Install all dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your test credentials

# Verify installation
npm list cypress
```

---

## 🧪 Running Tests

### Interactive Mode (Best for Development)
```bash
# Open Cypress GUI - see tests run in real browser
npm run open

# Then select a feature file or test to run
# You'll see the browser open with full debugging capabilities
```

### Headless Mode (Best for CI/CD)
```bash
# Run all tests in headless mode
npm run test

# Run all tests with Chrome browser
npm run test:chrome

# Run all tests with Firefox
npm run test:firefox

# Run with headless flag explicitly
npm run test:headless
```

### Run Specific Feature
```bash
# Authentication tests only
npm run test -- cypress/features/01-authentication.feature

# Shopping tests only
npm run test -- cypress/features/02-shopping.feature

# Account management tests only
npm run test -- cypress/features/03-account-management.feature
```

### Run Single Test Case
```bash
# Run first feature file
npm run test:single

# Or run specific test with grep
npx cypress run --spec "cypress/features/*.feature" --grep "TC-001"
```

---

## 📊 Generating Reports

### HTML Report
```bash
# Run tests and generate HTML report
npm run test:report

# Report will be at: cypress/results/report.html
```

### View Results
```bash
# Open report in browser
open cypress/results/report.html
```

---

## 🐛 Debugging & Development

### Debug Mode
```bash
# Run with full debug logging
npm run test:debug

# Tests run with --headed flag (can see browser)
# --no-exit keeps browser open after tests
```

### Enable Verbose Logging
```bash
# Set debug environment variable
DEBUG=cypress:* npm run test
```

### Slow Motion Testing
```bash
# Run tests in slow motion (helpful for observation)
npx cypress run --slow-motion 500
```

---

## 📋 Test Execution Scenarios

### Scenario 1: Quick Smoke Test
```bash
# Run only authentication tests (fastest)
npm run test -- cypress/features/01-authentication.feature --headed
```

### Scenario 2: Full Test Suite
```bash
# Run all 13 test cases
npm run test
```

### Scenario 3: Shopping Workflow Only
```bash
# Test add to cart, checkout, etc.
npm run test -- cypress/features/02-shopping.feature
```

### Scenario 4: Post-Purchase Features
```bash
# Test returns, history, affiliate, etc.
npm run test -- cypress/features/03-account-management.feature
```

---

## 🔄 Common Workflows

### Update Test Data
```bash
# Edit test data
nano cypress/fixtures/testData.json

# Or use your preferred editor
code cypress/fixtures/testData.json
```

### Update Selectors
```bash
# Edit CSS selectors if Amazon DOM changes
nano cypress/fixtures/selectors.json

# Then re-run tests
npm run test
```

### Add New Feature
```bash
# Create new feature file
touch cypress/features/04-new-feature.feature

# Add Gherkin scenarios
# Create corresponding step definitions in cypress/support/step_definitions/

# Run new feature
npm run test -- cypress/features/04-new-feature.feature
```

### Code Quality
```bash
# Lint JavaScript files
npm run lint

# Format code with Prettier
npm run format
```

---

## 🎯 Test Case Reference

### Quick TC Reference
```
TC-001: Registration      → Feature: 01-authentication.feature
TC-002: Login             → Feature: 01-authentication.feature
TC-003: Logout            → Feature: 01-authentication.feature
TC-004: Search            → Feature: 02-shopping.feature
TC-005: Add to Cart       → Feature: 02-shopping.feature
TC-006: Remove from Cart  → Feature: 02-shopping.feature
TC-007: Checkout          → Feature: 02-shopping.feature
TC-008: Returns           → Feature: 03-account-management.feature
TC-009: Prime             → Feature: 03-account-management.feature
TC-010: Browsing History  → Feature: 03-account-management.feature
TC-011: Purchase History  → Feature: 03-account-management.feature
TC-012: Visa Card         → Feature: 03-account-management.feature
TC-013: Affiliate         → Feature: 03-account-management.feature
```

---

## 🛠️ Troubleshooting

### Issue: Tests Not Running
```bash
# Check if Node/npm installed
node --version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Selectors Not Found
```bash
# Update selectors in testData.json
# Open browser and inspect Amazon elements
# Copy new selectors and update fixtures/selectors.json

# Test single scenario with updated selectors
npm run test -- cypress/features/01-authentication.feature
```

### Issue: Authentication Failing
```bash
# Check .env file has correct credentials
cat .env

# Verify credentials work on actual Amazon
# Update TEST_EMAIL and TEST_PASSWORD in .env

# Run auth test in debug mode
npm run test:debug -- cypress/features/01-authentication.feature
```

### Issue: Timeout Errors
```bash
# Increase timeout in cypress.config.js
# Change: defaultCommandTimeout: 8000 to 12000

# Or add wait in specific test:
cy.wait(3000)
```

### Issue: Tests Pass Locally but Fail in CI
```bash
# Add explicit waits
cy.wait(1000)
cy.intercept('/api/**').as('api')

# Use --headed flag to debug
npm run test -- --headed
```

---

## 📊 Viewing Test Results

### After Running Tests
```
✅ Tests Complete!

Test Summary:
- Total Tests: 40+
- Passed: ✓
- Failed: ✗
- Duration: ~5-10 minutes

Reports Location:
📄 HTML Report: cypress/results/report.html
📹 Videos: cypress/videos/
📸 Screenshots: cypress/screenshots/
```

### Opening Reports
```bash
# Open HTML report
open cypress/results/report.html

# View videos of test execution
open cypress/videos/

# View failure screenshots
open cypress/screenshots/
```

---

## 🔐 Security Notes

⚠️ **Never commit .env file to Git**
```bash
# Add to .gitignore
echo ".env" >> .gitignore

# Use only .env.example in repository
```

⚠️ **Use Test Credentials**
```
✅ DO:  Use test email: test@example.com
✅ DO:  Use dummy credit cards (4532...)
❌ DON'T: Use real personal Amazon account
❌ DON'T: Use real credit card information
```

---

## 📈 Performance Tips

### Speed Up Test Execution
```bash
# Run in headless mode (faster)
npm run test:headless

# Reduce timeouts (if tests are stable)
# In cypress.config.js: defaultCommandTimeout: 5000

# Run in parallel (advanced)
npx cypress run --parallel
```

### Reduce Test Duration
```bash
# Run only specific features
npm run test -- cypress/features/01-authentication.feature

# Skip slow tests
# Comment out scenarios in feature files
```

---

## 🎬 Video Recording

### Enable/Disable Videos
```javascript
// In cypress.config.js
{
  video: true,        // Enable (default)
  video: false,       // Disable
  videoCompression: 32, // Reduce file size
}
```

### Manage Video Files
```bash
# Videos saved in cypress/videos/
# Clean up old videos
rm -rf cypress/videos/*
```

---

## 📚 Useful Resources

- 📖 Full README: `README.md`
- 📋 Test Summary: `PROJECT_SUMMARY.md`
- 📊 Test Cases: `Amazon_TestCases.xlsx`
- 🎯 Flowchart: View in `02-shopping.feature`

---

## 💡 Pro Tips

### Tip 1: Use Custom Commands
```javascript
// Available custom commands in e2e.js
cy.login(email, password)
cy.logout()
cy.searchProduct("laptop")
cy.addToCart(quantity)
cy.goToCart()
cy.proceedToCheckout()
```

### Tip 2: Debug Single Step
```javascript
// Add this to pause execution at any point
cy.pause()

// Then step through with debugger
cy.debug()
```

### Tip 3: Inspect DOM
```javascript
// In interactive mode, open Chrome DevTools
// Inspect elements while tests run
// Update selectors in real-time
```

### Tip 4: Retry Flaky Tests
```javascript
// In cypress.config.js
retries: {
  runMode: 1,    // 1 retry in headless
  openMode: 0    // No retry in interactive
}
```

### Tip 5: Take Screenshots
```javascript
cy.screenshot('login-success')
cy.screenshot('checkout-page', { overwrite: true })
```

---

## 🚀 Next Steps

1. **Read the README.md** for detailed setup
2. **Run `npm install`** to install dependencies
3. **Create .env file** with your test credentials
4. **Run `npm run open`** to launch interactive mode
5. **Select a feature file** and watch tests run
6. **Update selectors** if any fail
7. **Commit to CI/CD** pipeline

---

## 📞 Getting Help

```bash
# View Cypress help
npx cypress help

# View command options
npx cypress run --help

# Check Node version
node --version

# Check npm version
npm --version

# View npm scripts
npm run
```

---

**Happy Testing! 🎉**

Questions? Check README.md or visit:
- 🌐 https://docs.cypress.io
- 💬 https://github.com/badeball/cypress-cucumber-preprocessor

