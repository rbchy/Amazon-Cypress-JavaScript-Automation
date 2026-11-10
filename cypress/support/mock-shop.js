// cypress/support/mock-shop.js
// ─────────────────────────────────────────────────────────────────────────────
// A small, STATEFUL stand-in for the Amazon shopping pages (search, product,
// cart, checkout, order confirmation). The real amazon.com cannot be automated
// reliably (bot detection, CAPTCHAs, changing markup), so every page is served
// by cy.intercept — but unlike a static stub, this mock reacts to what the test
// does: filters and sorting really filter and sort, the cart really holds items
// and quantities, coupons really change the total. That way the step
// definitions can make assertions that FAIL when the behaviour is wrong.
//
// State lives on the shared Cypress object so the support bundle and the spec
// bundle (compiled separately by esbuild) see the same cart.
// ─────────────────────────────────────────────────────────────────────────────

export const CATALOG = [
  { asin: "B001", title: "Dell Laptop 15-inch Inspiron 3530", brand: "Dell", price: 799.99, rating: 4.5, released: "2026-03-01", tags: "laptop computer notebook" },
  { asin: "B004", title: "Dell XPS 13 Laptop", brand: "Dell", price: 999.0, rating: 4.7, released: "2026-05-10", tags: "laptop computer ultrabook" },
  { asin: "B005", title: "HP Pavilion 15 Laptop", brand: "HP", price: 649.99, rating: 4.3, released: "2026-01-15", tags: "laptop computer notebook" },
  { asin: "B006", title: "Lenovo IdeaPad 3 Laptop", brand: "Lenovo", price: 429.99, rating: 3.9, released: "2025-11-20", tags: "laptop computer notebook" },
  { asin: "B007", title: "Dell Latitude 7440 Laptop", brand: "Dell", price: 1249.0, rating: 4.6, released: "2026-02-01", tags: "laptop computer business" },
  { asin: "B008", title: "Dell Vostro 3520 Laptop", brand: "Dell", price: 549.0, rating: 3.8, released: "2025-09-01", tags: "laptop computer budget" },
  { asin: "B002", title: "Logitech M705 Wireless Mouse", brand: "Logitech", price: 34.99, rating: 4.6, released: "2025-06-01", tags: "mouse wireless" },
  { asin: "B009", title: "Dell MS116 Wired Mouse", brand: "Dell", price: 9.99, rating: 4.4, released: "2024-08-01", tags: "mouse wired" },
  { asin: "B003", title: "Keychron K2 Mechanical Keyboard", brand: "Keychron", price: 79.99, rating: 4.2, released: "2025-04-01", tags: "keyboard mechanical" },
  { asin: "B010", title: "Sony WH-1000XM5 Headphones", brand: "Sony", price: 399.99, rating: 4.6, released: "2026-04-01", tags: "headphones wireless noise cancelling" },
  { asin: "B011", title: "Bose QuietComfort 45 Headphones", brand: "Bose", price: 279.0, rating: 4.5, released: "2025-10-01", tags: "headphones wireless noise cancelling" },
  { asin: "B012", title: "Anker Soundcore Q20 Headphones", brand: "Anker", price: 49.99, rating: 4.4, released: "2026-06-01", tags: "headphones wireless budget" },
  { asin: "B013", title: "JBL Tune 510BT Headphones", brand: "JBL", price: 29.95, rating: 4.3, released: "2025-03-01", tags: "headphones wireless budget" },
  { asin: "UNAVAILABLE", title: "Unavailable Item - Out of Stock", brand: "Brand", price: 299.99, rating: 4.0, released: "2025-01-01", tags: "unavailable-item", outOfStock: true },
];

export const DEFAULT_ADDRESS = "742 Evergreen Terrace, Springfield, IL 62704";
export const COUPONS = { SAVE10: 0.1 };
export const SHIPPING = { "Standard (5-7 days)": 0, "Two-Day": 9.99, "One-Day": 14.99 };

const round2 = (n) => Math.round(n * 100) / 100;
export const money = (n) =>
  "$" + round2(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ─── State API (shared with step definitions through Cypress.mockShop) ───────

export function createShop() {
  const shop = {
    cart: [], // { asin, qty }
    lastRemoved: null,
    orderSeq: 0,
    product: (asin) => CATALOG.find((p) => p.asin === asin),
    add(asin, qty = 1) {
      const p = shop.product(asin);
      if (!p || p.outOfStock) return false;
      const line = shop.cart.find((l) => l.asin === asin);
      if (line) line.qty += 1;
      else shop.cart.push({ asin, qty: 1 }); // MUTATION: quantity ignored
      return true;
    },
    setQty(asin, qty) {
      const line = shop.cart.find((l) => l.asin === asin);
      if (!line) return;
      if (qty <= 0) shop.remove(asin);
      else line.qty = qty;
    },
    remove(asin) {
      const p = shop.product(asin);
      shop.cart = shop.cart.filter((l) => l.asin !== asin);
      shop.lastRemoved = p ? p.title : null;
    },
    clear() {
      shop.cart = [];
    },
    count: () => shop.cart.reduce((n, l) => n + l.qty, 0),
    lines: () => shop.cart.length,
    subtotal: () => round2(shop.cart.reduce((s, l) => s + shop.product(l.asin).price * l.qty, 0)),
  };
  return shop;
}

export function resetShop() {
  Cypress.mockShop = createShop();
  return Cypress.mockShop;
}

const shop = () => Cypress.mockShop || resetShop();

// ─── Search logic (pure, unit-testable) ──────────────────────────────────────

export function searchCatalog(keyword, opts = {}) {
  const tokens = String(keyword || "").toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  const haystack = (p) => `${p.title} ${p.brand} ${p.tags}`.toLowerCase();
  let hits = CATALOG.filter((p) => tokens.length && tokens.every((t) => haystack(p).includes(t)));
  if (!hits.length) {
    // fall back to "any word" matches, ranked by how many words match
    hits = CATALOG.map((p) => ({ p, n: tokens.filter((t) => haystack(p).includes(t)).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .map((x) => x.p);
  }
  if (opts.low != null) hits = hits.filter((p) => p.price >= opts.low);
  if (opts.high != null) hits = hits.filter((p) => p.price <= opts.high);
  if (opts.brand) hits = hits.filter((p) => p.brand.toLowerCase() === opts.brand.toLowerCase());
  if (opts.minRating != null) hits = hits.filter((p) => p.rating >= opts.minRating);
  const sorted = [...hits];
  // MUTATION: price sort removed
  if (opts.sort === "price-desc-rank") sorted.sort((a, b) => b.price - a.price);
  if (opts.sort === "review-rank") sorted.sort((a, b) => b.rating - a.rating);
  if (opts.sort === "date-desc-rank") sorted.sort((a, b) => b.released.localeCompare(a.released));
  return sorted;
}

/** "Price: $500-$1000" → { low: 500, high: 1000 }; "Price: $1000 & above" → { low: 1000 } */
export function parsePriceFilter(label) {
  const nums = (label.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => Number(n.replace(/,/g, "")));
  if (/under/i.test(label)) return { high: nums[0] };
  if (/above|over|\+/i.test(label)) return { low: nums[0] };
  return { low: nums[0], high: nums[1] };
}

// ─── HTML rendering ──────────────────────────────────────────────────────────

const html = (title, body) =>
  `<!DOCTYPE html><html><head><title>${esc(title)}</title></head><body>${body}</body></html>`;

const nav = () => `
  <nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin" id="nav-link-accountList">Hello, Test User Account &amp; Lists</a>
    <a id="nav-cart" href="/gp/cart/view.html"><span id="nav-cart-count">${shop().count()}</span> Cart</a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>
  <form action="/s" method="get">
    <input id="twotabsearchtextbox" name="k" type="text" placeholder="Search Amazon.com" />
    <button id="nav-search-submit-button" type="submit">Go</button>
  </form>`;

const stars = (r) => `<i class="a-icon-star"><span class="a-icon-alt">${r.toFixed(1)} out of 5 stars</span></i>`;

function resultItem(p) {
  return `
  <div data-component-type="s-search-result" class="s-result-item" data-asin="${p.asin}"
       data-price="${p.price}" data-rating="${p.rating}" data-brand="${esc(p.brand)}" data-released="${p.released}">
    <h2><a href="/dp/${p.asin}" class="a-link-normal"><span>${esc(p.title)}</span></a></h2>
    <span class="a-price"><span class="a-offscreen">${money(p.price)}</span><span class="a-price-whole">${Math.floor(p.price)}</span></span>
    ${stars(p.rating)}
    <img class="s-image" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="120" height="120" alt="${esc(p.title)}" />
    <span class="a-size-base-plus a-color-base">${esc(p.brand)}</span>
    <span class="s-release-date">Released ${p.released}</span>
    ${p.outOfStock ? '<span class="a-color-price">Out of Stock</span>' : ""}
  </div>`;
}

export function renderSearch(url) {
  const u = new URL(url);
  const q = u.searchParams;
  const keyword = q.get("k") || "";
  const opts = {
    low: q.has("low-price") ? Number(q.get("low-price")) : null,
    high: q.has("high-price") ? Number(q.get("high-price")) : null,
    brand: q.get("brand") || null,
    minRating: q.has("min-rating") ? Number(q.get("min-rating")) : null,
    sort: q.get("s") || "relevanceblender",
  };
  const results = searchCatalog(keyword, opts);
  const unfiltered = searchCatalog(keyword, {});
  const link = (changes) => {
    const v = new URL(u.toString());
    Object.entries(changes).forEach(([k, val]) => (val == null ? v.searchParams.delete(k) : v.searchParams.set(k, val)));
    return v.pathname + v.search;
  };
  const brands = [...new Set(unfiltered.map((p) => p.brand))].sort();
  const refinements = `
  <div id="s-refinements">
    <h3>Price</h3>
    <a href="${link({ "low-price": null, "high-price": 100 })}">Price: Under $100</a>
    <a href="${link({ "low-price": 100, "high-price": 500 })}">Price: $100-$500</a>
    <a href="${link({ "low-price": 500, "high-price": 1000 })}">Price: $500-$1000</a>
    <a href="${link({ "low-price": 1000, "high-price": null })}">Price: $1000 &amp; above</a>
    <h3>Brand</h3>
    ${brands.map((b) => `<a href="${link({ brand: b })}">Brand: ${esc(b)}</a>`).join("\n    ")}
    <h3>Customer Reviews</h3>
    <a href="${link({ "min-rating": 4 })}">Rating: 4+ stars</a>
    <a href="${link({ "min-rating": 3 })}">Rating: 3+ stars</a>
  </div>`;
  const options = [
    ["relevanceblender", "Featured"],
    ["price-asc-rank", "Price: Low to High"],
    ["price-desc-rank", "Price: High to Low"],
    ["review-rank", "Highest Rating"],
    ["date-desc-rank", "Newest"],
  ]
    .map(([v, l]) => `<option value="${v}"${v === opts.sort ? " selected" : ""}>${l}</option>`)
    .join("");
  return html(
    `Amazon.com : ${keyword}`,
    `${nav()}
  <div id="s-result-count" data-component-type="s-result-info-bar">${results.length ? `1-${results.length} of ${results.length}` : "No"} results for "${esc(keyword)}"</div>
  <select id="s-result-sort-select" name="s">${options}</select>
  ${refinements}
  <div class="s-main-slot">${results.map(resultItem).join("")}</div>
  <a class="s-pagination-next">Next</a>
  <script>
    document.getElementById("s-result-sort-select").addEventListener("change", function (e) {
      var u = new URL(location.href); u.searchParams.set("s", e.target.value); location.href = u.toString();
    });
  </script>`
  );
}

export function renderProduct(asin, { added = 0 } = {}) {
  const p = shop().product(asin);
  if (!p) return html("Page Not Found", `${nav()}<h1>Sorry! We couldn't find that page.</h1>`);
  const qtyOptions = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("");
  const buy = p.outOfStock
    ? `<span class="a-color-price">Out of Stock</span>
       <button id="add-to-cart-button" disabled>Add to Cart</button>
       <button id="notify-me-button">Notify Me</button>`
    : `<form id="addToCart" action="/gp/cart/add" method="get">
         <input type="hidden" name="asin" value="${p.asin}" />
         <label for="quantity">Qty:</label>
         <select id="quantity" name="quantity">${qtyOptions}</select>
         <button id="add-to-cart-button" type="submit">Add to Cart</button>
       </form>`;
  const confirm = added
    ? `<div class="a-alert-success" id="huc-v2-order-row-confirm-text">Added to Cart</div>
       <div id="sw-subtotal">Cart subtotal (${shop().count()} items): ${money(shop().subtotal())}</div>`
    : "";
  return html(
    p.title,
    `${nav()}
  <div id="dp">
    ${confirm}
    <h1 id="title"><span id="productTitle">${esc(p.title)}</span></h1>
    <span id="bylineInfo">Brand: ${esc(p.brand)}</span>
    <span class="a-price" data-price="${p.price}"><span class="a-offscreen">${money(p.price)}</span><span class="a-price-whole">${Math.floor(p.price)}</span></span>
    ${stars(p.rating)}
    ${buy}
  </div>`
  );
}

export function renderCart({ message = "" } = {}) {
  const s = shop();
  if (!s.cart.length) {
    return html(
      "Amazon.com Shopping Cart",
      `${nav()}
  ${message ? `<div class="a-alert-success sc-removed-message">${esc(message)}</div>` : ""}
  <div class="sc-your-amazon-cart-is-empty"><h2>Your cart is empty</h2></div>
  <div id="cart-subtotal" class="sc-subtotal">Subtotal (0 items): <span class="sc-price">$0.00</span></div>
  <div id="sc-subtotal-amount-activecart" class="sc-price" data-total="0">$0.00</div>`
    );
  }
  const rows = s.cart
    .map((l) => {
      const p = s.product(l.asin);
      const opts = Array.from({ length: 10 }, (_, i) => i + 1)
        .map((n) => `<option value="${n}"${n === l.qty ? " selected" : ""}>${n}</option>`)
        .join("");
      return `
    <div class="a-box sc-list-item" data-asin="${p.asin}" data-price="${p.price}" data-quantity="${l.qty}">
      <span class="sc-product-title">${esc(p.title)}</span>
      <span class="sc-product-price">${money(p.price)}</span>
      <form class="sc-update-form" action="/gp/cart/update" method="get">
        <input type="hidden" name="asin" value="${p.asin}" />
        <select class="sc-action-quantity" name="quantity">${opts}</select>
        <input class="a-button-input" type="submit" name="update" value="Update" />
      </form>
      <span class="sc-line-subtotal" data-line-total="${round2(p.price * l.qty)}">${money(p.price * l.qty)}</span>
      <a class="a-link-normal sc-action-delete" href="/gp/cart/delete?asin=${p.asin}">Remove</a>
    </div>`;
    })
    .join("");
  return html(
    "Amazon.com Shopping Cart",
    `${nav()}
  ${message ? `<div class="a-alert-success sc-removed-message">${esc(message)}</div>` : ""}
  <div id="sc-active-cart">
    <h1>Shopping Cart</h1>
    <a class="sc-delete-all" href="/gp/cart/delete-all">Delete all items</a>
    ${rows}
    <div id="cart-subtotal" class="sc-subtotal">Subtotal (${s.count()} items): <span class="sc-price">${money(s.subtotal())}</span></div>
    <div id="sc-subtotal-amount-activecart" class="sc-price" data-total="${s.subtotal()}">${money(s.subtotal())}</div>
    <a href="/gp/checkout/begin" class="a-button-primary sc-proceed-to-checkout">Proceed to checkout</a>
  </div>`
  );
}

export function renderCheckout() {
  const s = shop();
  const items = s.cart
    .map((l) => `<li>${esc(s.product(l.asin).title)} × ${l.qty}</li>`)
    .join("");
  const shipping = Object.entries(SHIPPING)
    .map(
      ([label, fee], i) =>
        `<label><input type="radio" name="shipping" value="${esc(label)}" data-fee="${fee}"${i === 0 ? " checked" : ""}/> ${esc(label)} ${fee ? money(fee) : "FREE"}</label>`
    )
    .join("\n      ");
  const payments = ["Credit Card", "Debit Card", "Amazon Pay"]
    .map(
      (m, i) =>
        `<label><input type="radio" name="payment" value="${m}"${i === 0 ? " checked" : ""}/> ${m}</label>`
    )
    .join("\n      ");
  return html(
    "Checkout",
    `<nav id="navbar"><a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a></nav>
  <form id="checkout-page" action="/gp/checkout/confirm" method="get">
    <h3>Shipping Address</h3>
    <label><input class="address-select" name="selectedShippingAddressId" type="radio" checked /> Default address</label>
    <div class="displayAddressDiv" id="selected-address">${esc(DEFAULT_ADDRESS)}</div>
    <input type="hidden" name="address" id="address-field" value="${esc(DEFAULT_ADDRESS)}" />
    <button type="button" id="add-new-address">Add New Address</button>
    <div id="address-ui-widgets-entrypoint" style="display:none">
      <input name="address-line1" type="text" placeholder="Street address" />
      <input name="city" type="text" placeholder="City" />
      <input name="state" type="text" placeholder="State" />
      <input name="zip" type="text" placeholder="ZIP" />
      <button type="button" id="save-address" class="a-button-primary">Save Address</button>
    </div>
    <h3>Shipping method</h3>
      ${shipping}
    <h3>Payment method</h3>
      ${payments}
    <div id="card-fields">
      <input id="addCreditCardNumber" name="addCreditCardNumber" type="text" placeholder="Card Number" />
      <select name="expirationMonth" id="expirationDate"><option>12</option></select>
      <input id="addCreditCardVerificationNumber" type="text" placeholder="CVV" />
    </div>
    <div id="amazon-pay-confirmation" style="display:none">Amazon Pay selected — you will confirm in your Amazon Pay wallet.</div>
    <input name="promotionCode" id="promotionCode" type="text" placeholder="Gift card or promotion code" />
    <button type="button" id="apply-coupon">Apply</button>
    <input type="hidden" name="discount" id="discount-field" value="0" />
    <div class="a-box-group order-summary" id="subtotals-marketplace-table">
      <span>Order Summary</span>
      <ul class="checkout-items">${items}</ul>
      <div>Items: <span id="items-subtotal" data-amount="${s.subtotal()}">${money(s.subtotal())}</span></div>
      <div>Shipping: <span id="shipping-fee" data-amount="0">FREE</span></div>
      <div id="couponMessage" class="coupon-applied"></div>
      <div class="promotion-price" id="discount-line" data-amount="0" style="display:none"></div>
      <div>Order total: <span class="grand-total-price" data-amount="${s.subtotal()}">${money(s.subtotal())}</span></div>
    </div>
    <input type="button" id="checkout-continue-btn" class="continue-btn a-button-input" value="Continue" />
    <button id="bottomSubmitOrderButtonId" type="submit">Place your order</button>
  </form>
  <script>
    (function () {
      var COUPONS = ${JSON.stringify(COUPONS)};
      var items = ${s.subtotal()};
      var $ = function (s) { return document.querySelector(s); };
      var fmt = function (n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
      function recalc() {
        var fee = Number(document.querySelector("input[name=shipping]:checked").dataset.fee);
        var discount = Number($("#discount-line").dataset.amount);
        var total = Math.round((items + fee - discount) * 100) / 100;
        $("#shipping-fee").dataset.amount = fee;
        $("#shipping-fee").textContent = fee ? fmt(fee) : "FREE";
        $(".grand-total-price").dataset.amount = total;
        $(".grand-total-price").textContent = fmt(total);
      }
      document.querySelectorAll("input[name=shipping]").forEach(function (r) { r.addEventListener("change", recalc); });
      document.querySelectorAll("input[name=payment]").forEach(function (r) {
        r.addEventListener("change", function () {
          var amazonPay = r.value === "Amazon Pay";
          $("#card-fields").style.display = amazonPay ? "none" : "block";
          $("#amazon-pay-confirmation").style.display = amazonPay ? "block" : "none";
        });
      });
      $("#add-new-address").addEventListener("click", function () { $("#address-ui-widgets-entrypoint").style.display = "block"; });
      $("#save-address").addEventListener("click", function () {
        var f = function (n) { return document.querySelector("[name=" + n + "]").value.trim(); };
        var addr = f("address-line1") + ", " + f("city") + ", " + f("state") + " " + f("zip");
        $("#selected-address").textContent = addr;
        $("#address-field").value = addr;
        $("#address-ui-widgets-entrypoint").style.display = "none";
      });
      $("#apply-coupon").addEventListener("click", function () {
        var code = $("#promotionCode").value.trim().toUpperCase();
        var rate = COUPONS[code];
        if (!rate) { $("#couponMessage").textContent = "The promotional code you entered is not valid."; return; }
        var discount = 0; // MUTATION: coupon gives no discount
        $("#discount-line").dataset.amount = discount;
        $("#discount-line").textContent = "Promotion applied: -" + fmt(discount);
        $("#discount-line").style.display = "block";
        $("#discount-field").value = discount;
        $("#couponMessage").textContent = code + " applied";
        recalc();
      });
    })();
  </script>`
  );
}

export function renderOrderConfirmation(url) {
  const s = shop();
  const q = new URL(url).searchParams;
  const shippingLabel = q.get("shipping") || "Standard (5-7 days)";
  const fee = SHIPPING[shippingLabel] || 0;
  const discount = Number(q.get("discount") || 0);
  const total = round2(s.subtotal() + fee - discount);
  s.orderSeq += 1;
  const orderId = `112-${String(4500000 + s.orderSeq).padStart(7, "0")}-${String(1000000 + s.cart.length * 7 + s.orderSeq).padStart(7, "0")}`;
  const items = s.cart.map((l) => `<li>${esc(s.product(l.asin).title)} × ${l.qty}</li>`).join("");
  s.clear();
  return html(
    "Order Placed",
    `${nav()}
  <div id="order-summary">
    <div class="a-alert-heading">Thank you, your order has been placed.</div>
    <div class="a-success">Order confirmed</div>
    <div class="a-text-bold">Order #${orderId}</div>
    <span id="orderID"><span class="a-size-medium">${orderId}</span></span>
    <div class="displayAddressDiv">Shipping to: ${esc(q.get("address") || DEFAULT_ADDRESS)}</div>
    <div id="order-payment">Paid with: ${esc(q.get("payment") || "Credit Card")}</div>
    <div id="order-total" data-amount="${total}">Order total: ${money(total)}</div>
    <ul>${items}</ul>
  </div>`
  );
}

// ─── Intercepts ──────────────────────────────────────────────────────────────

const page = (body) => ({ statusCode: 200, headers: { "content-type": "text/html" }, body });
const redirect = (location) => ({ statusCode: 302, headers: { location } });
const path = (re) => new RegExp(`^https?://[^/]+${re}`);

export function registerShopIntercepts() {
  cy.intercept("GET", path("/s(\\?.*)?$"), (req) => req.reply(page(renderSearch(req.url)))).as("searchResults");

  cy.intercept("GET", path("/dp/([A-Za-z0-9]+)"), (req) => {
    const asin = new URL(req.url).pathname.split("/")[2];
    req.reply(page(renderProduct(asin)));
  }).as("productPage");

  cy.intercept("GET", path("/gp/cart/add\\?"), (req) => {
    const q = new URL(req.url).searchParams;
    const qty = Number(q.get("quantity") || 1);
    shop().add(q.get("asin"), qty);
    req.reply(page(renderProduct(q.get("asin"), { added: qty })));
  }).as("addToCart");

  cy.intercept("GET", path("/gp/cart/update\\?"), (req) => {
    const q = new URL(req.url).searchParams;
    shop().setQty(q.get("asin"), Number(q.get("quantity")));
    req.reply(redirect("/gp/cart/view.html"));
  }).as("updateCart");

  cy.intercept("GET", path("/gp/cart/delete\\?"), (req) => {
    shop().remove(new URL(req.url).searchParams.get("asin"));
    const msg = `${shop().lastRemoved} was removed from Shopping Cart.`;
    req.reply(page(renderCart({ message: msg })));
  }).as("removeFromCart");

  cy.intercept("GET", path("/gp/cart/delete-all"), (req) => {
    shop().clear();
    req.reply(page(renderCart({ message: "All items were removed from Shopping Cart." })));
  }).as("clearCart");

  cy.intercept("GET", path("/gp/cart/view\\.html"), (req) => req.reply(page(renderCart()))).as("cartPage");

  cy.intercept("GET", path("/gp/(checkout/begin|buy/)"), (req) => req.reply(page(renderCheckout()))).as("checkoutPage");

  cy.intercept("GET", path("/gp/checkout/(confirm|thankyou)"), (req) =>
    req.reply(page(renderOrderConfirmation(req.url)))
  ).as("orderConfirm");
}
