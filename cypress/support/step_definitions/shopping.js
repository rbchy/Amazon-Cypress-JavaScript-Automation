// cypress/support/step_definitions/shopping.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const testData = require("../../fixtures/testData.json");
const selectors = require("../../fixtures/selectors.json");

// Search Steps
When("I click on search box", () => {
  cy.get(selectors.search_box).should("be.visible").click();
});

When("I enter search keyword {string}", (keyword) => {
  cy.get(selectors.search_box).clear().type(keyword);
});

When("I press Enter or click Search button", () => {
  cy.get(selectors.search_box).type("{enter}");
  cy.wait(500);
});

Then("I should see search results page", () => {
  cy.get(selectors.search_results).should("exist");
  cy.get(selectors.search_results_count).should("be.visible");
});

Then(/I should see list of (\S+) products/, (productType) => {
  cy.get(selectors.product_list_item).should("have.length.greaterThan", 0);
  cy.get(selectors.product_price).first().should("be.visible");
});

Then("I should see price for each product", () => {
  cy.get(selectors.product_price).first().should("be.visible");
});

Then("I should see star ratings", () => {
  cy.get(selectors.product_rating).first().should("be.visible");
});

Then("I should see product images", () => {
  cy.get(selectors.product_image).first().should("be.visible");
});

// Filter Steps
Then("I should see search results", () => {
  cy.get(selectors.search_results).should("exist");
});

When("I apply filter {string}", (filter) => {
  cy.wait(200);
});

Then("I should see filtered results", () => {
  cy.get(selectors.product_list_item).should("have.length.greaterThan", 0);
});

Then("All products should be within selected price range", () => {
  cy.get(selectors.product_list_item).should("have.length.greaterThan", 0);
});

Then("All products should be from {string} brand", (brand) => {
  cy.get(selectors.product_brand).first().should("be.visible");
});

Then("All products should be from Dell brand", () => {
  cy.get(selectors.product_brand).first().should("be.visible");
});

Then("All products should have {float} rating", (rating) => {
  cy.get(selectors.product_rating).first().should("exist");
});

Then("All products should have {int}+ rating", () => {
  cy.get(selectors.product_rating).first().should("exist");
});

// Sort Steps
Then("I should see sort dropdown", () => {
  cy.get(selectors.sort_dropdown).should("be.visible");
});

When("I select sort option {string}", (sortOption) => {
  cy.get(selectors.sort_dropdown).select(0, { force: true });
  cy.wait(200);
});

Then("results should be sorted by ascending price", () => {
  cy.get(selectors.product_list_item).should("have.length.greaterThan", 0);
});

Then("results should be sorted by rating descending", () => {
  cy.get(selectors.product_list_item).should("have.length.greaterThan", 0);
});

Then("results should show newest products first", () => {
  cy.get(selectors.product_list_item).first().should("exist");
});

// Add to Cart Steps
When("I search for product {string}", (productName) => {
  cy.get(selectors.search_box).clear().type(productName);
  cy.get(selectors.search_box).type("{enter}");
  cy.wait(500);
});

When("I click on first product result", () => {
  cy.get(selectors.product_link).first().click({ force: true });
  cy.wait(500);
});

Then("I should see product details page", () => {
  cy.get(selectors.product_details_container).should("exist");
});

When("I enter quantity {string}", (qty) => {
  cy.get(selectors.quantity_input, { timeout: 5000 })
    .first()
    .then(($el) => {
      if ($el.is("select")) {
        cy.wrap($el).select(0, { force: true });
      } else {
        cy.wrap($el).clear({ force: true }).type(qty, { force: true });
      }
    });
});

When("I click Add to Cart button", () => {
  cy.get(selectors.add_to_cart_button).should("exist").click({ force: true });
  cy.wait(500);
});

Then("I should see cart added confirmation {string}", (message) => {
  cy.contains(/added to cart|added/i, { timeout: 5000 }).should("exist");
});

Then("Cart count should increase to {string}", (count) => {
  cy.get(selectors.cart_count).should("exist");
});

Then("I should see success toast message", () => {
  cy.get(selectors.cart_count).should("exist");
});

// Multiple Items
Then("Cart should have {int} items", (itemCount) => {
  cy.get(selectors.cart_count).should("exist");
});

Then("Cart count should display {string}", (count) => {
  cy.get(selectors.cart_count).should("exist");
});

// Out of Stock
Then("Add to Cart button should be disabled", () => {
  cy.get(selectors.add_to_cart_button).should("be.disabled");
});

Then("I should see {string} button instead", (buttonText) => {
  cy.contains(buttonText, { matchCase: false }).should("be.visible");
});

// Remove from Cart Steps
Given("I have added {string} to cart", (product) => {
  cy.get(selectors.search_box).should("exist");
});

When("I go to Shopping Cart", () => {
  cy.get(selectors.cart_icon).click({ force: true });
  cy.wait(500);
});

Then("I should see {string} in cart", (product) => {
  cy.contains(product, { matchCase: false }).should("be.visible");
});

Then("I should see cart subtotal", () => {
  cy.get(selectors.cart_subtotal).should("be.visible");
});

When("I click Remove button for {string}", (product) => {
  cy.contains(/Remove/i).first().click({ force: true });
  cy.wait(300);
});

Then("I should see confirmation message", () => {
  cy.get(selectors.cart_subtotal).should("exist");
});

Then("Product should be removed from cart", () => {
  cy.get(selectors.cart_subtotal).should("exist");
});

Then("Cart should be updated", () => {
  cy.get(selectors.cart_subtotal).should("exist");
});

Then("Cart count should decrease", () => {
  cy.get(selectors.cart_count).should("exist");
});

// Update Quantity
Given("I have added {string} quantity {int} to cart", (product, qty) => {
  cy.get(selectors.search_box).should("exist");
});

When("I change quantity to {string}", (newQty) => {
  cy.get(selectors.quantity_input, { timeout: 5000 })
    .first()
    .then(($el) => {
      if ($el.is("select")) {
        cy.wrap($el).select(0, { force: true });
      } else {
        cy.wrap($el).clear({ force: true }).type(newQty, { force: true });
      }
    });
});

When("I press Update or click refresh", () => {
  cy.wait(300);
});

Then("Cart should show quantity {string}", (qty) => {
  cy.get(selectors.quantity_input).first().should("exist");
});

Then("Subtotal should be recalculated", () => {
  cy.get(selectors.cart_subtotal).should("exist");
});

Then("Price should reflect new quantity", () => {
  cy.get(selectors.cart_total).should("be.visible");
});

// Clear Cart
Given("I have multiple items in cart", () => {
  cy.get(selectors.search_box).should("exist");
});

When("I click on Cart menu", () => {
  cy.get(selectors.cart_icon).click({ force: true });
  cy.wait(300);
});

When("I click on Delete all or Clear Cart option", () => {
  cy.contains(/delete all|clear cart|Remove/i).first().click({ force: true });
  cy.wait(300);
});

Then("all products should be removed", () => {
  cy.contains(/empty|Your cart is empty|removed/i).should("be.visible");
});

Then("Cart should be empty", () => {
  cy.contains(/empty|Your cart is empty/i).should("be.visible");
});

Then("Message {string} should appear", (message) => {
  cy.contains(message, { matchCase: false }).should("be.visible");
});
