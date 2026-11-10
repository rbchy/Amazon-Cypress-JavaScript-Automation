// scripts/generate-report.js
// Generates a rich multiple-cucumber-html-reporter report from the
// Cucumber JSON output produced by @badeball/cypress-cucumber-preprocessor.

const report = require("multiple-cucumber-html-reporter");
const path = require("path");
const fs = require("fs");

const jsonDir = path.join(__dirname, "../cypress/results/cucumber-json");
const jsonFile = path.join(jsonDir, "cucumber-report.json");

if (!fs.existsSync(jsonFile)) {
  console.error(
    "❌  cucumber-report.json not found. Run `npx cypress run` first."
  );
  process.exit(1);
}

report.generate({
  jsonDir,
  reportPath: path.join(__dirname, "../cypress/results/cucumber-html-report"),
  metadata: {
    browser: { name: "chrome", version: "latest" },
    device: "Local Machine",
    platform: { name: "macOS" },
  },
  customData: {
    title: "Amazon Automation – Test Run Info",
    data: [
      { label: "Project", value: "Amazon Cypress BDD" },
      { label: "Release", value: "1.0.0" },
      { label: "Executed by", value: "RB Chowdhury" },
    ],
  },
  pageTitle: "Amazon BDD Test Report",
  reportName: "Amazon Cypress Cucumber Report",
  displayDuration: true,
  durationInMS: true,
});

console.log(
  "✅  Rich HTML report generated → cypress/results/cucumber-html-report/index.html"
);
console.log(
  "✅  Native Cucumber HTML report → cypress/results/cucumber-report.html"
);
