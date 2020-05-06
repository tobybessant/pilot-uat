// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 20000,

  // -- setup peripherals
  // https://www.selenium.dev/downloads/
  seleniumServerJar: "./peripherals/selenium-server-standalone-3.9.1.jar",
  // https://sites.google.com/a/chromium.org/chromedriver/
  chromeDriver:"./peripherals/chromedriver_83",

  specs: [
    "./test/**/*.e2e-spec.ts"
  ],
  capabilities: {
    browserName: "chrome"
  },
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.json")
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};