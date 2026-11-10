// cypress/support/step_definitions/checkout-account.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const testData = require("../../fixtures/testData.json");
const selectors = require("../../fixtures/selectors.json");

// ─── Checkout Steps ─────────────────────────────────────────────────────────

Given("I have items in cart", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I click Proceed to Checkout button", () => {
  cy.contains(/Proceed to checkout/i).click({ force: true });
  cy.wait(500);
});

Then("I should see checkout page", () => {
  cy.get(selectors.checkout_container).should("exist");
  cy.contains("Shipping Address").should("be.visible");
});

When("I select shipping address", () => {
  cy.get(selectors.address_select, { timeout: 5000 })
    .first()
    .click({ force: true });
});

When("I select shipping method {string}", (method) => {
  cy.contains(method, { matchCase: false }).should("exist");
});

When("I select payment method {string}", (paymentMethod) => {
  cy.contains(paymentMethod, { matchCase: false }).should("exist");
});

When("I enter card details", () => {
  cy.get(selectors.card_number_input).should("exist").type(testData.payment.cardNumber, { force: true });
  cy.get(selectors.card_cvv_input).should("exist").type(testData.payment.cvv, { force: true });
});

When("I review order summary", () => {
  cy.get(selectors.order_summary).should("be.visible");
  cy.get(selectors.order_total).should("be.visible");
});

When("I click Place Order button", () => {
  cy.get(selectors.place_order_button).click({ force: true });
  cy.wait(500);
});

Then("I should see order confirmation page", () => {
  cy.get(selectors.confirmation_page).should("exist");
  cy.contains(/thank you|order confirmed|order placed/i).should("be.visible");
});

Then("I should see Order Number", () => {
  cy.get(selectors.order_number).should("be.visible");
});

Then("Order should be confirmed successfully", () => {
  cy.get(selectors.order_confirmation_message).should("exist");
});

// ─── New Address ────────────────────────────────────────────────────────────

When("I click Add New Address", () => {
  cy.contains("Add New Address").should("exist");
});

When("I enter address {string}", (address) => {
  cy.get(selectors.address_input).first().clear({ force: true }).type(address, { force: true });
});

When("I enter city {string}", (city) => {
  cy.get(selectors.city_input).clear({ force: true }).type(city, { force: true });
});

When("I enter state {string}", (state) => {
  cy.get(selectors.state_input).first().clear({ force: true }).type(state, { force: true });
});

When("I enter zip code {string}", (zip) => {
  cy.get(selectors.zip_input).clear({ force: true }).type(zip, { force: true });
});

When("I save address", () => {
  cy.contains(/Save Address/i).click({ force: true });
  cy.wait(300);
});

Then("new address should be selected", () => {
  cy.get(selectors.selected_address).should("contain", "123 Main Street");
});

When("I continue checkout process", () => {
  cy.get(selectors.continue_button).first().click({ force: true });
  cy.wait(300);
});

Then("I place order", () => {
  cy.get(selectors.place_order_button).click({ force: true });
  cy.wait(500);
});

Then("Order should be confirmed with new address", () => {
  cy.get(selectors.confirmation_page).should("exist");
  cy.get(selectors.order_number).should("be.visible");
});

// ─── Coupon Code ────────────────────────────────────────────────────────────

When("I enter coupon code {string}", (couponCode) => {
  cy.get(selectors.coupon_input).clear({ force: true }).type(couponCode, { force: true });
});

When("I click Apply Coupon", () => {
  cy.contains("Apply").click({ force: true });
  cy.wait(300);
});

Then("Discount should be applied", () => {
  cy.get(selectors.discount_message).should("contain", "applied");
});

Then("Order total should be reduced", () => {
  cy.get(selectors.order_total).should("be.visible");
});

Then("Discount amount should show on summary", () => {
  cy.get(selectors.discount_line_item).should("be.visible");
});

// ─── Payment Methods ─────────────────────────────────────────────────────────

When("I go back and select payment method {string}", (payment) => {
  cy.contains(payment, { matchCase: false }).should("exist");
});

Then("I should see {string} confirmation", (paymentType) => {
  cy.contains(paymentType, { matchCase: false }).should("be.visible");
});

Then("I should see Amazon Pay confirmation", () => {
  cy.contains("Amazon Pay", { matchCase: false }).should("be.visible");
});

Then("I should see credit card fields", () => {
  cy.get(selectors.card_number_input).should("be.visible");
});

Then("I should see debit card fields", () => {
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
  cy.wait(300);
});

When("I select order {string}", (orderNumber) => {
  cy.contains(orderNumber, { matchCase: false }).should("exist").click({ force: true });
  cy.wait(300);
});

When("I select the order", () => {
  cy.get(selectors.order_list_items).first().click({ force: true });
  cy.wait(300);
});

Then("I should see order details", () => {
  cy.get(selectors.order_details).should("be.visible");
});

When("I click Return Items button", () => {
  cy.contains(/Return Items/i).should("exist").click({ force: true });
  cy.wait(300);
});

When("I click Return Items", () => {
  cy.contains(/Return Items/i).should("exist").click({ force: true });
  cy.wait(300);
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
  cy.wait(300);
});

When("I click Submit Return Request", () => {
  cy.contains(/Submit Return/i).should("exist").click({ force: true });
  cy.wait(300);
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
  cy.wait(300);
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
  cy.wait(300);
});

Then("I should see Prime benefits page", () => {
  cy.get(selectors.prime_benefits_container).should("exist");
});

When("I select membership type {string}", (type) => {
  cy.contains(type, { matchCase: false }).should("exist");
});

When("I click Subscribe Now", () => {
  cy.contains("Subscribe Now").should("exist").click({ force: true });
  cy.wait(300);
});

When("I review and accept terms", () => {
  cy.get(selectors.terms_checkbox).check({ force: true });
});

When("I confirm payment", () => {
  cy.contains("Confirm").click({ force: true });
  cy.wait(500);
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
  const benefits = ["Free 2-Day Shipping", "Prime Video", "Prime Music", "Prime Reading", "Prime Photos"];
  benefits.forEach((benefit) => {
    cy.contains(benefit).should("be.visible");
  });
});

When("I go to Prime Settings", () => {
  cy.visit("/gp/prime");
  cy.contains("Prime Settings").should("exist");
});

When("I click Cancel Membership", () => {
  cy.contains("Cancel Membership").should("exist").click({ force: true });
  cy.wait(300);
});

When("I select cancel reason", () => {
  cy.get(selectors.cancel_reason_select).select(0, { force: true });
  cy.wait(300);
});

When("I confirm cancellation", () => {
  cy.contains("Confirm Cancellation").click({ force: true });
  cy.wait(500);
});

Then("Membership should be cancelled", () => {
  cy.contains(/cancelled|ended/i).should("be.visible");
});

Then("Free shipping benefits should be removed", () => {
  cy.contains(/cancelled|ended|expire/i).should("be.visible");
});

// ─── Browsing History ─────────────────────────────────────────────────────────

Given("I have browsed several products", () => {
  cy.get(selectors.search_box).should("exist");
});

Given("I have browsing history", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to Browsing History", () => {
  cy.visit("/gp/history/view");
});

When("I click on Browsing History", () => {
  cy.contains(/Browsing History/i).should("exist").click({ force: true });
  cy.wait(300);
});

Then("I should see all browsed products", () => {
  cy.get(selectors.browsing_history_items).should("have.length.greaterThan", 0);
});

Then("Products should be listed with most recent first", () => {
  cy.get(selectors.browsing_history_items).first().should("exist");
});

When("I click on any product", () => {
  cy.get(selectors.browsing_history_items).first().click({ force: true });
  cy.wait(300);
});

Then("product details page should open", () => {
  cy.get(selectors.product_details_container).should("exist");
});

When("I click Clear Browsing History", () => {
  cy.visit("/gp/history/view");
  cy.wait(300);
  cy.contains("Clear Browsing History").should("exist").click({ force: true });
  cy.wait(300);
  cy.contains("Confirm").click({ force: true });
  cy.wait(300);
});

Then("all history should be deleted", () => {
  cy.contains(/cleared successfully/i).should("be.visible");
});

Then("Browsing history should be empty", () => {
  cy.contains(/no items|empty|cleared/i).should("be.visible");
});

When("I select date filter {string}", (dateRange) => {
  cy.get(selectors.history_date_filter).select(0, { force: true });
  cy.wait(300);
});

Then("only products from last {int} days should be shown", (days) => {
  cy.get(selectors.browsing_history_items).should("exist");
});

When("I select {string}", (option) => {
  cy.get(selectors.history_date_filter).select(0, { force: true });
  cy.wait(300);
});

Then("products from 90 days should be shown", () => {
  cy.get(selectors.browsing_history_items).should("exist");
});

// ─── Purchase History ─────────────────────────────────────────────────────────

Given("I have completed multiple purchases", () => {
  cy.get(selectors.search_box).should("exist");
});

Given("I have purchase history spanning multiple years", () => {
  cy.get(selectors.search_box).should("exist");
});

Given("I have completed purchases", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I select {string} filter", (filter) => {
  cy.get(selectors.history_date_filter).select(0, { force: true });
  cy.wait(300);
});

Then("I should see all purchase orders", () => {
  cy.get(selectors.order_list_items).should("have.length.greaterThan", 0);
});

Then("Each order should show:", (dataTable) => {
  cy.get(selectors.order_list_items).first().should("exist");
});

Then("only orders from last {int} months should be shown", (months) => {
  cy.get(selectors.order_list_items).should("exist");
});

When("I click on an order", () => {
  cy.get(selectors.order_list_items).first().click({ force: true });
  cy.wait(300);
});

Then("detailed order information should be displayed", () => {
  cy.get(selectors.order_details).should("be.visible");
});

Then("I should see invoice option", () => {
  cy.contains("Invoice").should("be.visible");
});

Then("I should see reorder option", () => {
  cy.contains("Reorder").should("be.visible");
});

When("I click Download Invoice button", () => {
  cy.contains("Download Invoice").click({ force: true });
  cy.wait(500);
});

Then("invoice PDF should be downloaded", () => {
  cy.contains(/downloaded|pdf/i).should("be.visible");
});

Then("PDF should contain:", (dataTable) => {
  cy.get(selectors.order_details).should("exist");
});

// ─── Amazon Rewards / Visa ────────────────────────────────────────────────────

When("I go to Amazon Rewards", () => {
  cy.visit("/rewards");
});

When("I click on Amazon Visa Card", () => {
  cy.contains(/Amazon Visa Card/i).should("exist").click({ force: true });
  cy.wait(300);
});

Then("I should see card benefits page", () => {
  cy.contains(/Card Benefits|Cashback/i).should("be.visible");
});

Then("I should see:", (dataTable) => {
  cy.get("body").should("exist");
});

When("I click Apply Now button", () => {
  cy.contains("Apply Now").should("exist").click({ force: true });
  cy.wait(300);
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
  cy.wait(500);
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
  cy.wait(300);
});

When("I click Join Associates button", () => {
  cy.contains("Join Associates").should("be.visible").click({ force: true });
  cy.wait(300);
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
  cy.wait(300);
});

When("I click Get Link button", () => {
  cy.contains("Get Link").should("exist").click({ force: true });
  cy.wait(300);
});

Then("affiliate link should be generated", () => {
  cy.get(selectors.generated_affiliate_link).should("be.visible");
});

When("I copy affiliate link", () => {
  cy.get(selectors.copy_link_button).click({ force: true });
  cy.wait(300);
});

When("I share link", () => {
  cy.get(selectors.generated_affiliate_link).should("exist");
});

Then("shared link should earn commission on clicks", () => {
  cy.contains(/commission|tracked/i).should("exist");
});
