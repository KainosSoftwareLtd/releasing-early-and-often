const { By, until } = require('selenium-webdriver');

/**
 * Base page object class with common helper methods.
 * All page objects should extend this class.
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 10000;
  }

  /**
   * Wait for an element to be visible and return it.
   * @param {By} locator - The element locator
   * @returns {Promise<WebElement>}
   */
  async waitForElement(locator) {
    return this.driver.wait(until.elementLocated(locator), this.timeout);
  }

  /**
   * Wait for an element to be clickable and return it.
   * @param {By} locator - The element locator
   * @returns {Promise<WebElement>}
   */
  async waitForClickable(locator) {
    const element = await this.waitForElement(locator);
    await this.driver.wait(until.elementIsVisible(element), this.timeout);
    return element;
  }

  /**
   * Get the page heading text.
   * @returns {Promise<string>}
   */
  async getPageHeading() {
    const heading = await this.waitForElement(By.css('h1'));
    return heading.getText();
  }

  /**
   * Click the continue button (common GDS pattern).
   */
  async clickContinue() {
    const button = await this.waitForClickable(
      By.css("button[type='submit'], .govuk-button")
    );
    await button.click();
  }

  /**
   * Check if an error summary is displayed.
   * @returns {Promise<boolean>}
   */
  async isErrorSummaryDisplayed() {
    try {
      const errorSummary = await this.driver.findElement(
        By.className('govuk-error-summary')
      );
      return errorSummary.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the error summary text.
   * @returns {Promise<string>}
   */
  async getErrorSummaryText() {
    const errorSummary = await this.waitForElement(
      By.className('govuk-error-summary')
    );
    return errorSummary.getText();
  }
}

module.exports = BasePage;
