// cypress.config.js
// ✅ FIXED for Cypress 15.x + @badeball/cypress-cucumber-preprocessor v18+
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.AMAZON_URL || "https://www.amazon.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    requestTimeout: 10000,
    responseTimeout: 10000,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    specPattern: "cypress/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,

    // ✅ allowCypressEnv — set to false to suppress security warning
    // allowCypressEnv: false,

    async setupNodeEvents(on, config) {
      // Step 1: Add Cucumber preprocessor plugin (MUST be before bundler)
      await addCucumberPreprocessorPlugin(on, config);

      // Step 2: Add esbuild bundler with Cucumber plugin
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Step 3: Custom tasks
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      return config;
    },
  },

  // Reporter configuration
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    reportFilename: "report",
    overwrite: true,
    html: true,
    json: true,
  },

  // Retry configuration
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
