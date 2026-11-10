// cypress.config.js
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
  projectId: 'ptk1hs',
  e2e: {
    baseUrl: process.env.AMAZON_URL || "https://www.amazon.com",
    viewportWidth: 1440,
    viewportHeight: 900,
    requestTimeout: 15000,
    responseTimeout: 15000,
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 60000,
    specPattern: "cypress/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,
    allowCypressEnv: true,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

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

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    reportFilename: "report",
    overwrite: true,
    html: true,
    json: true,
  },

  retries: {
    runMode: 1,
    openMode: 0,
  },
});
