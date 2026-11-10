// cypress/support/step_definitions/shopping.js
// Search, filter, sort, cart. Pages come from the stateful mock in
// cypress/support/mock-shop.js, so every Then step checks real values
// (prices, ratings, brands, quantities, totals), not just "element exists".
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const selectors = require("../../fixtures/selectors.json");

const RESULT = selectors.search_results; // [data-component-type='s-search-result']
const num = (text) => Number(String(text).replace(/[^0-9.]/g, ""));

/** Reads one data-* attribute from every search result as numbers or strings. */
const resultData = (attr, asNumber = true) =>
  cy.get(RESULT).then(($els) => [...$els].map((el) => (asNumber ? Number(el.dataset[attr]) : el.dataset[attr])));

const navCount = () => cy.get(selectors.cart_count).invoke("text").then(num);

const searchFor = (keyword) => {
  cy.get(selectors.search_box).clear().type(`${keyword}{enter}`);
  cy.get(selectors.search_results_count).should("contain", keyword);
};

const addToCartFromSearch = (keyword, qty = 1) => {
  searchFor(keyword);
  cy.get(selectors.product_link).first().click();
  cy.get(selectors.quantity_input).select(String(qty));
  cy.get(selectors.add_to_cart_button).click();
  cy.get(selectors.toast_message).should("contain", "Added to Cart");
};

// ─── Search ──────────────────────────────────────────────────────────────────

When("I click on search box", () => {
  cy.get(selectors.search_box).should("be.visible").click();
});

When("I enter search keyword {string}", (keyword) => {
  cy.get(selectors.search_box).clear().type(keyword);
  cy.wrap(keyword).as("keyword");
});

When("I press Enter or click Search button", () => {
  cy.get(selectors.search_box).type("{enter}");
  cy.get("@keyword").then((k) => cy.get(selectors.search_results_count).should("contain", k));
});

Then("I should see search results page", () => {
  cy.title().should("match", /^Amazon\.com : /);
  cy.get(selectors.search_results_count).should("be.visible").invoke("text").should("match", /^1-\d+ of \d+ results/);
});

Then(/I should see list of (\S+) products/, (productType) => {
  cy.get(RESULT).should("have.length.greaterThan", 0);
  cy.get(RESULT).each(($r) => {
    expect($r.find("h2").text().toLowerCase(), "every result title").to.contain(productType.toLowerCase());
  });
});

Then("I should see price for each product", () => {
  cy.get(RESULT).each(($r) => {
    expect($r.find(".a-price .a-offscreen").text(), "price label").to.match(/^\$\d[\d,]*\.\d{2}$/);
  });
});

Then("I should see star ratings", () => {
  cy.get(RESULT).each(($r) => {
    expect($r.find(".a-icon-alt").text(), "rating label").to.match(/^\d\.\d out of 5 stars$/);
  });
});

Then("I should see product images", () => {
  cy.get(RESULT).each(($r) => {
    expect($r.find("img.s-image"), "product image").to.have.length(1);
    expect($r.find("img.s-image").attr("alt"), "image alt text").to.not.be.empty;
  });
});

// ─── Filters ─────────────────────────────────────────────────────────────────

Then("I should see search results", () => {
  cy.get(RESULT).its("length").should("be.greaterThan", 0).as("unfilteredCount", { type: "static" });
});

When("I apply filter {string}", (filter) => {
  if (/^Price:/i.test(filter)) {
    const nums = (filter.match(/\d[\d,]*/g) || []).map((n) => Number(n.replace(/,/g, "")));
    cy.wrap({ low: nums[0], high: nums[1] ?? Infinity }).as("priceRange");
  }
  cy.contains("#s-refinements a", filter).click();
  cy.location("search").should("not.be.empty");
});

Then("I should see filtered results", () => {
  cy.get(RESULT).its("length").should("be.greaterThan", 0);
  cy.get("@unfilteredCount").then((before) => {
    cy.get(RESULT).its("length").should("be.lessThan", before);
  });
});

Then("All products should be within selected price range", () => {
  cy.get("@priceRange").then(({ low, high }) => {
    resultData("price").each((p) => {
      expect(p, "price").to.be.within(low, high);
    });
  });
});

Then("All products should be from {string} brand", (brand) => {
  resultData("brand", false).each((b) => expect(b).to.eq(brand));
});

Then("All products should be from Dell brand", () => {
  resultData("brand", false).each((b) => expect(b).to.eq("Dell"));
});

Then("All products should have {float} rating", (rating) => {
  resultData("rating").each((r) => expect(r).to.be.at.least(rating));
});

Then("All products should have {int}+ rating", (rating) => {
  resultData("rating").each((r) => expect(r).to.be.at.least(rating));
});

// ─── Sorting ─────────────────────────────────────────────────────────────────

Then("I should see sort dropdown", () => {
  cy.get(selectors.sort_dropdown).should("be.visible").find("option").should("have.length.at.least", 4);
});

When("I select sort option {string}", (sortOption) => {
  cy.get(selectors.sort_dropdown).select(sortOption);
  // the page reloads with ?s=<value>; wait until the new page shows the choice
  cy.get("#s-result-sort-select").find("option:selected").should("have.text", sortOption);
});

const expectSorted = (values, compare, label) => {
  const sorted = [...values].sort(compare);
  expect(values, label).to.deep.eq(sorted);
  expect(values.length, "results to compare").to.be.greaterThan(1);
};

Then("results should be sorted by ascending price", () => {
  resultData("price").then((v) => expectSorted(v, (a, b) => a - b, "prices low → high"));
});

Then("results should be sorted by rating descending", () => {
  resultData("rating").then((v) => expectSorted(v, (a, b) => b - a, "ratings high → low"));
});

Then("results should show newest products first", () => {
  resultData("released", false).then((v) => expectSorted(v, (a, b) => b.localeCompare(a), "release dates new → old"));
});

// ─── Add to cart ─────────────────────────────────────────────────────────────

When("I search for product {string}", (productName) => {
  // the same step is used on the Associates dashboard, which has its own product search
  cy.get("body").then(($b) => {
    if ($b.find(selectors.affiliate_search_box).length) {
      cy.get(selectors.affiliate_search_box).first().clear().type(productName);
    } else {
      searchFor(productName);
    }
  });
});

When("I click on first product result", () => {
  cy.get(selectors.product_link).first().invoke("text").then((t) => cy.wrap(t.trim()).as("chosenTitle"));
  cy.get(selectors.product_link).first().click();
});

Then("I should see product details page", () => {
  cy.get(selectors.product_details_container).should("be.visible");
  cy.get("@chosenTitle").then((t) => cy.get("#productTitle").should("have.text", t));
});

When("I enter quantity {string}", (qty) => {
  cy.get(selectors.quantity_input).select(qty).should("have.value", qty);
});

When("I click Add to Cart button", () => {
  navCount().as("countBefore", { type: "static" });
  cy.get(selectors.add_to_cart_button).should("be.enabled").click();
  cy.get(selectors.toast_message).should("contain", "Added to Cart");
});

Then("I should see cart added confirmation {string}", (message) => {
  cy.get(selectors.toast_message).should("contain", message);
});

Then("Cart count should increase to {string}", (count) => {
  cy.get(selectors.cart_count).should("have.text", count);
  cy.get("@countBefore").then((before) => expect(Number(count)).to.be.greaterThan(before));
});

Then("I should see success toast message", () => {
  cy.get(selectors.toast_message).should("be.visible").and("have.text", "Added to Cart");
});

Then("Cart should have {int} items", (itemCount) => {
  cy.get(selectors.cart_icon).click();
  cy.get(".sc-list-item").should("have.length", itemCount);
});

Then("Cart count should display {string}", (count) => {
  cy.get(selectors.cart_count).should("have.text", count);
  cy.get(".sc-list-item").then(($rows) => {
    const sum = [...$rows].reduce((n, r) => n + Number(r.dataset.quantity), 0);
    expect(String(sum), "sum of line quantities").to.eq(count);
  });
});

// ─── Out of stock ────────────────────────────────────────────────────────────

Then("Add to Cart button should be disabled", () => {
  cy.get(selectors.add_to_cart_button).should("be.disabled");
});

Then("I should see {string} button instead", (buttonText) => {
  cy.contains("button", buttonText, { matchCase: false }).should("be.visible").and("be.enabled");
});

// ─── Remove / update / clear ─────────────────────────────────────────────────

Given("I have added {string} to cart", (product) => {
  addToCartFromSearch(product, 1);
});

Given("I have added {string} quantity {int} to cart", (product, qty) => {
  addToCartFromSearch(product, qty);
});

Given("I have multiple items in cart", () => {
  addToCartFromSearch("laptop", 1);
  addToCartFromSearch("mouse", 2);
  cy.get(selectors.cart_count).should("have.text", "3");
});

When("I go to Shopping Cart", () => {
  cy.get(selectors.cart_icon).click();
  cy.contains("h1", "Shopping Cart").should("be.visible");
});

When("I click on Cart menu", () => {
  cy.get(selectors.cart_icon).click();
  cy.get(".sc-list-item").should("have.length.greaterThan", 0);
});

Then("I should see {string} in cart", (product) => {
  cy.contains(".sc-product-title", product, { matchCase: false }).should("be.visible");
});

Then("I should see cart subtotal", () => {
  cy.get(selectors.cart_subtotal).should("be.visible");
  cy.get(".sc-list-item").then(($rows) => {
    const expected = [...$rows].reduce((s, r) => s + Number(r.dataset.price) * Number(r.dataset.quantity), 0);
    cy.get("#sc-subtotal-amount-activecart").invoke("attr", "data-total").then(Number)
      .should("be.closeTo", expected, 0.001);
  });
});

When("I click Remove button for {string}", (product) => {
  navCount().as("countBefore", { type: "static" });
  cy.wrap(product).as("removedProduct");
  cy.contains(".sc-list-item", product, { matchCase: false }).find(".sc-action-delete").click();
});

Then("I should see confirmation message", () => {
  cy.get("@removedProduct").then((p) =>
    cy.get(".sc-removed-message").should("contain", p).and("contain", "was removed from Shopping Cart")
  );
});

Then("Product should be removed from cart", () => {
  cy.get("@removedProduct").then((p) =>
    cy.get("body").should(($b) => {
      const titles = [...$b.find(".sc-product-title")].map((t) => t.textContent);
      expect(titles.filter((t) => t.includes(p)), `"${p}" still in cart`).to.have.length(0);
    })
  );
});

Then("Cart should be updated", () => {
  // subtotal must equal what is left in the cart
  cy.get("body").then(($b) => {
    const rows = [...$b.find(".sc-list-item")];
    const expected = rows.reduce((s, r) => s + Number(r.dataset.price) * Number(r.dataset.quantity), 0);
    const items = rows.reduce((n, r) => n + Number(r.dataset.quantity), 0);
    cy.get("#sc-subtotal-amount-activecart").invoke("attr", "data-total").then(Number)
      .should("be.closeTo", expected, 0.001);
    cy.get(selectors.cart_subtotal).first().should("contain", `(${items} items)`);
  });
});

Then("Cart count should decrease", () => {
  cy.get("@countBefore").then((before) => navCount().should("be.lessThan", before));
});

When("I change quantity to {string}", (newQty) => {
  cy.get(".sc-list-item").first().find("select[name='quantity']").select(newQty);
});

When("I press Update or click refresh", () => {
  cy.get(".sc-list-item").first().find("input[name='update']").click();
  cy.contains("h1", "Shopping Cart").should("be.visible");
});

Then("Cart should show quantity {string}", (qty) => {
  cy.get(".sc-list-item").first().find("select[name='quantity']").should("have.value", qty);
  cy.get(selectors.cart_count).should("have.text", qty);
});

Then("Subtotal should be recalculated", () => {
  cy.get(".sc-list-item").first().then(($row) => {
    const expected = Number($row.attr("data-price")) * Number($row.attr("data-quantity"));
    cy.wrap($row).find(".sc-line-subtotal").invoke("attr", "data-line-total").then(Number)
      .should("be.closeTo", expected, 0.001);
  });
});

Then("Price should reflect new quantity", () => {
  cy.get(".sc-list-item").first().then(($row) => {
    const price = Number($row.attr("data-price"));
    const qty = Number($row.attr("data-quantity"));
    const shown = "$" + (price * qty).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    cy.get(selectors.cart_subtotal).should("contain", `(${qty} items)`).and("contain", shown);
  });
});

When("I click on Delete all or Clear Cart option", () => {
  cy.contains("a", /delete all/i).click();
});

Then("all products should be removed", () => {
  cy.get(".sc-list-item").should("not.exist");
  cy.get(selectors.cart_count).should("have.text", "0");
});

Then("Cart should be empty", () => {
  cy.get(selectors.empty_cart_message).should("be.visible");
  cy.get("#sc-subtotal-amount-activecart").should("have.text", "$0.00");
});

Then("Message {string} should appear", (message) => {
  cy.contains(message, { matchCase: false }).should("be.visible");
});
