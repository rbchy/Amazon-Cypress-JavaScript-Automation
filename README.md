<div align="center">

# 🛒 Amazon Cypress BDD Automation — JavaScript · Cypress · Cucumber

### 39 Gherkin scenarios covering sign-in, search, cart, checkout and account management. They run against a stateful Amazon mock, so every assertion checks real values. Green on Chrome, Firefox and Edge in GitHub Actions.

[![Typing SVG](https://readme-typing-svg.demolab.com/?font=Fira+Code&size=18&pause=1500&color=FF9900&center=true&vCenter=true&width=900&repeat=true&lines=Cypress+14+%C2%B7+Cucumber+BDD+%C2%B7+JavaScript;Search+%C2%B7+Filters+%C2%B7+Cart+%C2%B7+Checkout+%C2%B7+Orders;39+%2F+39+scenarios+%C3%97+Chrome+%C2%B7+Firefox+%C2%B7+Edge)](https://git.io/typing-svg)

<!-- ============ STATUS BAR ============ -->
[![CI](https://github.com/rbchy/Amazon-Cypress-JavaScript-Automation/actions/workflows/ci.yml/badge.svg)](https://github.com/rbchy/Amazon-Cypress-JavaScript-Automation/actions/workflows/ci.yml)
![Scenarios](https://img.shields.io/badge/Scenarios-39%20%2F%2039%20passed-22c55e?style=for-the-badge&logo=checkmarx&logoColor=white)
![Browsers](https://img.shields.io/badge/Browsers-Chrome%20%C2%B7%20Firefox%20%C2%B7%20Edge-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Retries](https://img.shields.io/badge/CI%20retries-0-0ea5e9?style=for-the-badge)

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-14.5-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-badeball%2024-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)
![esbuild](https://img.shields.io/badge/esbuild-bundler-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-cypress%20plugin-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Node](https://img.shields.io/badge/Node-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![Last Commit](https://img.shields.io/github/last-commit/rbchy/Amazon-Cypress-JavaScript-Automation?style=flat-square&color=ff9900&label=Last%20commit)
![Repo Size](https://img.shields.io/github/repo-size/rbchy/Amazon-Cypress-JavaScript-Automation?style=flat-square&color=155e75&label=Repo%20size)

</div>

---

## 📌 At a Glance

<table>
<tr>
<td width="50%" valign="top">

**🙋 What this is**

A **BDD test framework** for Amazon-style e-commerce flows, built with **Cypress 14** and **Cucumber** (`@badeball/cypress-cucumber-preprocessor`). It covers 13 test cases (TC-001 to TC-013) in **39 scenarios**:

- sign-in, registration, logout, 2FA
- search with **filters and sorting**, cart, **checkout with coupons**
- returns, Prime, browsing and order history, Visa card, Associates

**Why a mock?** Live amazon.com blocks automated browsers with bot checks and CAPTCHAs, and its markup changes constantly. So every Amazon page is served by `cy.intercept`. The shopping and history pages are a **stateful mock**: filters really filter, the cart really holds quantities, coupons really change the total. The step definitions can therefore **fail** when the behaviour is wrong (see *Proof the tests can fail*).

</td>
<td width="50%" valign="top">

**📍 Quick facts**

| | |
|---|---|
| 🧪 **Scenarios** | 39 in 3 feature files |
| 🧩 **Step definitions** | 219 |
| 🌐 **Browsers in CI** | Chrome · Firefox · Edge (headless) |
| ⏱️ **Run time** | ≈ 1 min 10 s per browser |
| 🔁 **Retries in CI** | 0 (failures are not hidden) |
| 📊 **Reports** | Cucumber HTML dashboard · Mochawesome · screenshots |
| 🧹 **Lint** | ESLint + `eslint-plugin-cypress` |
| 🔐 **Secrets** | none; `.env.example` only |

</td>
</tr>
</table>

---

## ✅ Latest Results (GitHub Actions)

| Feature file | Scenarios | Chrome | Firefox | Edge |
|---|---:|:---:|:---:|:---:|
| `01-authentication.feature` | 10 | ✅ 10 · 15 s | ✅ 10 · 15 s | ✅ 10 · 15 s |
| `02-shopping.feature` | 13 | ✅ 13 · 26 s | ✅ 13 · 29 s | ✅ 13 · 28 s |
| `03-account-management.feature` | 16 | ✅ 16 · 24 s | ✅ 16 · 26 s | ✅ 16 · 26 s |
| **Total** | **39** | **39 / 39** | **39 / 39** | **39 / 39** |

```mermaid
pie showData
    title 39 scenarios by feature
    "Authentication (10)" : 10
    "Shopping (13)" : 13
    "Account management (16)" : 16
```

```mermaid
pie showData
    title 117 scenario runs (39 x 3 browsers)
    "Passed" : 117
    "Failed" : 0
```

```mermaid
xychart-beta
    title "Scenarios per test case"
    x-axis ["TC-001", "TC-002", "TC-003", "TC-004", "TC-005", "TC-006", "TC-007", "TC-008", "TC-009", "TC-010", "TC-011", "TC-012", "TC-013"]
    y-axis "Scenarios" 0 --> 6
    bar [3, 5, 2, 3, 3, 3, 4, 3, 3, 2, 3, 3, 2]
```

```mermaid
xychart-beta
    title "Run time per browser (seconds)"
    x-axis ["Chrome", "Firefox", "Edge"]
    y-axis "Seconds" 0 --> 80
    bar [66, 71, 71]
```

---

## 🧪 Proof the tests can fail

Before this rework many steps passed **whatever the page showed**:

- filters and sorting were empty steps
- the quantity step always picked option 0
- cart-count steps only checked that the badge existed
- "Added to Cart" was printed on every product page
- the data-table steps ignored their tables

To prove the new assertions catch bugs, three bugs were planted in the mock on a throw-away branch:

| Planted bug | Scenario that went red | Failing step |
|---|---|---|
| price sort removed | TC-004 Sort search results | `results should be sorted by ascending price` |
| cart ignores quantity | TC-005 Add multiple items to cart | `Cart count should display "3"` |
| cart ignores quantity | TC-006 Clear entire cart | `Given I have multiple items in cart` |
| SAVE10 gives no discount | TC-007 Apply coupon code | `Order total should be reduced` |

```mermaid
pie showData
    title Mutation check: 39 scenarios with 3 planted bugs
    "Caught (red)" : 4
    "Unaffected (green)" : 35
```

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Spec["📝 Gherkin (cypress/features)"]
        F1[01-authentication]
        F2[02-shopping]
        F3[03-account-management]
    end
    subgraph Steps["🧩 Step definitions"]
        A[auth.js · 32]
        S[shopping.js · 54]
        C[checkout-account.js · 133]
    end
    subgraph Data["📦 Fixtures"]
        SEL[selectors.json]
        TD[testData.json]
    end
    subgraph Mock["🎭 cy.intercept (cypress/support)"]
        E2E[e2e.js<br/>sign-in, registration, Prime,<br/>card, Associates, returns]
        SHOP[mock-shop.js<br/>catalog · search · filters · sort<br/>cart · checkout · orders]
        ACC[mock-account.js<br/>order + browsing history]
    end
    F1 & F2 & F3 -->|esbuild + badeball| Steps
    Steps --> Data
    Steps -->|cy.visit / click| Mock
    Mock --> B[(Chrome · Firefox · Edge)]
    B --> R[Cucumber JSON → HTML dashboard<br/>Mochawesome · screenshots]
```

### CI pipeline

```mermaid
flowchart TD
    P([push / PR / manual]) --> L[ESLint<br/>eslint-plugin-cypress]
    L -->|green| M{matrix}
    M --> CH[Chrome]
    M --> FF[Firefox]
    M --> ED[Edge]
    CH & FF & ED --> RUN[cypress-io/github-action<br/>retries = 0]
    RUN --> SUM[Step summary:<br/>scenarios per feature + failed step]
    RUN --> REP[(Artifacts: Cucumber HTML,<br/>Mochawesome, screenshots)]
```

### Cart and checkout flow (stateful mock)

```mermaid
sequenceDiagram
    autonumber
    participant T as Step definitions
    participant B as Browser
    participant M as mock-shop.js (cy.intercept)
    T->>B: type "laptop" + Enter
    B->>M: GET /s?k=laptop
    M-->>B: 6 results (price, rating, brand, date)
    T->>B: click "Price: $500-$1000", "Brand: Dell", "Rating: 4+"
    B->>M: GET /s?k=laptop&low-price=500&high-price=1000&brand=Dell&min-rating=4
    M-->>B: 2 results
    T->>B: open product, choose Qty 2, Add to Cart
    B->>M: GET /gp/cart/add?asin=B001&quantity=2
    M-->>B: "Added to Cart" · badge 2
    T->>B: Proceed to checkout, coupon SAVE10
    B-->>T: total = items + shipping − 10 %
    T->>B: Place your order
    B->>M: GET /gp/checkout/confirm?...
    M-->>B: order number, address, total · cart emptied
```

### Cart state

```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> HasItems: Add to Cart (qty n)
    HasItems --> HasItems: add more / change quantity
    HasItems --> HasItems: Remove one line
    HasItems --> Empty: Remove last line
    HasItems --> Empty: Delete all items
    HasItems --> Checkout: Proceed to checkout
    Checkout --> Checkout: shipping / payment / coupon / new address
    Checkout --> Ordered: Place your order
    Ordered --> Empty: cart cleared
```

### Mock data model

```mermaid
erDiagram
    PRODUCT ||--o{ CART_LINE : "added as"
    CART_LINE }o--|| CHECKOUT : "summed in"
    CHECKOUT ||--|| ORDER : "places"
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT {
        string asin "B001 … B013, UNAVAILABLE"
        string title
        string brand
        decimal price
        decimal rating
        date released
        bool outOfStock
    }
    CART_LINE {
        string asin
        int qty
    }
    CHECKOUT {
        decimal items
        decimal shipping "FREE · 9.99 · 14.99"
        decimal discount "SAVE10 = 10%"
        string payment "Credit · Debit · Amazon Pay"
        string address
    }
    ORDER {
        string orderId "112-xxxxxxx-xxxxxxx"
        decimal total
    }
```

---

## 🎯 Test Coverage

```mermaid
mindmap
  root((39 scenarios))
    Authentication 10
      register valid / bad email / weak password
      login valid / wrong password / unknown email
      logout + session ends
      remember me
      2FA
    Shopping 13
      search keyword
      filters price brand rating
      sort price rating newest
      add one / many / out of stock
      remove / update qty / delete all
      checkout / new address / coupon / payments
    Account 16
      returns x3
      Prime join features cancel
      browsing history + date filter
      orders + 6-month filter + invoice
      Visa card x3
      Associates x2
```

| TC | Module | Scenarios | What the steps check |
|---|---|---:|---|
| TC-001 | Registration | 3 | account created; exact error text for bad email / short password |
| TC-002 | Login | 5 | greeting switches from *Sign in* to *Test User*; exact error text; remember-me; OTP |
| TC-003 | Logout | 2 | session ends, protected page redirects to sign-in |
| TC-004 | Search | 3 | every title matches the keyword; every price in range, brand = Dell, rating ≥ 4; sort order of prices, ratings, release dates |
| TC-005 | Add to cart | 3 | badge goes 0 → 1; 2 lines with quantities summing to 3; out-of-stock button disabled |
| TC-006 | Cart | 3 | removed title gone, badge decreases, subtotal = Σ price × qty; quantity 3 recalculates line + subtotal; delete all → `$0.00` |
| TC-007 | Checkout | 4 | items `$834.98`; order number format; new address on the confirmation; SAVE10 → `-$83.50`, total `$751.48`; Amazon Pay hides the card fields |
| TC-008 | Returns | 3 | return label, status, tracking number, refund date |
| TC-009 | Prime | 3 | benefits listed in the feature table, sign-up and cancel flows |
| TC-010 | Browsing history | 2 | newest first; "Last 30 / 90 days" hide older items; clear empties the list |
| TC-011 | Orders | 3 | every order shows the 5 fields from the table; 6-month filter; invoice contains the 5 sections |
| TC-012 | Visa card | 3 | every row of the feature table is on the page |
| TC-013 | Associates | 2 | application flow; affiliate URL, QR code, HTML code, copy option |

> Mock depth: search, cart, checkout, orders and browsing history are **stateful**. Sign-in and registration have server-side rules (wrong password, unknown email, invalid email, short password). Prime, Visa card, Associates and returns are **static pages**, so those scenarios check page content and navigation only.

---

## ▶️ Running Locally

**Prerequisites:** Node 18+ (CI uses 20), Chrome / Firefox / Edge.

```bash
npm ci                          # installs Cypress 14 + Cucumber preprocessor
cp .env.example .env            # optional; nothing secret is needed
npm test                        # all 39 scenarios, Electron headless
npm run test:chrome             # or :firefox / :edge
npm run test:shopping           # one feature file (also :single, :account)
npm run open                    # Cypress app
node scripts/generate-report.js # Cucumber HTML dashboard
npm run lint                    # ESLint
```

| Report | Path |
|---|---|
| Cucumber HTML dashboard | `cypress/results/cucumber-html-report/index.html` |
| Cucumber built-in HTML | `cypress/results/cucumber-report.html` |
| Cucumber JSON | `cypress/results/cucumber-json/cucumber-report.json` |
| Mochawesome | `cypress/results/report.html` |
| Failure screenshots | `cypress/screenshots/` |

---

## 📁 Project Structure

```text
Amazon-Cypress-JavaScript-Automation/
├── .github/workflows/ci.yml        # lint → Chrome / Firefox / Edge
├── cypress.config.js               # esbuild + Cucumber + Mochawesome
├── cypress/
│   ├── features/                   # 01-authentication · 02-shopping · 03-account-management
│   ├── fixtures/                   # selectors.json · testData.json
│   └── support/
│       ├── e2e.js                  # global hooks, sign-in / account stubs, custom commands
│       ├── mock-shop.js            # stateful catalog, search, cart, checkout, orders
│       ├── mock-account.js         # stateful order history + browsing history
│       └── step_definitions/       # auth.js · shopping.js · checkout-account.js
├── scripts/generate-report.js      # multiple-cucumber-html-reporter
├── docs/                           # test-case workbook + first-version notes
└── .env.example
```

---

## 🧹 Maintenance Log

| Area | Before | Now |
|---|---|---|
| Repo | **README only**, no code on GitHub | full framework source; reports, PDFs, `node_modules`, `.env` ignored |
| Install | `package-lock.json` out of sync → `npm ci` failed | lock regenerated |
| Filters / sort | empty steps | real refinements and sort; values checked |
| Quantity | always `select(0)` | selects the requested quantity |
| Cart counts | "badge exists" | exact counts, line totals, subtotal maths |
| "Added to Cart" | printed on every product page | only after an add |
| Data tables | `I should see:` checked `body` exists; tables ignored | every table row asserted |
| Error messages | any error box passed | exact text from the feature |
| Waits | 24 fixed `cy.wait(ms)` | removed; Cypress retry-ability + assertions |
| Dead code | unused `amazon-mock.js` (36 KB), duplicate config and fixtures | removed |
| Config | `allowCypressEnv` (a Cypress 15 option) | removed for Cypress 14 |
| Lint | `npm run lint` had no config | `.eslintrc.json` with `eslint-plugin-cypress` |
| CI | none | GitHub Actions, 3 browsers, 0 retries, failed step in the run summary |

---

## 📈 Roadmap

- [x] CI on Chrome, Firefox and Edge
- [x] Stateful mock for shopping, orders and history
- [ ] Make Prime, Visa card, Associates and returns stateful too
- [ ] Page objects on top of `selectors.json`
- [ ] `cypress-axe` accessibility checks
- [ ] Publish the Cucumber dashboard to GitHub Pages

---

## 🔗 Related Projects

| Repo | What it is |
|---|---|
| [AmazonSeleniumTest](https://github.com/rbchy/AmazonSeleniumTest) | Selenium + Cucumber against live Amazon, with bot-wall detection |
| [QaBrainsAutomationCypressJavaScript](https://github.com/rbchy/QaBrainsAutomationCypressJavaScript) | Cypress suite for practice.qabrains.com |
| [NorthFace_AutomationExercise-BDD-Test-Automation](https://github.com/rbchy/NorthFace_AutomationExercise-BDD-Test-Automation) | Selenium + Cucumber BDD web suite |
| [RbcTcsWorld_ECommerceSuite](https://github.com/rbchy/RbcTcsWorld_ECommerceSuite) | Amazon-inspired e-commerce backend + test framework |
| [rbchy](https://github.com/rbchy/rbchy) | Profile and full project list |

---

## ⚠️ Disclaimer

Educational / portfolio project, not affiliated with Amazon. No request reaches amazon.com: all pages are mocked with `cy.intercept`, and all test data (`testuser@gmail.com`, card `4111…`) is fake.

---

## 👤 Author

<div align="center">

**Ranajit Baran Chowdhury (RB Chowdhury)**
QA Automation Engineer / SDET · West Norriton, Pennsylvania, USA

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rbchy/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rbchy)
[![Website](https://img.shields.io/badge/Website-rbchy.github.io%2Frbchy-0d9488?style=for-the-badge&logo=githubpages&logoColor=white)](https://rbchy.github.io/rbchy/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-blueviolet?style=for-the-badge&logo=wix&logoColor=white)](https://rbc6543.wixsite.com/rbc-portfolio)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:chyranajit@gmail.com)

⭐ *If this project helps you, a star on the repo is appreciated.*

</div>
