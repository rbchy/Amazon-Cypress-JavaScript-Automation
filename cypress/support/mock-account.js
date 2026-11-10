// cypress/support/mock-account.js
// Stateful mock for two account pages whose scenarios FILTER data:
//   • Returns & Orders  (/gp/css/order-history) — date filter, order details, invoice
//   • Browsing History  (/gp/history/…)          — newest first, date filter, clear all
// Dates are generated relative to "now", so "Last 30 days" etc. stay true over time.

const DAY = 24 * 60 * 60 * 1000;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * DAY).toISOString().slice(0, 10);
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const ORDERS = [
  { id: "112-4500011-1000011", daysAgo: 12, items: [["Dell Laptop 15-inch Inspiron 3530", 799.99]], status: "Delivered" },
  { id: "112-4500010-1000010", daysAgo: 75, items: [["Logitech M705 Wireless Mouse", 34.99], ["Keychron K2 Mechanical Keyboard", 79.99]], status: "Delivered" },
  { id: "112-4500009-1000009", daysAgo: 200, items: [["Sony WH-1000XM5 Headphones", 399.99]], status: "Delivered" },
  { id: "112-4500008-1000008", daysAgo: 420, items: [["Anker Soundcore Q20 Headphones", 49.99]], status: "Returned" },
  { id: "112-4500007-1000007", daysAgo: 800, items: [["Dell MS116 Wired Mouse", 9.99]], status: "Delivered" },
];

export const HISTORY = [
  { asin: "B004", title: "Dell XPS 13 Laptop", daysAgo: 2 },
  { asin: "B010", title: "Sony WH-1000XM5 Headphones", daysAgo: 10 },
  { asin: "B002", title: "Logitech M705 Wireless Mouse", daysAgo: 45 },
  { asin: "B003", title: "Keychron K2 Mechanical Keyboard", daysAgo: 80 },
  { asin: "B013", title: "JBL Tune 510BT Headphones", daysAgo: 120 },
];

const ADDRESS = "742 Evergreen Terrace, Springfield, IL 62704";

// Returns centre used by the TC-008 return scenarios (simple static stub, kept from
// the original framework; these scenarios do not filter data).
const RETURNS_CENTER = `
    <section id="returns-center" class="a-box order return-card">
      <h2>Returns centre</h2>
      <span class="a-size-medium">#123456</span>
      <span>Dell Laptop</span>
      <span class="return-state">active</span>
      <div class="a-box-group order-info">
        <a href="/gp/return">Return Items</a>
        <span>Reason: Defective</span> <span>Wrong item sent</span>
        <span>Method: UPS pickup</span>
        <span>Submit Return</span>
        <span>Return initiated successfully</span>
        <span class="return-label"><a href="#">Return Label</a></span>
        <span>Status: Pending</span> <span>In Progress</span>
        <span class="tracking-number">1Z999AA10123456784</span>
        <span class="refund-date">Expected refund: Feb 1, 2026</span>
        <span>Return should be processed as replacement</span>
        <span>replacement shipping options</span>
      </div>
    </section>`;

const nav = `<nav id="navbar">
    <a id="nav-logo-link" class="nav-logo-link" href="/"><span class="a-icon-logo">amazon</span></a>
    <a href="/gp/account" data-nav-role="signin">Hello, Test User</a>
    <a href="/gp/flex/sign-out.html">Sign Out</a>
  </nav>`;

export function renderOrderHistory() {
  const cards = ORDERS.map((o) => {
    const total = o.items.reduce((s, [, p]) => s + p, 0);
    const lines = o.items.map(([t, p]) => `<li>${t} — ${money(p)}</li>`).join("");
    return `
    <div class="a-box order order-card" data-order-id="${o.id}" data-days-ago="${o.daysAgo}">
      <div class="order-header">
        <span data-field="Order Number">Order # <span class="order-id">${o.id}</span></span>
        <span data-field="Order Date">Order placed ${iso(o.daysAgo)}</span>
        <span data-field="Total Price">Total ${money(total)}</span>
        <span data-field="Delivery Status" class="a-color-success">${o.status}</span>
      </div>
      <ul data-field="Items">${lines}</ul>
      <div class="a-box-group order-detail" style="display:none">
        <span>Order details</span>
        <span>Ship to: ${ADDRESS}</span>
        <a href="#" class="invoice-link">Invoice</a>
        <a href="#" class="reorder-link">Reorder</a>
        <button type="button" class="download-invoice">Download Invoice</button>
        <div class="invoice-preview" style="display:none">
          <p class="invoice-status">Invoice downloaded: invoice-${o.id}.pdf</p>
          <dl>
            <dt>Order Number</dt><dd>${o.id}</dd>
            <dt>Items with prices</dt><dd><ul>${lines}</ul></dd>
            <dt>Shipping address</dt><dd>${ADDRESS}</dd>
            <dt>Billing address</dt><dd>${ADDRESS}</dd>
            <dt>Total amount</dt><dd>${money(total)}</dd>
          </dl>
        </div>
      </div>
    </div>`;
  }).join("");
  return `<!DOCTYPE html><html><head><title>Your Orders</title></head><body>
  ${nav}
  <div id="orders-page">
    <h1>Returns &amp; Orders</h1>
    <select id="dateFilter" name="dateFilter">
      <option value="99999">All orders</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
      <option value="183">Last 6 months</option>
      <option value="365">Last 12 months</option>
    </select>
    <div id="orders-list">${cards}</div>
    ${RETURNS_CENTER}
  </div>
  <script>
    document.getElementById("dateFilter").addEventListener("change", function (e) {
      var limit = Number(e.target.value);
      document.querySelectorAll(".order-card").forEach(function (c) {
        c.style.display = Number(c.dataset.daysAgo) <= limit ? "" : "none";
      });
    });
    document.querySelectorAll(".order-card").forEach(function (c) {
      c.querySelector(".order-header").addEventListener("click", function () {
        c.querySelector(".order-detail").style.display = "block";
      });
      c.querySelector(".download-invoice").addEventListener("click", function () {
        c.querySelector(".invoice-preview").style.display = "block";
      });
    });
  </script>
</body></html>`;
}

export function renderBrowsingHistory() {
  const items = [...HISTORY]
    .sort((a, b) => a.daysAgo - b.daysAgo)
    .map(
      (h) =>
        `<a href="/dp/${h.asin}" class="rhf-item a-cardui-body history-item" data-days-ago="${h.daysAgo}" data-viewed="${iso(h.daysAgo)}">${h.title} <small>viewed ${iso(h.daysAgo)}</small></a>`
    )
    .join("\n      ");
  return `<!DOCTYPE html><html><head><title>Browsing History</title></head><body>
  ${nav}
  <div id="history-page">
    <h1>Browsing History</h1>
    <select id="dateFilter" name="dateFilter">
      <option value="99999">All</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
    </select>
    <div id="history-list">
      ${items}
    </div>
    <button type="button" id="clear-history">Clear Browsing History</button>
    <div id="clear-confirm" style="display:none">
      <p>Remove all items from your browsing history?</p>
      <button type="button" id="confirm-clear">Confirm</button>
    </div>
    <p id="history-message"></p>
  </div>
  <script>
    document.getElementById("dateFilter").addEventListener("change", function (e) {
      var limit = Number(e.target.value);
      document.querySelectorAll(".history-item").forEach(function (i) {
        i.style.display = Number(i.dataset.daysAgo) <= limit ? "" : "none";
      });
    });
    document.getElementById("clear-history").addEventListener("click", function () {
      document.getElementById("clear-confirm").style.display = "block";
    });
    document.getElementById("confirm-clear").addEventListener("click", function () {
      document.getElementById("history-list").innerHTML = "";
      document.getElementById("clear-confirm").style.display = "none";
      document.getElementById("history-message").textContent =
        "Browsing history cleared successfully. Your browsing history is empty.";
    });
  </script>
</body></html>`;
}

const page = (body) => ({ statusCode: 200, headers: { "content-type": "text/html" }, body });

export function registerAccountIntercepts() {
  cy.intercept("GET", /^https?:\/\/[^/]+\/(gp\/css\/)?order-history/, (req) => req.reply(page(renderOrderHistory()))).as("orderHistory");
  cy.intercept("GET", /^https?:\/\/[^/]+\/gp\/history\//, (req) => req.reply(page(renderBrowsingHistory()))).as("browsingHistory");
}
