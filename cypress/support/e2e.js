// cypress/support/e2e.js
// All Amazon pages are stubbed so tests run without real network access.

Cypress.on("uncaught:exception", () => false);

// ─── Stub HTML pages ───────────────────────────────────────────────────────

const NAV = `
  <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
  <a href="/ap/signin" data-nav-role="signin" id="nav-link-accountList">Hello, Sign in Account &amp; Lists</a>
  <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
  <a href="/gp/flex/sign-out.html">Sign Out</a>
`;

const HOME_HTML = `<!DOCTYPE html><html><head><title>Amazon</title></head><body>
  <nav id="navbar">${NAV}</nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" placeholder="Search Amazon.com" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>
</body></html>`;

const SIGNIN_HTML = `<!DOCTYPE html><html><head><title>Amazon Sign-In</title></head><body>
  <nav>${NAV}</nav>
  <form action="/ap/signin-password" method="get">
    <input id="ap_email" name="email" type="email" placeholder="Email" />
    <input id="rememberMe" name="rememberMe" type="checkbox" value="1" />
    <input id="continue" type="submit" value="Continue" />
  </form>
  <a href="/ap/register">Create your Amazon account</a>
</body></html>`;

const PASSWORD_HTML = (email) => `<!DOCTYPE html><html><head><title>Amazon Sign-In</title></head><body>
  <nav>${NAV}</nav>
  <form action="/ap/signin-submit" method="get">
    <input type="hidden" name="email" value="${email}" />
    <input id="ap_password" name="ap_password" type="password" placeholder="Password" />
    <input id="rememberMe" name="rememberMe" type="checkbox" value="1" />
    <input id="signInSubmit" type="submit" value="Sign-In" />
  </form>
</body></html>`;

const LOGGED_IN_HOME_HTML = `<!DOCTYPE html><html><head><title>Amazon</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin" id="nav-link-accountList">Hello, Test User Account &amp; Lists</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" placeholder="Search Amazon.com" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>
</body></html>`;

const ERROR_HTML = (msg) => `<!DOCTYPE html><html><head><title>Amazon Sign-In</title></head><body>
  <nav>${NAV}</nav>
  <div class="a-alert-warning a-box-alert">
    <div class="a-alert-content">${msg}</div>
  </div>
  <input id="ap_email" type="email" />
  <input id="ap_password" type="password" />
  <input id="signInSubmit" type="submit" value="Sign-In" />
</body></html>`;

const REG_FORM_HTML = `<!DOCTYPE html><html><head><title>Amazon Registration</title></head><body>
  <nav>${NAV}</nav>
  <form action="/ap/register-submit" method="get">
    <input id="ap_customer_name" name="ap_customer_name" type="text" placeholder="Your name" />
    <input id="ap_email" name="ap_email" type="text" placeholder="Email" />
    <input id="ap_password" name="ap_password" type="password" placeholder="Password" />
    <input id="ap_password_check" name="ap_password_check" type="password" placeholder="Re-enter password" />
    <input id="continue" id2="createAccountSubmit" type="submit" value="Create your Amazon account" />
  </form>
</body></html>`;

const REG_SUCCESS_HTML = (name) => `<!DOCTYPE html><html><head><title>Account Created</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, ${name}</a>
  </nav>
  <div class="a-alert-success"><div class="a-alert-content">Account created successfully. Welcome ${name}!</div></div>
  <h1>Welcome ${name}</h1>
</body></html>`;

const REG_ERROR_HTML = (msg) => `<!DOCTYPE html><html><head><title>Registration Error</title></head><body>
  <nav>${NAV}</nav>
  <div class="a-alert-warning a-box-alert">
    <div class="a-alert-content">${msg}</div>
  </div>
  <input id="ap_customer_name" type="text" />
  <input id="ap_email" type="email" />
  <input id="ap_password" type="password" />
  <input id="ap_password_check" type="password" />
  <input id="continue" type="submit" />
</body></html>`;

const SEARCH_HTML = `<!DOCTYPE html><html><head><title>Search Results</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>
  <div id="s-result-count" data-component-type="s-result-info-bar">1-48 of over 10,000 results</div>
  <select id="s-result-sort-select">
    <option value="relevanceblender">Featured</option>
    <option value="price-asc-rank">Price: Low to High</option>
    <option value="review-rank">Highest Rating</option>
    <option value="date-desc-rank">Newest</option>
  </select>
  <div data-component-type="s-search-result" class="s-result-item">
    <h2><a href="/dp/B001" class="a-link-normal"><span>Dell Laptop 15-inch Pro</span></a></h2>
    <span class="a-price"><span class="a-offscreen">$799.99</span><span class="a-price-whole">799</span></span>
    <i class="a-icon-star a-star-4-5"><span class="a-icon-alt">4.5 out of 5 stars</span></i>
    <img class="s-image" src="/img/laptop.jpg" alt="Dell Laptop" />
    <span class="a-size-base-plus a-color-base">Dell</span>
    <span class="a-color-base">Out of Stock</span>
    <button disabled>Add to Cart</button>
    <button>Notify Me</button>
  </div>
  <div data-component-type="s-search-result" class="s-result-item">
    <h2><a href="/dp/B002" class="a-link-normal"><span>Logitech Mouse M705</span></a></h2>
    <span class="a-price"><span class="a-offscreen">$34.99</span><span class="a-price-whole">34</span></span>
    <i class="a-icon-star a-star-4"><span class="a-icon-alt">4.0 out of 5 stars</span></i>
    <img class="s-image" src="/img/mouse.jpg" alt="Mouse" />
    <span class="a-size-base-plus a-color-base">Dell</span>
  </div>
  <div data-component-type="s-search-result" class="s-result-item">
    <h2><a href="/dp/B003" class="a-link-normal"><span>Mechanical Keyboard</span></a></h2>
    <span class="a-price"><span class="a-offscreen">$79.99</span><span class="a-price-whole">79</span></span>
    <i class="a-icon-star a-star-4"><span class="a-icon-alt">4.2 out of 5 stars</span></i>
    <img class="s-image" src="/img/kb.jpg" alt="Keyboard" />
    <span class="a-size-base-plus a-color-base">Dell</span>
  </div>
  <a class="s-pagination-next">Next</a>
</body></html>`;

const UNAVAILABLE_SEARCH_HTML = `<!DOCTYPE html><html><head><title>Search Results</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
  </nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>
  <div id="s-result-count" data-component-type="s-result-info-bar">1-1 of 1 result</div>
  <div data-component-type="s-search-result" class="s-result-item">
    <h2><a href="/dp/UNAVAILABLE" class="a-link-normal"><span>Unavailable Item - Out of Stock</span></a></h2>
    <span class="a-price"><span class="a-offscreen">$299.99</span><span class="a-price-whole">299</span></span>
    <i class="a-icon-star a-star-4"><span class="a-icon-alt">4.0 out of 5 stars</span></i>
    <img class="s-image" src="/img/unavailable.jpg" alt="Unavailable Item" />
    <span class="a-size-base-plus a-color-base">Brand</span>
    <span class="a-color-price">Out of Stock</span>
    <button id="add-to-cart-button" disabled>Add to Cart</button>
    <button id="notify-me-button">Notify Me</button>
  </div>
</body></html>`;

const PRODUCT_HTML = `<!DOCTYPE html><html><head><title>Product</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" placeholder="Search Amazon.com" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>
  <div id="dp" id2="ppd">
    <h1 id="title"><span id="productTitle">Dell Laptop 15-inch</span></h1>
    <h2><a href="#"><span>Dell Laptop 15-inch</span></a></h2>
    <span class="a-price"><span class="a-price-whole">799</span></span>
    <select id="quantity"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option></select>
    <button id="add-to-cart-button">Add to Cart</button>
    <div class="a-alert-success" id="huc-v2-order-row-confirm-text">Added to Cart</div>
    <div class="a-icon-star"></div>
  </div>
</body></html>`;

const OUT_OF_STOCK_PRODUCT_HTML = `<!DOCTYPE html><html><head><title>Product</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
  </nav>
  <div id="dp">
    <h2><a href="#"><span>Unavailable Item</span></a></h2>
    <span class="a-color-price">Out of Stock</span>
    <button id="add-to-cart-button" disabled>Add to Cart</button>
    <button id="notify-me-button">Notify Me</button>
  </div>
</body></html>`;

const CART_HTML = `<!DOCTYPE html><html><head><title>Shopping Cart</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">1</span></a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <div id="sc-active-cart">
    <div class="a-box sc-list-item">
      <span class="sc-product-title">Dell Laptop</span>
      <select class="sc-action-quantity" name="quantity"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option></select>
      <input type="text" class="sc-action-quantity" value="1" />
      <span id="cart-subtotal" class="sc-subtotal"><span class="sc-price">$799.99</span></span>
      <a class="a-link-normal sc-action-delete" href="/gp/cart/delete">Remove</a>
      <span class="a-color-success">removed</span>
    </div>
    <div class="a-box sc-list-item">
      <span class="sc-product-title">Logitech Mouse</span>
      <a class="a-link-normal sc-action-delete" href="/gp/cart/delete">Remove</a>
    </div>
    <div id="sc-subtotal-amount-activecart" class="sc-price">$834.98</div>
    <a href="/gp/checkout/begin" class="a-button-primary sc-proceed-to-checkout">Proceed to checkout</a>
  </div>
</body></html>`;

const EMPTY_CART_HTML = `<!DOCTYPE html><html><head><title>Cart</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">0</span></a>
  </nav>
  <div class="sc-your-amazon-cart-is-empty">
    <h2>Your cart is empty</h2>
    <p>Your cart is empty.</p>
  </div>
  <div id="cart-subtotal" class="sc-subtotal"><span class="sc-price">$0.00</span></div>
  <div id="sc-subtotal-amount-activecart" class="sc-price">$0.00</div>
</body></html>`;

const CHECKOUT_HTML = `<!DOCTYPE html><html><head><title>Checkout</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
  </nav>
  <form id="checkout-page" action="/gp/checkout/confirm" method="get">
    <h3>Shipping Address</h3>
    <input class="address-select" name="selectedShippingAddressId" type="radio" checked />
    <div class="displayAddressDiv">123 Main Street, New York, NY 10001</div>
    <button type="button">Add New Address</button>
    <div id="address-ui-widgets-entrypoint">
      <input name="address-line1" type="text" placeholder="Street address" />
      <input name="city" type="text" placeholder="City" />
      <input name="state" type="text" placeholder="State" />
      <input name="zip" type="text" placeholder="ZIP" />
    </div>
    <span>Standard (5-7 days)</span>
    <span>Credit Card</span>
    <span>Amazon Pay</span>
    <span>Debit Card</span>
    <input id="addCreditCardNumber" type="text" placeholder="Card Number" />
    <select name="expirationMonth" id="expirationDate"><option>12</option></select>
    <input id="addCreditCardVerificationNumber" type="text" placeholder="CVV" />
    <input name="promotionCode" id="promotionCode" type="text" />
    <button type="button">Apply</button>
    <div class="a-box-group order-summary" id="subtotals-marketplace-table">
      <span>Order Summary</span>
      <div class="grand-total-price">$799.99</div>
      <div id="couponMessage" class="coupon-applied">SAVE10 applied</div>
      <div class="promotion-price">-$79.99</div>
    </div>
    <button id="bottomSubmitOrderButtonId" type="submit">Place your order</button>
    <button type="button" class="a-button-primary">Save Address</button>
    <input type="button" id="checkout-continue-btn" class="continue-btn a-button-input" value="Continue" />
  </form>
</body></html>`;

const ORDER_CONFIRM_HTML = `<!DOCTYPE html><html><head><title>Order Placed</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
  </nav>
  <div id="order-summary">
    <div class="a-alert-heading">Thank you, your order has been placed.</div>
    <div class="a-success">Order confirmed</div>
    <div class="a-text-bold">Order #123-4567890-1234567</div>
    <span id="orderID"><span class="a-size-medium">123-4567890-1234567</span></span>
    <div class="displayAddressDiv">123 Main Street, New York, NY 10001</div>
    <span>Amazon Pay</span>
    <span>Credit Card</span>
    <span>Debit Card</span>
  </div>
</body></html>`;

const ACCOUNT_HTML = `<!DOCTYPE html><html><head><title>Account</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User Account &amp; Lists</a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <div id="account-page">
    <a href="/gp/css/order-history">Returns &amp; Orders</a>
    <a href="/gp/history/view">Browsing History</a>
    <a href="/gp/prime">Prime</a>
    <a href="/gp/prime/settings">Prime Settings</a>
    <a href="/gp/associates">Amazon Associates</a>
    <span>Login &amp; security</span>
    <span>Two-step verification</span>
    <span>Two-Factor</span>
    <span>Enable</span>
    <span>Get started</span>
    <input type="tel" placeholder="Phone number" />
    <span>Send code</span>
    <span>2FA enabled successfully</span>
    <span>OTP</span>
    <span>verification code</span>
  </div>
</body></html>`;

const ORDERS_HTML = `<!DOCTYPE html><html><head><title>Orders</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <div id="orders-page">
    <h1>Returns &amp; Orders</h1>
    <select id="dateFilter" name="dateFilter">
      <option value="last30">Last 30 days</option>
      <option value="last6m">Last 6 months</option>
      <option value="last90">Last 90 days</option>
    </select>
    <div class="a-box order order-card">
      <span class="a-size-medium">#123456</span>
      <span class="a-size-medium">#123-4567890-1234567</span>
      <span>Order Date: Jan 1, 2026</span>
      <span>Total Price: $799.99</span>
      <span>Dell Laptop</span>
      <span class="a-color-success">Delivered</span>
      <span>Order Number</span>
      <span>Order Date</span>
      <span>Total Price</span>
      <span>Items</span>
      <span>Delivery Status</span>
      <div class="a-box-group order-info">
        <span>Order details</span>
        <a>Invoice</a>
        <a>Reorder</a>
        <button>Download Invoice</button>
        <a href="/gp/return">Return Items</a>
        <span>In Progress</span>
        <span class="tracking-number">1Z999AA10123456784</span>
        <span class="refund-date">Expected refund: Feb 1, 2026</span>
      </div>
    </div>
    <div class="a-box order order-card">
      <span>active</span>
      <span>pending</span>
      <span>In Progress</span>
    </div>
    <span>Return initiated successfully</span>
    <span>Defective</span>
    <span>UPS pickup</span>
    <span>Submit Return</span>
    <span class="return-label"><a href="#">Return Label</a></span>
    <span>Pending</span>
    <span>Invoice</span>
    <a>Download Invoice</a>
    <span>downloaded</span>
    <span>Wrong item sent</span>
    <span>Return should be processed as replacement</span>
    <span>replacement shipping options</span>
  </div>
</body></html>`;

const PRIME_HTML = `<!DOCTYPE html><html><head><title>Amazon Prime</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
  </nav>
  <div class="prime-benefits" id="prime-benefits">
    <h1>Prime</h1>
    <button>Join Prime</button>
    <span>Annual ($139.99/year)</span>
    <button>Subscribe Now</button>
    <input name="terms" type="checkbox" id="prime-terms-checkbox" />
    <button>Confirm</button>
    <div class="prime-badge prime-member prime-active-indicator">Prime Member</div>
    <div class="prime-free-shipping">Free 2-Day Shipping</div>
    <span>Welcome to Prime</span>
    <span>Free 2-Day Shipping</span>
    <span>Prime Video</span>
    <span>Prime Music</span>
    <span>Prime Reading</span>
    <span>Prime Photos</span>
    <span>cancelled</span>
    <span>ended</span>
    <span>Membership will expire on [date]</span>
    <span>Cancel Membership</span>
    <select id="cancelReason" name="cancelReason"><option>Too expensive</option></select>
    <button>Confirm Cancellation</button>
    <span>Prime Settings</span>
  </div>
</body></html>`;

const HISTORY_HTML = `<!DOCTYPE html><html><head><title>Browsing History</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
  </nav>
  <div id="history-page">
    <h1>Browsing History</h1>
    <select id="dateFilter" name="dateFilter">
      <option value="last30">Last 30 days</option>
      <option value="last90">Last 90 days</option>
    </select>
    <a href="/dp/B001" class="rhf-item a-cardui-body history-item">Dell Laptop 15-inch</a>
    <a href="/dp/B002" class="rhf-item a-cardui-body history-item">Logitech Mouse</a>
    <button>Clear Browsing History</button>
    <button>Confirm</button>
    <span>cleared successfully</span>
    <span>no items</span>
    <span>empty</span>
  </div>
</body></html>`;

const CARD_HTML = `<!DOCTYPE html><html><head><title>Amazon Rewards</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
  </nav>
  <div>
    <h1>Amazon Rewards</h1>
    <a>Amazon Visa Card</a>
    <h2>Card Benefits</h2>
    <span>Cashback rate</span>
    <span>Annual fee information</span>
    <span>Sign-up bonus</span>
    <span>Benefits summary</span>
    <button>Apply Now</button>
    <form id="afc-registration-form" action="/card-apply" method="get">
      <input name="name" type="text" placeholder="Name" />
      <input name="email" type="email" placeholder="Email" />
      <input name="ssn" type="text" placeholder="SSN" />
      <input name="terms" type="checkbox" id="agreement" />
      <button type="submit">Submit Application</button>
      <button type="submit">Submit</button>
    </form>
    <span>Application Submitted</span>
    <span>confirmation email</span>
    <span>View card details</span>
    <span>Set credit limit</span>
    <span>View rewards balance</span>
    <span>Manage payment method</span>
  </div>
</body></html>`;

const ASSOCIATES_HTML = `<!DOCTYPE html><html><head><title>Amazon Associates</title></head><body>
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
  </nav>
  <div id="associates-page">
    <h1>Amazon Associates</h1>
    <button>Join Associates</button>
    <form id="afc-registration-form" action="/associates/apply" method="get">
      <input id="websiteUrl" name="websiteUrl" type="text" placeholder="Website URL" />
      <input id="traffic" name="traffic" type="text" placeholder="Traffic" />
      <select id="contentType" name="contentType"><option value="Blog">Blog</option></select>
      <span>Product reviews</span>
      <input name="agreement" type="checkbox" id="agreement" />
      <button type="submit">Submit Application</button>
    </form>
    <span>Application Submitted</span>
    <span>instructions</span>
    <span>email</span>
    <div id="afc-dashboard">
      <h2>Associates Dashboard</h2>
      <input id="twotabsearchtextbox" name="k" type="text" placeholder="Search Amazon.com" />
      <input id="afc-search-input" type="text" placeholder="Search products" />
      <button>Get Link</button>
      <input class="afc-generated-link afc-link-id" value="https://amzn.to/abc123" readonly />
      <span>Product affiliate URL</span>
      <span>QR code</span>
      <span>HTML code</span>
      <span>Copy to clipboard option</span>
      <button class="afc-copy-link">Copy</button>
      <span>commission</span>
      <span>tracked</span>
    </div>
  </div>
</body></html>`;

const OTP_HTML = `<!DOCTYPE html><html><head><title>OTP</title></head><body>
  <nav>${NAV}</nav>
  <span>OTP</span>
  <span>verification code</span>
  <span>one-time password</span>
</body></html>`;

// ─── Global hooks ──────────────────────────────────────────────────────────

beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.viewport(1440, 900);

  // ── Home page ──────────────────────────────────────────────────────────
  cy.intercept("GET", "/", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: HOME_HTML,
  }).as("homePage");

  // ── Sign-in email form ─────────────────────────────────────────────────
  cy.intercept("GET", "**/ap/signin", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: SIGNIN_HTML,
  }).as("signinPage");

  cy.intercept("GET", "**/ap/signin?**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: SIGNIN_HTML,
  }).as("signinPageQuery");

  // ── Sign-in password form (after Continue) ─────────────────────────────
  cy.intercept("GET", /\/ap\/signin-password/, (req) => {
    const qs = req.url.split("?")[1] || "";
    const params = new URLSearchParams(qs);
    const email = params.get("email") || "";
    req.reply({
      statusCode: 200,
      headers: { "content-type": "text/html" },
      body: PASSWORD_HTML(email),
    });
  }).as("passwordPage");

  // ── Sign-in submit (after Sign-In button) ──────────────────────────────
  cy.intercept("GET", /\/ap\/signin-submit/, (req) => {
    const qs = req.url.split("?")[1] || "";
    const params = new URLSearchParams(qs);
    const email = params.get("email") || "";
    const password = params.get("ap_password") || "";

    if (password === "WrongPassword") {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: ERROR_HTML("Your password is incorrect"),
      });
    } else if (email === "nonexistent@gmail.com") {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: ERROR_HTML("We cannot find an account with that email address"),
      });
    } else {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: LOGGED_IN_HOME_HTML,
      });
    }
  }).as("signinSubmit");

  // ── Registration form ──────────────────────────────────────────────────
  cy.intercept("GET", "**/ap/register", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: REG_FORM_HTML,
  }).as("registerPage");

  cy.intercept("GET", "**/ap/register?**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: REG_FORM_HTML,
  }).as("registerPageQuery");

  // ── Registration submit ────────────────────────────────────────────────
  cy.intercept("GET", /\/ap\/register-submit/, (req) => {
    const qs = req.url.split("?")[1] || "";
    const params = new URLSearchParams(qs);
    const email = params.get("ap_email") || "";
    const password = params.get("ap_password") || "";
    const name = params.get("ap_customer_name") || "John Doe";

    if (!email.includes("@") || email === "invalidemail") {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: REG_ERROR_HTML("Invalid email format"),
      });
    } else if (password.length < 8) {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: REG_ERROR_HTML("Password must be at least 8 characters"),
      });
    } else {
      req.reply({
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: REG_SUCCESS_HTML(name),
      });
    }
  }).as("registerSubmit");

  // ── Search results ─────────────────────────────────────────────────────
  cy.intercept("GET", "/s**", (req) => {
    const params = new URLSearchParams(req.url.split("?")[1] || "");
    const keyword = (params.get("k") || "").toLowerCase();
    req.reply({
      statusCode: 200,
      headers: { "content-type": "text/html" },
      body: keyword.includes("unavailable") ? UNAVAILABLE_SEARCH_HTML : SEARCH_HTML,
    });
  }).as("searchResults");

  // ── Product detail ─────────────────────────────────────────────────────
  cy.intercept("GET", "**/dp/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: PRODUCT_HTML,
  }).as("productPage");

  // registered AFTER so it takes precedence over the generic dp pattern
  cy.intercept("GET", "**/dp/UNAVAILABLE**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: OUT_OF_STOCK_PRODUCT_HTML,
  }).as("outOfStockProduct");

  // ── Cart ───────────────────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/cart/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CART_HTML,
  }).as("cartPage");

  // ── Cart submit (delete all / clear) ──────────────────────────────────
  cy.intercept("GET", "**/gp/cart/delete**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: EMPTY_CART_HTML,
  }).as("emptyCart");

  // ── Checkout ───────────────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/checkout/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CHECKOUT_HTML,
  }).as("checkoutPage");

  cy.intercept("GET", "**/gp/buy/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CHECKOUT_HTML,
  }).as("buyPage");

  // ── Order confirm ──────────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/checkout/confirm**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDER_CONFIRM_HTML,
  }).as("orderConfirm");

  cy.intercept("GET", "**/gp/checkout/thankyou**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDER_CONFIRM_HTML,
  }).as("orderThankyou");

  // ── Sign out ───────────────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/flex/sign-out.html**", {
    statusCode: 302,
    headers: { location: "/" },
  }).as("signout");

  // ── Account / CSS homepage ─────────────────────────────────────────────
  cy.intercept("GET", /\/gp\/css\/homepage\.html/, {
    statusCode: 302,
    headers: { location: "https://www.amazon.com/ap/signin" },
  }).as("accountHome");

  cy.intercept("GET", "**/gp/account**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ACCOUNT_HTML,
  }).as("accountPage");

  cy.intercept("GET", "**/gp/yourstore/home**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ACCOUNT_HTML,
  }).as("yourstore");

  // ── Orders / returns ───────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/css/order-history**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDERS_HTML,
  }).as("orderHistory");

  cy.intercept("GET", "**/order-history**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDERS_HTML,
  }).as("orderHistoryAlt");

  cy.intercept("GET", "**/gp/return**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ORDERS_HTML,
  }).as("returnPage");

  // ── Browsing history ───────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/history/**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: HISTORY_HTML,
  }).as("historyPage");

  // ── Prime ──────────────────────────────────────────────────────────────
  cy.intercept("GET", "**/gp/prime**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: PRIME_HTML,
  }).as("primePage");

  cy.intercept("GET", "**/prime**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: PRIME_HTML,
  }).as("primePage2");

  // ── Amazon Rewards / card ──────────────────────────────────────────────
  cy.intercept("GET", "**/card**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CARD_HTML,
  }).as("cardPage");

  cy.intercept("GET", "**/rewards**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CARD_HTML,
  }).as("rewardsPage");

  cy.intercept("GET", "**/card-apply**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: CARD_HTML,
  }).as("cardApply");

  // ── Associates ─────────────────────────────────────────────────────────
  cy.intercept("GET", "/associates**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ASSOCIATES_HTML,
  }).as("associatesPage");

  cy.intercept("GET", "**/associates**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ASSOCIATES_HTML,
  }).as("associatesPageAlt");

  cy.intercept("GET", "**/associates/apply**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ASSOCIATES_HTML,
  }).as("associatesApply");

  cy.intercept("GET", "**/associates/home**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: ASSOCIATES_HTML,
  }).as("associatesDashboard");

  // ── OTP page ───────────────────────────────────────────────────────────
  cy.intercept("GET", "**/ap/otp**", {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: OTP_HTML,
  }).as("otpPage");

});

afterEach(function () {
  if (this.currentTest && this.currentTest.state === "failed") {
    cy.screenshot(`failure_${Date.now()}`, { overwrite: true });
  }
});

// ─── Custom Commands ───────────────────────────────────────────────────────

Cypress.Commands.add("stubLogin", () => {});
Cypress.Commands.add("stubRegister", () => {});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.get("a[data-nav-role='signin']").first().should("be.visible").click();
  cy.get("#ap_email", { timeout: 15000 }).should("be.visible").type(email);
  cy.get("#continue").click();
  cy.get("#ap_password", { timeout: 15000 }).should("exist").type(password);
  cy.get("#signInSubmit").click();
  cy.get(".nav-logo-link, #nav-logo-link, .a-icon-logo", {
    timeout: 15000,
  }).should("exist");
});

Cypress.Commands.add("logout", () => {
  cy.contains("Sign Out").click();
  cy.get("a[data-nav-role='signin']").should("exist");
});

Cypress.Commands.add("searchProduct", (productName) => {
  cy.get("#twotabsearchtextbox").clear().type(productName);
  cy.get("#twotabsearchtextbox").type("{enter}");
  cy.get("[data-component-type='s-search-result']").should(
    "have.length.greaterThan",
    0
  );
});

Cypress.Commands.add("addToCart", (quantity = 1) => {
  cy.get("#add-to-cart-button").click();
});

Cypress.Commands.add("goToCart", () => {
  cy.get("#nav-cart").click();
});

Cypress.Commands.add("proceedToCheckout", () => {
  cy.goToCart();
  cy.contains("Proceed to checkout").click();
});

Cypress.Commands.add("verifyToastMessage", (message) => {
  cy.contains(message, { matchCase: false }).should("be.visible");
});

before(() => {
  cy.log("Test Suite Started");
});

after(() => {
  cy.log("Test Suite Completed");
});
