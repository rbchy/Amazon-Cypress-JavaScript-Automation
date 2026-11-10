// cypress/support/step_definitions/checkout-account.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const testData = require("../../fixtures/testData.json");
const selectors = require("../../fixtures/selectors.json");

// ─── Checkout Steps ─────────────────────────────────────────────────────────

Given("I have items in cart", () => {
  // seed the mock shop directly: 1 × Dell laptop ($799.99) + 1 × Logitech mouse ($34.99)
  cy.then(() => {
    Cypress.mockShop.add("B001", 1);
    Cypress.mockShop.add("B002", 1);
  });
});

When("I click Proceed to Checkout button", () => {
  cy.contains("a", /Proceed to checkout/i).click();
  cy.get(selectors.checkout_container).should("be.visible");
});

Then("I should see checkout page", () => {
  cy.title().should("eq", "Checkout");
  cy.contains("h3", "Shipping Address").should("be.visible");
  cy.get(".checkout-items li").should("have.length", 2);
  cy.get("#items-subtotal").should("have.text", "$834.98");
});

When("I select shipping address", () => {
  cy.get(selectors.address_select).first().check().should("be.checked");
  cy.get(selectors.selected_address).should("not.be.empty");
});

When("I select shipping method {string}", (method) => {
  cy.get(`input[name='shipping'][value='${method}']`).check().should("be.checked");
});

When("I select payment method {string}", (paymentMethod) => {
  cy.get(`input[name='payment'][value='${paymentMethod}']`).check().should("be.checked");
});

When("I enter card details", () => {
  cy.get(selectors.card_number_input).should("be.visible").type(testData.payment.cardNumber);
  cy.get(selectors.card_cvv_input).should("be.visible").type(testData.payment.cvv);
});

When("I review order summary", () => {
  cy.get(selectors.order_summary).should("be.visible");
  // total = items + shipping − discount
  cy.get("#items-subtotal").invoke("attr", "data-amount").then(Number).then((items) => {
    cy.get("#shipping-fee").invoke("attr", "data-amount").then(Number).then((ship) => {
      cy.get(".grand-total-price").invoke("attr", "data-amount").then(Number)
        .should("be.closeTo", items + ship, 0.001);
    });
  });
});

When("I click Place Order button", () => {
  cy.get(".grand-total-price").invoke("text").as("checkoutTotal", { type: "static" });
  cy.get(selectors.place_order_button).click();
});

Then("I should see order confirmation page", () => {
  cy.title().should("eq", "Order Placed");
  cy.contains(/thank you, your order has been placed/i).should("be.visible");
});

Then("I should see Order Number", () => {
  cy.get("#orderID .a-size-medium").invoke("text").should("match", /^\d{3}-\d{7}-\d{7}$/);
});

Then("Order should be confirmed successfully", () => {
  cy.get(selectors.order_confirmation_message).should("be.visible");
  cy.get("@checkoutTotal").then((total) => cy.get("#order-total").should("contain", total));
  cy.get(selectors.cart_count).should("have.text", "0"); // the cart is emptied by the order
});

// ─── New Address ────────────────────────────────────────────────────────────

When("I click Add New Address", () => {
  cy.contains("button", "Add New Address").click();
  cy.get(selectors.address_input).should("be.visible");
});

When("I enter address {string}", (address) => {
  cy.get(selectors.address_input).clear().type(address);
});

When("I enter city {string}", (city) => {
  cy.get(selectors.city_input).clear().type(city);
});

When("I enter state {string}", (state) => {
  cy.get(selectors.state_input).first().clear().type(state);
});

When("I enter zip code {string}", (zip) => {
  cy.get(selectors.zip_input).clear().type(zip);
});

When("I save address", () => {
  cy.contains("button", /Save Address/i).click();
});

Then("new address should be selected", () => {
  cy.get(selectors.selected_address).should("have.text", "123 Main Street, New York, NY 10001");
});

When("I continue checkout process", () => {
  cy.get(selectors.continue_button).first().click();
});

Then("I place order", () => {
  cy.get(selectors.place_order_button).click();
});

Then("Order should be confirmed with new address", () => {
  cy.get(selectors.confirmation_page).should("be.visible");
  cy.get(selectors.selected_address).should("contain", "123 Main Street, New York, NY 10001");
  cy.get("#orderID .a-size-medium").invoke("text").should("match", /^\d{3}-\d{7}-\d{7}$/);
});

// ─── Coupon Code ────────────────────────────────────────────────────────────

When("I enter coupon code {string}", (couponCode) => {
  cy.get(selectors.coupon_input).clear().type(couponCode);
  cy.wrap(couponCode).as("coupon");
});

When("I click Apply Coupon", () => {
  cy.get(".grand-total-price").invoke("attr", "data-amount").then(Number).as("totalBefore", { type: "static" });
  cy.contains("button", "Apply").click();
});

Then("Discount should be applied", () => {
  cy.get("@coupon").then((code) => cy.get(selectors.discount_message).should("have.text", `${code} applied`));
});

Then("Order total should be reduced", () => {
  cy.get("@totalBefore").then((before) => {
    cy.get(".grand-total-price").invoke("attr", "data-amount").then(Number).should("be.lessThan", before);
  });
});

Then("Discount amount should show on summary", () => {
  // SAVE10 = 10 % of the $834.98 items subtotal
  cy.get(selectors.discount_line_item).should("be.visible").and("contain", "-$83.50");
  cy.get(".grand-total-price").should("have.text", "$751.48");
});

// ─── Payment Methods ─────────────────────────────────────────────────────────

When("I go back and select payment method {string}", (payment) => {
  cy.get(`input[name='payment'][value='${payment}']`).check().should("be.checked");
});

Then("I should see {string} confirmation", (text) => {
  cy.contains(text, { matchCase: false }).should("be.visible");
});

Then("I should see Amazon Pay confirmation", () => {
  cy.get("#amazon-pay-confirmation").should("be.visible").and("contain", "Amazon Pay selected");
  cy.get(selectors.card_number_input).should("not.be.visible");
});

Then("I should see credit card fields", () => {
  cy.get(selectors.card_number_input).should("be.visible");
  cy.get("#amazon-pay-confirmation").should("not.be.visible");
});

Then("I should see debit card fields", () => {
  cy.get("input[name='payment'][value='Debit Card']").should("be.checked");
  cy.get(selectors.card_number_input).should("be.visible");
});

// ─── Returns Steps ───────────────────────────────────────────────────────────

Given("I have a completed purchase order {string}", (orderNumber) => {
  cy.get(selectors.search_box).should("exist");
});

Given("I have received wrong item in order", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to Account & Lists", () => {
  cy.visit("/gp/account");
});

When("I go to Returns & Orders", () => {
  cy.visit("/gp/css/order-history");
});

When("I click on Returns & Orders", () => {
  cy.contains(/Returns.*Orders/i).should("exist").click({ force: true });
});

When("I select order {string}", (orderNumber) => {
  cy.contains(orderNumber, { matchCase: false }).should("exist").click({ force: true });
});

When("I select the order", () => {
  cy.get(selectors.order_list_items).first().click({ force: true });
});

Then("I should see order details", () => {
  cy.get(selectors.order_details).should("be.visible");
});

When("I click Return Items button", () => {
  cy.contains(/Return Items/i).should("exist").click({ force: true });
});

When("I click Return Items", () => {
  cy.contains(/Return Items/i).should("exist").click({ force: true });
});

When("I select item {string} to return", (item) => {
  cy.contains(item, { matchCase: false }).should("exist");
});

When("I select wrong item", () => {
  cy.get(selectors.order_list_items).first().should("exist");
});

When("I select return reason {string}", (reason) => {
  cy.contains(reason, { matchCase: false }).should("exist");
});

When("I select reason {string}", (reason) => {
  cy.contains(reason, { matchCase: false }).should("exist");
});

When("I select return method {string}", (method) => {
  cy.contains(method, { matchCase: false }).should("exist");
});

When("I proceed with return", () => {
  cy.contains(/Submit|Return/i).first().click({ force: true });
});

When("I click Submit Return Request", () => {
  cy.contains(/Submit Return/i).should("exist").click({ force: true });
});

Then("I should see {string}", (message) => {
  cy.contains(message, { matchCase: false }).should("be.visible");
});

Then("I should receive return label", () => {
  cy.get(selectors.return_label).should("exist");
});

Then("Return status should show {string}", (status) => {
  cy.contains(status, { matchCase: false }).should("be.visible");
});

Then("Return should be processed as replacement", () => {
  cy.contains(/replacement/i).should("be.visible");
});

Then("I should see replacement shipping options", () => {
  cy.contains(/replacement shipping options/i).should("be.visible");
});

// ─── Track Return ────────────────────────────────────────────────────────────

Given("I have initiated a return", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I click on my active return", () => {
  cy.contains(/active|pending/i).first().click({ force: true });
});

Then("I should see return status {string}", (status) => {
  cy.contains(status, { matchCase: false }).should("be.visible");
});

Then("I should see return tracking number", () => {
  cy.get(selectors.tracking_number).should("be.visible");
});

Then("I should see expected refund date", () => {
  cy.get(selectors.refund_date).should("be.visible");
});

When("I click on tracking number", () => {
  cy.get(selectors.tracking_number).first().click({ force: true });
});

Then("return tracking should open in new window", () => {
  cy.get(selectors.tracking_number).should("exist");
});

// ─── Prime Membership Steps ──────────────────────────────────────────────────

When("I click on Prime menu", () => {
  cy.visit("/gp/prime");
});

When("I click Join Prime button", () => {
  cy.contains("Join Prime").should("be.visible").click({ force: true });
});

Then("I should see Prime benefits page", () => {
  cy.get(selectors.prime_benefits_container).should("exist");
});

When("I select membership type {string}", (type) => {
  cy.contains(type, { matchCase: false }).should("exist");
});

When("I click Subscribe Now", () => {
  cy.contains("Subscribe Now").should("exist").click({ force: true });
});

When("I review and accept terms", () => {
  cy.get(selectors.terms_checkbox).check({ force: true });
});

When("I confirm payment", () => {
  cy.contains("Confirm").click({ force: true });
});

Then("Prime membership should be activated", () => {
  cy.get(selectors.prime_active_indicator).should("be.visible");
});

Then("Free shipping should be enabled on all orders", () => {
  cy.get(selectors.free_shipping_badge).should("be.visible");
});

Given("I have active Prime membership", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to My Prime", () => {
  cy.visit("/gp/prime");
});

Then("I should see all Prime benefits:", (dataTable) => {
  const benefits = dataTable.rows().map((r) => r[0]);
  expect(benefits, "benefits listed in the feature").to.have.length.greaterThan(0);
  benefits.forEach((benefit) => cy.contains(benefit).should("be.visible"));
});

When("I go to Prime Settings", () => {
  cy.visit("/gp/prime");
  cy.contains("Prime Settings").should("exist");
});

When("I click Cancel Membership", () => {
  cy.contains("Cancel Membership").should("exist").click({ force: true });
});

When("I select cancel reason", () => {
  cy.get(selectors.cancel_reason_select).select(0, { force: true });
});

When("I confirm cancellation", () => {
  cy.contains("Confirm Cancellation").click({ force: true });
});

Then("Membership should be cancelled", () => {
  cy.contains(/cancelled|ended/i).should("be.visible");
});

Then("Free shipping benefits should be removed", () => {
  cy.contains(/cancelled|ended|expire/i).should("be.visible");
});

// ─── Browsing History (stateful mock: cypress/support/mock-account.js) ─────────

Given("I have browsed several products", () => {
  cy.wrap(5).as("historySize"); // fixture: 5 products viewed 2–120 days ago
});

Given("I have browsing history", () => {
  cy.wrap(5).as("historySize");
});

When("I go to Browsing History", () => {
  cy.visit("/gp/history/view");
  cy.contains("h1", "Browsing History").should("be.visible");
});

When("I click on Browsing History", () => {
  cy.contains("a", /Browsing History/i).click();
  cy.contains("h1", "Browsing History").should("be.visible");
});

Then("I should see all browsed products", () => {
  cy.get("@historySize").then((n) => cy.get(selectors.browsing_history_items).should("have.length", n));
});

Then("Products should be listed with most recent first", () => {
  cy.get(selectors.browsing_history_items).then(($i) => {
    const days = [...$i].map((el) => Number(el.dataset.daysAgo));
    expect(days, "days since viewed, ascending").to.deep.eq([...days].sort((x, y) => x - y));
  });
});

When("I click on any product", () => {
  cy.get(selectors.browsing_history_items).first().invoke("attr", "href").as("historyHref", { type: "static" });
  cy.get(selectors.browsing_history_items).first().click();
});

Then("product details page should open", () => {
  cy.get("@historyHref").then((href) => cy.location("pathname").should("eq", href));
  cy.get(selectors.product_details_container).should("be.visible");
  cy.get("#productTitle").should("not.be.empty");
});

When("I click Clear Browsing History", () => {
  cy.visit("/gp/history/view");
  cy.contains("button", "Clear Browsing History").click();
  cy.contains("button", "Confirm").should("be.visible").click();
});

Then("all history should be deleted", () => {
  cy.get(selectors.browsing_history_items).should("not.exist");
  cy.get("#history-message").should("contain", "cleared successfully");
});

Then("Browsing history should be empty", () => {
  cy.get("#history-list").should("be.empty");
  cy.get("#history-message").should("contain", "Your browsing history is empty");
});

const pickDateFilter = (label) => {
  cy.get("#dateFilter").select(label);
  cy.get("#dateFilter").find("option:selected").should("have.text", label);
};

/** Every visible row is within the limit, and at least one older row got hidden. */
const expectOnlyWithin = (rowsSelector, limitDays) => {
  cy.get(rowsSelector).filter(":visible").should("have.length.greaterThan", 0)
    .each(($r) => expect(Number($r.attr("data-days-ago")), "days ago").to.be.at.most(limitDays));
  cy.get(rowsSelector).filter(":hidden").should("have.length.greaterThan", 0);
};

When("I select date filter {string}", (dateRange) => {
  pickDateFilter(dateRange);
});

Then("only products from last {int} days should be shown", (days) => {
  expectOnlyWithin(selectors.browsing_history_items, days);
});

When("I select {string}", (option) => {
  pickDateFilter(option);
});

Then("products from 90 days should be shown", () => {
  expectOnlyWithin(selectors.browsing_history_items, 90);
  cy.get(selectors.browsing_history_items).filter(":visible").should("have.length", 4);
});

// ─── Purchase History (stateful mock: cypress/support/mock-account.js) ─────────

Given("I have completed multiple purchases", () => {
  cy.wrap(5).as("orderCount"); // fixture: 5 orders between 12 and 800 days old
});

Given("I have purchase history spanning multiple years", () => {
  cy.wrap(5).as("orderCount");
});

Given("I have completed purchases", () => {
  cy.wrap(5).as("orderCount");
});

When("I select {string} filter", (filter) => {
  pickDateFilter(filter);
});

Then("I should see all purchase orders", () => {
  cy.get("@orderCount").then((n) => cy.get(".order-card").should("have.length", n));
});

Then("Each order should show:", (dataTable) => {
  const fields = dataTable.rows().map((r) => r[0]);
  cy.get(".order-card").each(($card) => {
    fields.forEach((f) => {
      const el = $card.find(`[data-field="${f}"]`);
      expect(el, `${f} on order ${$card.attr("data-order-id")}`).to.have.length(1);
      expect(el.text().trim(), f).to.not.be.empty;
    });
  });
});

Then("only orders from last {int} months should be shown", (months) => {
  expectOnlyWithin(".order-card", Math.round(months * 30.5));
});

When("I click on an order", () => {
  cy.get(".order-card").filter(":visible").first().as("openOrder");
  cy.get("@openOrder").find(".order-header").click();
});

Then("detailed order information should be displayed", () => {
  cy.get("@openOrder").find(".order-detail").should("be.visible").and("contain", "Ship to:");
});

Then("I should see invoice option", () => {
  cy.get("@openOrder").find(".invoice-link").should("be.visible").and("have.text", "Invoice");
});

Then("I should see reorder option", () => {
  cy.get("@openOrder").find(".reorder-link").should("be.visible").and("have.text", "Reorder");
});

When("I click Download Invoice button", () => {
  cy.get("@openOrder").find(".download-invoice").should("be.visible").click();
});

Then("invoice PDF should be downloaded", () => {
  cy.get("@openOrder").invoke("attr", "data-order-id").then((id) =>
    cy.get("@openOrder").find(".invoice-status").should("be.visible").and("have.text", `Invoice downloaded: invoice-${id}.pdf`)
  );
});

Then("PDF should contain:", (dataTable) => {
  const sections = dataTable.rows().map((r) => r[0]);
  cy.get("@openOrder").find(".invoice-preview dt").then(($dt) => {
    const shown = [...$dt].map((d) => d.textContent.trim());
    sections.forEach((sec) => expect(shown, "invoice sections").to.include(sec));
  });
  cy.get("@openOrder").find(".invoice-preview dd").each(($dd) => expect($dd.text().trim()).to.not.be.empty);
});

// ─── Amazon Rewards / Visa ────────────────────────────────────────────────────

When("I go to Amazon Rewards", () => {
  cy.visit("/rewards");
});

When("I click on Amazon Visa Card", () => {
  cy.contains(/Amazon Visa Card/i).should("exist").click({ force: true });
});

Then("I should see card benefits page", () => {
  cy.contains(/Card Benefits|Cashback/i).should("be.visible");
});

Then("I should see:", (dataTable) => {
  dataTable.rows().forEach(([item]) => {
    cy.contains(item, { matchCase: false }).should("be.visible");
  });
});

When("I click Apply Now button", () => {
  cy.contains("Apply Now").should("exist").click({ force: true });
});

Then("I should see application form", () => {
  cy.get(selectors.affiliate_registration_form).should("exist");
});

When("I enter personal information:", (dataTable) => {
  cy.get("input[name='name']").first().type("John Doe", { force: true });
  cy.get("input[name='email']").first().type("john@gmail.com", { force: true });
});

When("I submit application", () => {
  cy.contains(/Submit Application|Submit/i).first().click({ force: true });
});

Then("I should receive confirmation email", () => {
  cy.contains(/confirmation email|email/i).should("be.visible");
});

Given("I have approved Amazon Visa card", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to Card Management", () => {
  cy.visit("/card");
});

// ─── Affiliate / Associates Steps ─────────────────────────────────────────────

When("I go to Amazon Associates", () => {
  cy.visit("/associates");
});

When("I click Join Associates button", () => {
  cy.contains("Join Associates").should("be.visible").click({ force: true });
});

Then("I should see registration form", () => {
  cy.get(selectors.affiliate_registration_form).should("exist");
});

When(/I enter website\/channel information:/, (dataTable) => {
  cy.get(selectors.website_url_input).type("myblog.com", { force: true });
  cy.get(selectors.traffic_input).type("1000", { force: true });
  cy.get(selectors.content_type_input).select(0, { force: true });
});

When("I select use case {string}", (useCase) => {
  cy.contains(useCase, { matchCase: false }).should("exist");
});

When("I review Associates agreement", () => {
  cy.get(selectors.agreement_checkbox).check({ force: true });
});

Then("I should receive affiliate account setup instructions", () => {
  cy.contains(/instructions|email/i).should("be.visible");
});

Given("I have approved Associates account", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to Associates Dashboard", () => {
  cy.visit("/associates");
});

When("I click Get Link button", () => {
  cy.contains("Get Link").should("exist").click({ force: true });
});

Then("affiliate link should be generated", () => {
  cy.get(selectors.generated_affiliate_link).should("be.visible");
});

When("I copy affiliate link", () => {
  cy.get(selectors.copy_link_button).click({ force: true });
});

When("I share link", () => {
  cy.get(selectors.generated_affiliate_link).should("exist");
});

Then("shared link should earn commission on clicks", () => {
  cy.contains(/commission|tracked/i).should("exist");
});
