const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config');

/**
 * Create and configure a WebDriver instance.
 * @returns {Promise<WebDriver>} Configured WebDriver instance
 */
async function createDriver() {
  const options = new chrome.Options();

  if (config.headless) {
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
  }

  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: config.timeout.implicit,
    pageLoad: config.timeout.pageLoad
  });

  return driver;
}

/**
 * Navigate to a page relative to the base URL.
 * @param {WebDriver} driver - The WebDriver instance
 * @param {string} path - The path to navigate to
 */
async function navigateTo(driver, path) {
  await driver.get(`${config.baseUrl}${path}`);
}

module.exports = {
  createDriver,
  navigateTo
};
