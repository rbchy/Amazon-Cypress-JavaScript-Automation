// cypress/support/step_definitions/auth.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const testData = require("../../fixtures/testData.json");
const selectors = require("../../fixtures/selectors.json");

// Two-step login: email form -> password form -> submit
const performLogin = (email, password) => {
  cy.get(selectors.email_input, { timeout: 15000 }).should("be.visible").clear().type(email);
  cy.get(selectors.email_continue).click();
  cy.get(selectors.password_input, { timeout: 15000 }).should("be.visible").clear().type(password);
  cy.get(selectors.signin_submit).click();
};

// ─── Background ────────────────────────────────────────────────────────────

Given("I am on Amazon home page", () => {
  cy.visit("/");
  cy.get(selectors.signin_button, { timeout: 15000 }).first().should("be.visible");
});

Given("I am logged in as {string}", (email) => {
  cy.visit("/");
  cy.get(selectors.signin_button, { timeout: 15000 }).first().click();
  performLogin(email, testData.user.password);
  cy.get(selectors.dashboard, { timeout: 15000 }).should("exist");
});

// ─── Registration Steps ────────────────────────────────────────────────────

When("I click on Sign In button", () => {
  cy.get(selectors.signin_button).first().should("be.visible").click();
  cy.url({ timeout: 15000 }).should("include", "/ap/signin");
});

When("I click on Create Account link", () => {
  cy.contains(/create your amazon account|create account/i, { timeout: 12000 })
    .should("be.visible")
    .click();
  cy.wait(500);
});

When("I enter email {string}", (email) => {
  cy.get(selectors.email_input, { timeout: 12000 }).clear().type(email);
  cy.url().then((url) => {
    if (!url.includes("register")) {
      cy.get(selectors.email_continue).click();
      cy.get(selectors.password_input, { timeout: 15000 }).should("exist");
    }
  });
});

When("I enter name {string}", (name) => {
  cy.get(selectors.name_input, { timeout: 8000 }).clear().type(name);
});

When("I enter password {string}", (password) => {
  cy.get(selectors.password_input, { timeout: 8000 }).clear().type(password);
});

When("I confirm password {string}", (password) => {
  cy.get(selectors.confirm_password_input, { timeout: 8000 }).clear().type(password);
});

When("I click Create Account button", () => {
  cy.get(selectors.create_account_button).first().click();
  cy.wait(1000);
});

Then("I should see account created message", () => {
  cy.contains(/account created|successfully|welcome/i, { timeout: 12000 }).should("be.visible");
});

Then("I should be logged in to dashboard", () => {
  cy.get(selectors.dashboard, { timeout: 12000 }).should("exist");
});

Then("I should see {string} message", (message) => {
  cy.contains(message, { matchCase: false, timeout: 10000 }).should("be.visible");
});

// ─── Login Steps ───────────────────────────────────────────────────────────

When("I click Sign In button", () => {
  cy.get(selectors.signin_submit).click();
});

Then("I should be logged in successfully", () => {
  cy.get(selectors.dashboard, { timeout: 15000 }).should("exist");
});

Then("I should see dashboard", () => {
  cy.get(selectors.dashboard, { timeout: 10000 }).should("be.visible");
});

Then("I should see account menu with my email", () => {
  cy.get(selectors.account_menu).first().should("exist");
});

Then("I should remain on login page", () => {
  cy.get(selectors.error_message, { timeout: 10000 }).should("exist");
});

Then("I should see error message {string}", (errorMsg) => {
  cy.get(selectors.error_message, { timeout: 12000 }).should("be.visible");
});

// ─── Logout Steps ──────────────────────────────────────────────────────────

When("I click on Account & Lists menu", () => {
  cy.get(selectors.account_menu).first().should("be.visible").click();
});

When("I click on Sign Out option", () => {
  cy.contains("Sign Out", { timeout: 10000 }).should("be.visible").click();
});

Then("I should be logged out successfully", () => {
  cy.get(selectors.signin_button, { timeout: 12000 }).first().should("exist");
});

Then("I should see Sign In button", () => {
  cy.get(selectors.signin_button).first().should("be.visible");
});

Then("I should be redirected to home page", () => {
  cy.get(selectors.dashboard, { timeout: 12000 }).should("exist");
});

Then("I try to access account page directly", () => {
  cy.visit("/gp/css/homepage.html");
});

Then("I should be redirected to login page", () => {
  cy.url({ timeout: 12000 }).should("include", "signin");
});

// ─── Remember Me Steps ─────────────────────────────────────────────────────

When("I check Remember Me checkbox", () => {
  cy.get(selectors.remember_me_checkbox, { timeout: 10000 })
    .should("exist")
    .check({ force: true });
});

Then("my email should be pre-filled on next login attempt", () => {
  cy.visit("/ap/signin");
  cy.get(selectors.email_input).should("exist");
});

// ─── Two-Factor Authentication Steps ───────────────────────────────────────

When("I go to Account Settings", () => {
  cy.visit("/gp/account");
});

When("I click on Security Settings", () => {
  cy.contains(/login.*security|security|Two-step/i, { timeout: 10000 }).should("exist");
});

When("I enable Two-Factor Authentication", () => {
  cy.contains(/two-step verification|two-factor|Enable|Get started/i, { timeout: 10000 }).should("exist");
});

When("I verify with phone number {string}", (phone) => {
  cy.get(selectors.phone_input, { timeout: 10000 }).should("exist").clear().type(phone);
});

Then("I should receive OTP on login attempts", () => {
  cy.contains(/otp|verification code|one-time password/i, { timeout: 10000 }).should("be.visible");
});

// ─── Exports ───────────────────────────────────────────────────────────────

export const loginUser = (email = testData.user.email) => {
  cy.get(selectors.signin_button).first().click();
  performLogin(email, testData.user.password);
};
