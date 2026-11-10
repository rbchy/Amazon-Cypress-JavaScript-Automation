# 📦 Amazon Automation - Complete Project Deliverables

## ✅ What's Included

This comprehensive package contains **everything** needed to run Cypress automation tests for all 13 Amazon workflows.

---

## 📊 1. TEST CASES SPREADSHEET

**File:** `Amazon_TestCases.xlsx`

Complete test case documentation with all 13 scenarios:

| TC ID | Feature | Scenario | Details |
|-------|---------|----------|---------|
| TC-001 | User Registration | New customer account creation | Complete steps, test data, expected results |
| TC-002 | User Login | Existing user login | Multiple scenarios (valid, invalid, 2FA) |
| TC-003 | User Logout | User logout from account | Session management verification |
| TC-004 | Search Products | Search by keyword and filters | Search, filter, sort functionality |
| TC-005 | Add to Cart | Add single/multiple items | Quantity management, cart updates |
| TC-006 | Remove from Cart | Remove products from cart | Cart updates, total recalculation |
| TC-007 | Checkout | Complete purchase process | Address, shipping, payment, order confirmation |
| TC-008 | Product Return | Return initiated items | Return reason, tracking, refund status |
| TC-009 | Prime Membership | Subscribe to Prime | Benefits, cancellation, features |
| TC-010 | Browsing History | View browsing history | History filtering, product access |
| TC-011 | Purchase History | View past purchases | Order details, invoices, reorder |
| TC-012 | Amazon Visa Card | Apply for card | Card benefits, application, management |
| TC-013 | Amazon Affiliate | Enroll in Associates | Program enrollment, link generation |

**Format:** Professional XLSX with:
- Color-coded headers (navy blue background, white text)
- Column freezing for easy navigation
- Test data examples for each scenario
- Expected results documentation

---

## 📈 2. FLOWCHART - AMAZON USER JOURNEY

**Type:** Interactive SVG Diagram

Visual representation showing:
- ✅ User journey flow from home → registration/login → shopping → checkout → post-purchase
- ✅ All 13 features mapped in logical sequence
- ✅ Decision points (new user vs. existing user)
- ✅ Color-coded nodes for different feature categories
  - Teal: Search & browse features
  - Purple: Authentication (Login/Register)
  - Green: Shopping (Cart, Checkout)
  - Blue: Account features
  - Coral: Optional features
  - Red: Logout

**Interactive:** Click any node in the diagram for more information

---

## 🧪 3. CUCUMBER FEATURE FILES

**Location:** `*.feature` files

Three comprehensive feature files covering all 13 test cases:

### 📄 01-authentication.feature
```gherkin
Feature: User Authentication
  - TC-001: New user registration (with multiple scenarios)
  - TC-002: User login (valid/invalid/2FA)
  - TC-003: User logout
  - Background setup for pre-conditions
```

### 📄 02-shopping.feature
```gherkin
Feature: Shopping Workflows
  - TC-004: Search products (keyword, filters, sorting)
  - TC-005: Add to cart (single/multiple items)
  - TC-006: Remove from cart (single/all items)
  - TC-007: Checkout process (with multiple payment methods)
```

### 📄 03-account-management.feature
```gherkin
Feature: Post-Purchase & Account Management
  - TC-008: Product returns
  - TC-009: Prime membership
  - TC-010: Browsing history
  - TC-011: Purchase history
  - TC-012: Amazon Visa card
  - TC-013: Amazon Affiliate program
```

**Format:** BDD-style Gherkin syntax
- Given-When-Then structure
- Clear, business-readable language
- Detailed step definitions
- Test data parameters

---

## 💻 4. STEP DEFINITION FILES (JavaScript/Cypress)

Ready-to-use step implementations:

### 🔐 auth.js
```javascript
- Login/registration steps
- Password validation
- Logout verification
- 2FA handling
- Remember Me functionality
```

### 🛍️ shopping.js
```javascript
- Search functionality
- Filter/sort operations
- Add to cart actions
- Quantity management
- Cart deletion
```

### 🎯 checkout-account.js
```javascript
- Checkout process
- Address management
- Payment methods
- Return initiation
- Prime membership
- History viewing
- Affiliate link generation
```

**Format:** Full Cypress commands with:
- Cypress custom commands
- Wait/timeout handling
- Element interaction
- Assertions & verifications
- Error handling

---

## 📋 5. CONFIGURATION FILES

### cypress.config.js
```javascript
- Cypress configuration
- BDD/Cucumber preprocessor setup
- esbuild bundler configuration
- Reporter setup
- Custom tasks
- Retry configuration for CI/CD
```

### package.json
```json
- All dependencies (Cypress 13.6+)
- BDD preprocessor
- Script commands (test, open, report, etc.)
- Test execution profiles
- Development tools (ESLint, Prettier)
```

### e2e.js (Support File)
```javascript
- Global hooks (beforeEach, afterEach)
- Custom Cypress commands
- Helper functions
- Error handlers
- Logging utilities
```

---

## 📦 6. TEST DATA & SELECTORS

### testData-selectors.json
```json
{
  "testData": {
    "user": { email, password, name, phone },
    "newUser": { ... },
    "address": { street, city, state, zip },
    "payment": { cardNumber, expiry, cvv },
    "affiliate": { website, traffic, content },
    "products": { laptop, mouse, keyboard },
    "orders": { order1, order2 },
    "coupons": { valid, invalid, expired },
    "prime": { monthlyPrice, annualPrice }
  },
  "selectors": {
    "signin_button": "a[data-nav-role='signin']",
    "email_input": "input#ap_email",
    "search_box": "input#twotabsearchtextbox",
    "add_to_cart_button": "button#add-to-cart-button",
    ... 50+ selectors
  }
}
```

**Note:** Update selectors if Amazon DOM changes

---

## 📚 7. DOCUMENTATION

### README.md
Complete setup guide including:
- Installation steps
- Configuration instructions
- Running tests (headless, interactive, CI/CD)
- Test scenario descriptions
- Page Object Model pattern
- CI/CD integration examples
- Troubleshooting tips
- Resources & references

---

## 🚀 QUICK START

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
echo "AMAZON_URL=https://www.amazon.com
TEST_EMAIL=your-test@gmail.com
TEST_PASSWORD=Your@Password123" > .env
```

### 3. Update Selectors (if needed)
Edit `testData-selectors.json` with current Amazon selectors

### 4. Run Tests
```bash
# Interactive mode (see tests run in GUI)
npm run open

# Headless mode (CI/CD)
npm run test:headless

# Specific feature
npm run test -- cypress/features/01-authentication.feature

# With report
npm run test:report
```

---

## 📊 TEST COVERAGE MATRIX

| Feature | Feature Files | Scenarios | Steps | Custom Commands |
|---------|---------------|-----------| ------|-----------------|
| Authentication | 01-auth | 10 | 45+ | login, logout |
| Search/Shopping | 02-shop | 12 | 60+ | searchProduct, addToCart |
| Checkout | 02-shop | 5 | 35+ | proceedToCheckout |
| Returns | 03-account | 3 | 20+ | - |
| Membership | 03-account | 4 | 25+ | - |
| History | 03-account | 4 | 20+ | - |
| Affiliate | 03-account | 2 | 15+ | - |
| **TOTAL** | **3 files** | **40+ scenarios** | **220+ steps** | **6+ commands** |

---

## 🛠️ TECH STACK

✅ **Framework:** Cypress 13.6+  
✅ **Language:** JavaScript (Node.js 14+)  
✅ **BDD:** Cucumber with Gherkin  
✅ **Preprocessor:** @badeball/cypress-cucumber-preprocessor  
✅ **Bundler:** esbuild via @bahmutov  
✅ **Reporting:** HTML & Mochawesome  
✅ **Dev Tools:** ESLint, Prettier, Webpack  

---

## 📝 PROJECT STRUCTURE

```
amazon-automation-cypress/
├── cypress/
│   ├── features/
│   │   ├── 01-authentication.feature
│   │   ├── 02-shopping.feature
│   │   └── 03-account-management.feature
│   ├── support/
│   │   ├── e2e.js (global hooks & commands)
│   │   └── step_definitions/
│   │       ├── auth.js
│   │       ├── shopping.js
│   │       └── checkout-account.js
│   └── fixtures/
│       ├── testData.json
│       └── selectors.json
├── cypress.config.js
├── package.json
├── .env
├── .gitignore
├── README.md
└── Test_Cases_Matrix.xlsx
```

---

## ⚠️ IMPORTANT NOTES

### Amazon Bot Detection
Amazon may block automated access with CAPTCHA/OTP. Solutions:

1. **Use Sandbox Environment:**
   - practice.qabrains.com (recommended for learning)
   - Other testing sandboxes

2. **Add Delays:**
   ```javascript
   cy.wait(2000) // Between actions
   ```

3. **Use Different User Agents:**
   ```javascript
   cy.get("input").type("text", { force: true })
   ```

4. **Test-Only Features:**
   - Focus on non-login flows (search, browse)
   - Use API testing for backend validation

5. **Headless Considerations:**
   - Amazon may detect headless browsers
   - Use `--headed` flag during development

### Selector Maintenance
- Amazon updates DOM frequently
- Maintain selectors in `testData-selectors.json`
- Use data-attributes when available
- Avoid brittle XPath selectors

---

## 🔗 RESOURCES

- 📖 [Cypress Documentation](https://docs.cypress.io)
- 🧪 [Cucumber for Cypress](https://github.com/badeball/cypress-cucumber-preprocessor)
- 🎯 [Page Object Model](https://www.cypress.io/blog/2019/12/11/page-object-model/)
- 🌐 [Amazon Selectors Guide](https://www.selenium.dev/)
- 👤 [Author's GitHub](https://github.com/rbchy)
- 💼 [Author's LinkedIn](https://linkedin.com/in/rbchy)

---

## 📄 FILES SUMMARY

| File | Type | Purpose |
|------|------|---------|
| Amazon_TestCases.xlsx | XLSX | Test case documentation |
| 01-authentication.feature | Feature | Login/Register scenarios |
| 02-shopping.feature | Feature | Shopping scenarios |
| 03-account-management.feature | Feature | Post-purchase scenarios |
| auth.js | JS | Authentication steps |
| shopping.js | JS | Shopping steps |
| checkout-account.js | JS | Checkout & account steps |
| testData-selectors.json | JSON | Test data & CSS selectors |
| cypress.config.js | JS | Cypress configuration |
| package.json | JSON | Dependencies & scripts |
| e2e.js | JS | Hooks & custom commands |
| README.md | MD | Complete setup guide |

---

## ✨ NEXT STEPS

1. ✅ **Extract all files** to project directory
2. ✅ **Install dependencies:** `npm install`
3. ✅ **Update .env** with your test credentials
4. ✅ **Verify selectors** on target website
5. ✅ **Run tests:** `npm run open` or `npm run test:headless`
6. ✅ **Review reports** in `cypress/results/`
7. ✅ **Adjust timeouts** if needed for slow connections

---

## 🎓 LEARNING PATH

**For Beginners:**
1. Read README.md
2. Review 01-authentication.feature (simplest)
3. Run interactive mode: `npm run open`
4. Watch tests execute in browser

**For Intermediate:**
1. Modify test data in testData-selectors.json
2. Add new feature files
3. Create custom page objects
4. Add CI/CD pipeline

**For Advanced:**
1. Implement visual regression testing
2. Add API testing alongside UI
3. Create performance benchmarks
4. Integrate with reporting tools

---

## 📞 SUPPORT

For issues or questions:
- Review the README.md
- Check Cypress logs: `cypress/logs/`
- Enable debug mode: `DEBUG=cypress:* npm run test`
- Visit Cypress documentation: https://docs.cypress.io

---

**Created by:** RB Chowdhury (@rbchy)  
**Date:** 2024  
**License:** MIT - Free to use for learning and commercial projects  
**Version:** 1.0.0

Good luck with your testing! 🚀
