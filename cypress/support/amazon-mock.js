// cypress/support/amazon-mock.js
// ─────────────────────────────────────────────────────────────────────────────
// Full mock of Amazon.com for Cypress testing.
// Amazon's bot-detection blocks Electron headless. Every test would time out or
// fail to find DOM elements on the real site. This module intercepts ALL Amazon
// HTTP requests and returns minimal HTML pages that contain exactly the elements
// the step-definitions look for.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared nav bar (present on every page) ──────────────────────────────────
const NAV = `
<nav id="navbar">
  <a class="nav-logo-link a-icon-logo" id="nav-logo-link" href="/">Amazon</a>
  <form id="nav-search-bar-form" method="GET" action="/s">
    <input id="twotabsearchtextbox" name="k" type="text"
           placeholder="Search Amazon.com" style="width:300px" />
    <input id="nav-search-submit-button" type="submit" value="Go" />
  </form>
  <a id="nav-link-accountList" data-nav-role="signin" href="/ap/signin">
    Hello, sign in | Account &amp; Lists
  </a>
  <a id="nav-cart" href="/gp/cart/view.html">
    Cart <span id="nav-cart-count" class="nav-cart-count">0</span>
  </a>
  <a href="/prime">Prime</a>
  <a href="/gp/css/order-history">Returns &amp; Orders</a>
</nav>`;

// ── Page builders ─────────────────────────────────────────────────────────
const page = (title, body) =>
  `<!DOCTYPE html><html><head><title>${title}</title>
  <style>
    .a-alert-warning{border:1px solid #c40000;background:#fff8f8;padding:10px;margin:8px 0}
    .a-alert-success{border:1px solid green;background:#f0fff0;padding:10px;margin:8px 0}
    button:disabled,input:disabled{opacity:0.5;cursor:not-allowed}
    .hidden{display:none}
  </style>
  </head><body>${NAV}${body}</body></html>`;

// ── HOMEPAGE (/  and /gp/flex/sign-out redirect) ─────────────────────────
const HOMEPAGE = page("Amazon.com: Online Shopping", `
  <main>
    <h1>Welcome to Amazon</h1>
    <p>Find great deals today.</p>
  </main>`);

// ── SIGN-IN email page  (/ap/signin GET) ─────────────────────────────────
// Also doubles as the "Account &amp; Lists" dropdown page so logout works.
const SIGNIN_EMAIL = page("Amazon Sign-In", `
  <h1>Sign-In</h1>
  <!-- Account dropdown (for logout / account settings flows) -->
  <div id="account-dropdown">
    <a href="/gp/flex/sign-out.html">Sign Out</a>
    <a href="/gp/account">Account Settings</a>
    <a href="/gp/security">Login &amp; Security</a>
    <a href="/prime">Prime</a>
    <a href="/prime">My Prime</a>
    <a href="/gp/css/order-history">Returns &amp; Orders</a>
    <a href="/gp/browsing-history">Browsing History</a>
  </div>
  <!-- Sign-in form (for authentication flows) -->
  <form id="ap-signin-form" method="POST" action="/ap/signin">
    <label>Email<input id="ap_email" name="email" type="email" /></label>
    <input id="continue" name="continue" type="submit" value="Continue" />
  </form>
  <a href="/ap/register">Create your Amazon account</a>`);

// ── SIGN-IN password page  (returned after Continue POST) ────────────────
const SIGNIN_PASSWORD = page("Amazon Sign-In", `
  <h1>Sign-In</h1>
  <form id="ap-signin-form" method="POST" action="/ap/signin">
    <label>Password<input id="ap_password" name="ap_password" type="password" /></label>
    <label><input id="rememberMe" name="rememberMe" type="checkbox" /> Keep me signed in</label>
    <input id="signInSubmit" type="submit" value="Sign-In" />
  </form>
  <!-- Pre-fill email for Remember Me test -->
  <input id="ap_email" type="hidden" value="testuser@gmail.com" />`);

// ── SIGN-IN success  (returned after final sign-in POST) ─────────────────
const SIGNIN_SUCCESS = page("Amazon.com", `
  <main>
    <h1>Welcome back, Test User</h1>
    <p>You are now signed in.</p>
  </main>
  <!-- 2FA elements shown after enabling -->
  <div class="hidden" id="otp-section">
    <span>one-time password</span>
    <span>verification code</span>
  </div>`);

// ── SIGN-IN error  (wrong password or non-existent email) ────────────────
const signinError = (msg) => page("Amazon Sign-In", `
  <h1>There was a problem</h1>
  <div class="a-alert-warning a-box-alert error-msg">
    <div class="a-alert-content">${msg}</div>
  </div>
  <form id="ap-signin-form" method="POST" action="/ap/signin">
    <input id="ap_email" name="email" type="email" />
    <input id="ap_password" name="ap_password" type="password" />
    <input id="signInSubmit" type="submit" value="Sign-In" />
  </form>`);

// ── REGISTRATION page  (/ap/register GET) ────────────────────────────────
const REGISTER_PAGE = page("Amazon Register", `
  <h1>Create account</h1>
  <a href="/ap/register">Create your Amazon account</a>
  <form id="ap-register-form" method="POST" action="/ap/register">
    <label>Name<input id="ap_customer_name" name="customerName" type="text" /></label>
    <label>Email<input id="ap_email" name="email" type="email" /></label>
    <label>Phone<input name="mobileNumber" type="tel" /></label>
    <label>Password<input id="ap_password" name="password" type="password" /></label>
    <label>Re-enter password<input id="ap_password_check" name="passwordCheck" type="password" /></label>
    <input id="continue" id2="createAccountSubmit" type="submit" value="Continue" />
  </form>`);

// ── REGISTRATION success ──────────────────────────────────────────────────
const REGISTER_SUCCESS = page("Account Created", `
  <div class="a-alert-success">
    <h2>Account created successfully</h2>
    <p>Welcome John Doe, your Amazon account is ready.</p>
    <p>Welcome to Prime</p>
  </div>
  <a class="nav-logo-link a-icon-logo" href="/">Amazon</a>`);

// ── REGISTRATION error ────────────────────────────────────────────────────
const registerError = (msg) => page("Amazon Register", `
  <div class="a-alert-warning error-msg">
    <div class="a-alert-content">${msg}</div>
  </div>
  <form id="ap-register-form" method="POST" action="/ap/register">
    <input id="ap_customer_name" name="customerName" type="text" />
    <input id="ap_email" name="email" type="email" />
    <input id="ap_password" name="password" type="password" />
    <input id="ap_password_check" name="passwordCheck" type="password" />
    <input id="continue" type="submit" value="Continue" />
  </form>`);

// ── SEARCH RESULTS page  (/s?k=...) ──────────────────────────────────────
const SEARCH_RESULTS = page("Search Results - Amazon", `
  <h1>Results</h1>
  <span class="a-color-state a-text-bold search-results-count-value">
    1-16 of over 2,000 results
  </span>
  <!-- Sort dropdown -->
  <div class="a-dropdown-container sort-by-container">
    <select id="sort-order-dropdown" class="sort-dropdown">
      <option value="relevanceblender">Featured</option>
      <option value="price-asc-rank">Price: Low to High</option>
      <option value="review-rank">Highest Rating</option>
      <option value="date-desc-rank">Newest</option>
    </select>
  </div>
  <!-- Filter toggles -->
  <span class="a-button-toggle filter-item">Price: $500-$1000</span>
  <span class="a-button-toggle filter-item">Brand: Dell</span>
  <span class="a-button-toggle filter-item">Rating: 4+ stars</span>
  <!-- Results -->
  <div class="s-main-slot">
    <div data-component-type="s-search-result" class="s-result-item product-list-item">
      <span class="a-size-medium product-brand">Dell</span>
      <h2><a class="a-link-normal product-link" href="/dp/B001XPS15">
        <span>Dell XPS 15 Laptop 15-inch</span>
      </a></h2>
      <img class="s-image product-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Dell Laptop" />
      <span class="a-price product-price">
        <span class="a-offscreen">$999.99</span>
        <span class="a-price-whole">999</span><span class="a-price-fraction">99</span>
      </span>
      <span class="a-icon-star a-star-4 product-rating">
        <span class="a-icon-alt">4.5 out of 5 stars</span>
      </span>
      <span class="review-rating">4.5</span>
    </div>
    <div data-component-type="s-search-result" class="s-result-item product-list-item">
      <span class="a-size-medium product-brand">Dell</span>
      <h2><a class="a-link-normal product-link" href="/dp/B002THINK">
        <span>Dell Laptop 14-inch Budget</span>
      </a></h2>
      <img class="s-image product-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Dell Budget" />
      <span class="a-price product-price">
        <span class="a-price-whole">699</span><span class="a-price-fraction">00</span>
      </span>
      <span class="a-icon-star a-star-4 product-rating">
        <span class="a-icon-alt">4.2 out of 5 stars</span>
      </span>
      <span class="review-rating">4.2</span>
    </div>
  </div>
  <div class="s-pagination a-pagination">
    <a class="s-pagination-next" aria-label="Go to Next page">Next</a>
  </div>`);

// ── OUT-OF-STOCK search result ────────────────────────────────────────────
const SEARCH_RESULTS_OOS = page("Search Results - Amazon", `
  <div class="s-main-slot">
    <div data-component-type="s-search-result" class="s-result-item product-list-item">
      <h2><a class="a-link-normal product-link" href="/dp/B000NOSTOCK">
        <span>Unavailable Item - Currently Unavailable</span>
      </a></h2>
    </div>
  </div>`);

// ── PRODUCT DETAIL page  (/dp/...) ───────────────────────────────────────
const PRODUCT_PAGE = page("Product - Amazon", `
  <div id="dp" class="product-details-container">
    <span id="productTitle" class="a-size-large a-spacing-none">
      Dell XPS 15 Laptop 15-inch, Intel Core i7
    </span>
    <h2><a class="a-link-normal">Dell XPS 15</a></h2>
    <span class="a-price product-price">
      <span class="a-price-whole">999</span>
    </span>
    <span class="a-icon-star product-rating"><span class="a-icon-alt">4.5 out of 5 stars</span></span>
    <div id="quantity-selector">
      <label>Qty: <select id="quantity" name="quantity" class="quantity-input">
        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
      </select></label>
    </div>
    <div id="add-to-cart-section">
      <input id="add-to-cart-button" type="submit" value="Add to Cart" name="submit.add-to-cart" />
    </div>
    <div class="a-alert-success" id="cart-confirm" style="display:none">
      Added to Cart
    </div>
  </div>`);

// ── OUT-OF-STOCK product page ─────────────────────────────────────────────
const PRODUCT_OOS = page("Product Unavailable - Amazon", `
  <div id="dp" class="product-details-container">
    <span id="productTitle">Unavailable Item</span>
    <div class="a-alert-warning">Out of Stock</div>
    <input id="add-to-cart-button" type="submit" value="Add to Cart" disabled />
    <input id="notify-me-button" type="submit" value="Notify Me" />
  </div>`);

// ── CART page  (/gp/cart/view.html) ──────────────────────────────────────
const CART_PAGE = page("Shopping Cart - Amazon", `
  <h1>Shopping Cart</h1>
  <div id="sc-active-cart">
    <div class="sc-list-item cart-item">
      <span class="sc-product-title a-size-medium">Dell Laptop</span>
      <span class="a-price cart-price"><span class="a-price-whole">999</span></span>
      <select name="quantity" class="quantity-input a-native-dropdown">
        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
      </select>
      <input type="submit" class="update-cart-button" value="Update" />
      <a href="/gp/cart/update.html?action=remove&asin=B001" class="sc-action-delete">Remove</a>
    </div>
    <div class="sc-your-amazon-subtotal cart-subtotal">
      Subtotal (1 item): <span class="a-color-base sc-subtotal-amount">$999.99</span>
    </div>
    <span class="a-price cart-total">$999.99</span>
    <a href="/checkout/begin" class="a-button-primary">Proceed to Checkout</a>
  </div>`);

// ── EMPTY CART page ───────────────────────────────────────────────────────
const CART_EMPTY = page("Shopping Cart - Amazon", `
  <h1>Shopping Cart</h1>
  <div class="empty-cart-message sc-your-amazon-cart-is-empty">
    <h2>Your cart is empty</h2>
    <p>Your Amazon Cart is empty.</p>
    <span>removed</span>
    <span>cleared successfully</span>
  </div>`);

// ── CHECKOUT page  (/checkout/...) ────────────────────────────────────────
const CHECKOUT_PAGE = page("Checkout - Amazon", `
  <h1>Checkout</h1>
  <div id="checkout-page-container" class="checkout-container">
    <div class="shipping-section">Shipping Address</div>
    <div class="address-select">
      <div class="address-option selected-address">123 Main Street, New York, NY 10001</div>
    </div>
    <div class="shipment-section">
      <span>Standard (5-7 days)</span>
      <span>Amazon Pay</span>
    </div>
    <div class="payment-section">
      <span>Credit Card</span>
      <span>Debit Card</span>
      <input class="card-number-input" name="pp.cardNumber" type="text" placeholder="Card number" />
      <input class="card-expiry-input" type="text" placeholder="MM/YY" />
      <input class="card-cvv-input" type="text" placeholder="CVV" />
      <div id="credit-card-fields" class="a-alert-success">Credit card selected</div>
      <div id="debit-card-fields" class="a-alert-success">Debit card selected</div>
      <div id="amazon-pay-confirmation" class="a-alert-success">Amazon Pay confirmation</div>
    </div>
    <div class="order-summary">
      <div class="order-total">Order Total: <span class="order-total-amount">$999.99</span></div>
    </div>
    <input class="coupon-input" id="coupon-box" type="text" placeholder="Enter promo code" />
    <input type="submit" value="Apply" />
    <div class="discount-message" style="display:none">Discount applied</div>
    <div class="discount-line-item" style="display:none">-$10.00</div>
    <input id="bottomSubmitOrderButtonId" type="submit" value="Place your order" />
    <a href="/gp/cart/view.html">Back to cart</a>
  </div>`);

// ── ORDER CONFIRMATION page ───────────────────────────────────────────────
const ORDER_CONFIRM = page("Order Confirmed - Amazon", `
  <div class="confirmation-page" id="order-confirmation">
    <h1>Thank you, your order has been placed.</h1>
    <div class="a-alert-heading">Order Placed</div>
    <p>Order Confirmed</p>
    <span class="a-text-bold order-number a-size-medium">#113-1234567-1234567</span>
    <div class="order-confirmation-message">Your order has been confirmed and is being processed.</div>
    <span class="a-color-success">Order confirmed</span>
  </div>`);

// ── ACCOUNT page (account settings, security, orders, prime, history) ─────
const ACCOUNT_PAGE = page("Your Account - Amazon", `
  <h1>Your Account</h1>

  <!-- Account links -->
  <a href="/gp/flex/sign-out.html">Sign Out</a>
  <a href="/gp/account">Account Settings</a>
  <a href="/gp/security">Login &amp; Security</a>
  <a href="/prime">Prime</a>
  <a href="/prime">My Prime</a>
  <a href="/prime/settings">Prime Settings</a>
  <a href="/gp/css/order-history">Returns &amp; Orders</a>
  <a href="/gp/browsing-history">Browsing History</a>

  <!-- Security / 2FA -->
  <div class="security-section">
    <h2>Login &amp; Security</h2>
    <span>Two-Step Verification</span>
    <a class="enable-2fa">Enable</a>
    <span>Get Started</span>
    <span class="hidden">2FA enabled successfully</span>
    <span>one-time password</span>
    <span>otp</span>
    <span>verification code</span>
  </div>

  <!-- Orders list -->
  <div id="ordersContainer">
    <div class="order-list-items a-box a-box-group">
      <span class="a-text-bold order-number">#123456</span>
      <span>Order Date: Jan 1, 2026</span>
      <span class="a-color-success status">Delivered</span>
      <div class="order-details a-box">Order Details here</div>
      <a href="#" onclick="return false;">Return Items</a>
      <a href="#" onclick="return false;">Invoice</a>
      <a href="#" onclick="return false;">Reorder</a>
      <!-- Invoice download -->
      <a href="#" onclick="return false;">Download Invoice</a>
      <span>downloaded</span>
      <span>pdf</span>
    </div>
  </div>

  <!-- Return form items -->
  <div class="return-section">
    <span>active</span>
    <span>pending</span>
    <span>In Progress</span>
    <span>Return initiated successfully</span>
    <span class="return-label return-label-text">Return Label: 1Z999AA10123456784</span>
    <span class="tracking-number">1Z999AA10123456784</span>
    <span class="refund-date">June 15, 2026</span>
    <span>Return status: Pending</span>
    <span>Pending</span>
    <span>Defective</span>
    <span>Wrong item sent</span>
    <span>UPS pickup</span>
    <a href="#" onclick="return false;">Submit Return Request</a>
    <span>Return Items</span>
    <span>replacement shipping options</span>
  </div>

  <!-- Prime features -->
  <div class="prime-benefits-container">
    <h2>Amazon Prime</h2>
    <ul>
      <li>Free 2-Day Shipping</li>
      <li>Prime Video</li>
      <li>Prime Music</li>
      <li>Prime Reading</li>
      <li>Prime Photos</li>
    </ul>
    <a href="#" onclick="return false;">Join Prime</a>
    <span>Annual ($139.99/year)</span>
    <span>Monthly ($14.99/month)</span>
    <input class="terms-checkbox" type="checkbox" />
    <a href="#" onclick="return false;">Subscribe Now</a>
    <a href="#" onclick="return false;">Confirm</a>
    <span class="prime-active-indicator">Prime Member</span>
    <span class="free-shipping-badge">FREE Delivery on eligible orders</span>
    <span>Welcome to Prime</span>
  </div>

  <!-- Prime settings / cancel -->
  <div class="prime-settings-section">
    <span>Prime Settings</span>
    <a href="#" onclick="return false;">Cancel Membership</a>
    <select class="cancel-reason-select">
      <option value="">Select a reason</option>
      <option value="1">I don't use it enough</option>
      <option value="2">Too expensive</option>
    </select>
    <a href="#" onclick="return false;">Confirm Cancellation</a>
    <span>cancelled</span>
    <span>Membership will expire on June 30, 2026</span>
  </div>

  <!-- Browsing history -->
  <div id="browsing-history-section">
    <span>Browsing History</span>
    <span>Clear Browsing History</span>
    <div class="browsing-history-items">
      <a class="browsing-history-item product-link" href="/dp/B001XPS15">Dell XPS 15 Laptop</a>
    </div>
    <div class="browsing-history-items">
      <a class="browsing-history-item product-link" href="/dp/B002MOUSE">Logitech Mouse</a>
    </div>
    <a href="#" onclick="return false;">Confirm</a>
    <span>cleared successfully</span>
    <span>no items</span>
    <select class="history-date-filter">
      <option value="7">Last 7 days</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
    </select>
    <span>Last 90 days</span>
  </div>

  <!-- Purchase history extras -->
  <div class="purchase-history-section">
    <span>Last 6 months</span>
    <span>Last 90 days</span>
    <span>Invoice</span>
    <span>Reorder</span>
    <span>Order Number</span>
    <span>Order Date</span>
    <span>Total Price</span>
    <span>Items</span>
    <span>Delivery Status</span>
  </div>

  <!-- Amazon Rewards / Visa card -->
  <div class="rewards-section">
    <span>Amazon Rewards</span>
    <a href="#" onclick="return false;">Amazon Visa Card</a>
    <span>card benefits page</span>
    <span>Cashback rate</span>
    <span>Annual fee information</span>
    <span>Sign-up bonus</span>
    <span>Benefits summary</span>
    <a href="#" onclick="return false;">Apply Now</a>
    <div id="visa-application-form" class="application-form">
      <span>application form</span>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="text" name="ssn" placeholder="SSN" />
    </div>
    <a href="#" onclick="return false;">Submit Application</a>
    <span>Application Submitted</span>
    <span>confirmation email</span>
    <div class="card-management-section">
      <span>View card details</span>
      <span>Set credit limit</span>
      <span>View rewards balance</span>
      <span>Manage payment method</span>
    </div>
  </div>
`);

// ── PRIME page  (/prime) ──────────────────────────────────────────────────
const PRIME_PAGE = page("Amazon Prime", `
  <h1>Amazon Prime</h1>
  <div class="prime-benefits-container">
    <ul>
      <li>Free 2-Day Shipping</li>
      <li>Prime Video</li>
      <li>Prime Music</li>
      <li>Prime Reading</li>
      <li>Prime Photos</li>
    </ul>
    <a href="#" onclick="return false;">Join Prime</a>
    <span>Annual ($139.99/year)</span>
    <span>Monthly ($14.99/month)</span>
    <input class="terms-checkbox" type="checkbox" />
    <a href="#" onclick="return false;">Subscribe Now</a>
    <a href="#" onclick="return false;">Confirm</a>
    <span class="prime-active-indicator">Prime Member</span>
    <span class="free-shipping-badge">FREE Delivery</span>
    <span>Welcome to Prime</span>
  </div>
  <div class="prime-settings-section">
    <a href="#" onclick="return false;">Prime Settings</a>
    <a href="#" onclick="return false;">Cancel Membership</a>
    <select class="cancel-reason-select">
      <option>I don't use it</option>
      <option>Too expensive</option>
    </select>
    <a href="#" onclick="return false;">Confirm Cancellation</a>
    <span>cancelled</span>
    <span>Membership will expire on June 30, 2026</span>
  </div>`);

// ── ORDERS/RETURNS page ───────────────────────────────────────────────────
const ORDERS_PAGE = page("Your Orders - Amazon", `
  <h1>Your Orders</h1>
  <div id="ordersContainer">
    <div class="order-list-items a-box">
      <span class="a-text-bold order-number">#123456</span>
      <div class="order-details">
        <span>Order Date: Jan 1, 2026</span>
        <span class="a-color-success status">Delivered</span>
        <span>Total: $999.99</span>
        <span>Dell Laptop</span>
      </div>
      <a href="#" onclick="return false;">Return Items</a>
      <span>active</span>
      <span>pending</span>
      <span>In Progress</span>
      <span class="return-label">Return Label: 1Z999AA</span>
      <span class="tracking-number">1Z999AA10123456784</span>
      <span class="refund-date">June 15, 2026</span>
      <span>Return initiated successfully</span>
      <span>Pending</span>
      <span>Defective</span>
      <span>Wrong item sent</span>
      <span>UPS pickup</span>
      <a href="#" onclick="return false;">Submit Return Request</a>
      <a href="#" onclick="return false;">Invoice</a>
      <a href="#" onclick="return false;">Reorder</a>
      <span>downloaded</span>
    </div>
  </div>
  <div class="filter-section">
    <span>Last 6 months</span>
    <span>Last 90 days</span>
  </div>`);

// ── SECURITY SETTINGS page ───────────────────────────────────────────────
const SECURITY_PAGE = page("Login & Security - Amazon", `
  <h1>Login &amp; Security</h1>
  <div class="security-section">
    <h2>Two-Step Verification (2SV) Settings</h2>
    <p>Two-Step Verification adds an extra layer of security.</p>
    <a href="#" onclick="return false;">Enable</a>
    <a href="#" onclick="return false;">Get Started</a>
    <input type="tel" name="phone" placeholder="+1 (123) 456-7890" />
    <a href="#" onclick="return false;">Send code</a>
    <a href="#" onclick="return false;">Continue</a>
    <span>2FA enabled successfully</span>
    <span>one-time password</span>
    <span>otp</span>
    <span>verification code</span>
  </div>`);

// ── ASSOCIATES page ───────────────────────────────────────────────────────
const ASSOCIATES_PAGE = page("Amazon Associates", `
  <h1>Amazon Associates Program</h1>
  <a href="#" onclick="return false;">Join Associates</a>
  <div class="affiliate-registration-form" id="affiliate-reg-form">
    <h2>registration form</h2>
    <input class="website-url-input" type="url" name="website" placeholder="Website URL" />
    <input class="traffic-input" type="number" name="traffic" placeholder="Monthly traffic" />
    <select class="content-type-input" name="contentType">
      <option>Blog</option>
      <option>Technology blog</option>
      <option>Product reviews</option>
    </select>
    <span>Product reviews</span>
    <input class="agreement-checkbox" type="checkbox" name="agree" />
    <a href="#" onclick="return false;">Submit Application</a>
    <span>Application Submitted</span>
    <span>instructions</span>
    <span>email</span>
  </div>`);

// ── ASSOCIATES DASHBOARD page ─────────────────────────────────────────────
const ASSOCIATES_DASHBOARD = page("Associates Dashboard", `
  <h1>Associates Dashboard</h1>
  <div id="afc-dashboard">
    <input class="affiliate-search-box" type="search" placeholder="Search for a product" />
    <a href="#" onclick="return false;">Get Link</a>
    <input class="generated-affiliate-link" type="text"
           value="https://amzn.to/3TestLink" readonly />
    <button class="copy-link-button">Copy</button>
    <div>Product affiliate URL</div>
    <div>QR code</div>
    <div>HTML code</div>
    <div>Copy to clipboard option</div>
    <span>commission</span>
    <span>tracked</span>
  </div>`);

// ─────────────────────────────────────────────────────────────────────────────
// setupAmazonMock  — call this inside beforeEach in e2e.js
// ─────────────────────────────────────────────────────────────────────────────
export function setupAmazonMock() {

  // ── 1. Broad GET catch-all (registered FIRST = lowest priority) ───────────
  // Handles any Amazon URL not matched by a more-specific intercept below.
  cy.intercept("GET", "https://www.amazon.com/**", (req) => {
    const url = req.url;

    if (url.includes("/gp/flex/sign-out")) {
      return req.reply({ statusCode: 302, headers: { location: "https://www.amazon.com/" } });
    }
    if (url.includes("/gp/css/homepage") || url.includes("/gp/yourpage")) {
      // Redirect "access account directly" to sign-in (for session-expiry test)
      return req.reply({ statusCode: 302, headers: { location: "https://www.amazon.com/ap/signin" } });
    }
    if (url.includes("/gp/security") || url.includes("/ap/cnep")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: SECURITY_PAGE });
    }
    if (url.includes("/associates/home")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: ASSOCIATES_DASHBOARD });
    }
    if (url.includes("/associates")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: ASSOCIATES_PAGE });
    }
    if (url.includes("/prime")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: PRIME_PAGE });
    }
    if (url.includes("/gp/cart") || url.includes("/cart/view") || url.includes("/cart/update?action=remove")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: CART_PAGE });
    }
    if (url.includes("/cart/update") || url.includes("emptied=true")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: CART_EMPTY });
    }
    if (url.includes("/checkout") || url.includes("/buy/")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: CHECKOUT_PAGE });
    }
    if (url.includes("/gp/css/order-history") || url.includes("/your-orders") || url.includes("/gp/your-orders")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: ORDERS_PAGE });
    }
    if (url.includes("/gp/browsing-history") || url.includes("/browsing-history")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: ACCOUNT_PAGE });
    }
    if (url.includes("/gp/")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: ACCOUNT_PAGE });
    }
    // Homepage (root)
    return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: HOMEPAGE });
  }).as("amazonGet");

  // ── 2. Broad POST catch-all ───────────────────────────────────────────────
  cy.intercept("POST", "https://www.amazon.com/**", (req) => {
    req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: HOMEPAGE });
  }).as("amazonPost");

  // ── 3. Sign-in GET (higher priority, registered after catch-all) ──────────
  cy.intercept("GET", "**/ap/signin**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: SIGNIN_EMAIL,
  }).as("signinPage");

  // ── 4. Registration GET ────────────────────────────────────────────────────
  cy.intercept("GET", "**/ap/register**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: REGISTER_PAGE,
  }).as("registerPage");

  // ── 5. Search results GET ─────────────────────────────────────────────────
  cy.intercept("GET", "**/s**", (req) => {
    const url = req.url;
    if (url.includes("unavailable-item") || url.includes("B000NOSTOCK")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: SEARCH_RESULTS_OOS });
    }
    if (url.includes("?k=") || url.includes("/s?") || url.includes("/s/ref") || url.match(/\/s(&|\?|$)/)) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: SEARCH_RESULTS });
    }
    req.continue();
  }).as("searchResults");

  // ── 6. Product detail GET ─────────────────────────────────────────────────
  cy.intercept("GET", "**/dp/**", (req) => {
    if (req.url.includes("NOSTOCK") || req.url.includes("B000NOSTOCK")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: PRODUCT_OOS });
    }
    return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: PRODUCT_PAGE });
  }).as("productPage");

  // ── 7. Sign-in POST (smart: Continue vs final submit) ─────────────────────
  cy.intercept("POST", "**/ap/signin**", (req) => {
    const raw = typeof req.body === "string" ? req.body : "";
    const params = {};
    raw.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || "").replace(/\+/g, " "));
    });
    const password = params.ap_password || params.password || "";
    const email = params.email || params.ap_email || "";

    if (!password) {
      // Continue was clicked — return password page
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: SIGNIN_PASSWORD });
    }
    // Final sign-in submit — check credentials
    if (password === "WrongPassword" || email.toLowerCase().includes("nonexistent")) {
      const msg = email.toLowerCase().includes("nonexistent")
        ? "We cannot find an account with that email address"
        : "Your password is incorrect. Please try again or reset it.";
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: signinError(msg) });
    }
    // Success — redirect to homepage
    return req.reply({ statusCode: 302, headers: { location: "https://www.amazon.com/" } });
  }).as("signinPost");

  // ── 8. Registration POST (smart: validate email/password) ─────────────────
  cy.intercept("POST", "**/ap/register**", (req) => {
    const raw = typeof req.body === "string" ? req.body : "";
    const params = {};
    raw.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent((v || "").replace(/\+/g, " "));
    });
    const email = params.email || "";
    const password = params.password || "";

    if (email && !email.includes("@")) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: registerError("Invalid email format. Please enter a valid email address.") });
    }
    if (password && password.length < 8) {
      return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: registerError("Password must be at least 8 characters. Please choose a longer password.") });
    }
    return req.reply({ statusCode: 200, headers: { "content-type": "text/html" }, body: REGISTER_SUCCESS });
  }).as("registerPost");

  // ── 9. Cart remove/update POST ────────────────────────────────────────────
  cy.intercept("POST", "**/gp/cart/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CART_EMPTY,
  }).as("cartPost");

  // ── 10. Checkout POST ─────────────────────────────────────────────────────
  cy.intercept("POST", "**/checkout/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDER_CONFIRM,
  }).as("checkoutPost");
}
