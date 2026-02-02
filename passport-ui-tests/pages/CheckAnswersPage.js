const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Check Answers page.
 */
class CheckAnswersPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.summaryList = By.className('govuk-summary-list');
    this.submitButton = By.css('button.govuk-button');
    this.changeDateOfBirthLink = By.css('a[href="/date-of-birth"]');
    this.changePreviousPassportLink = By.css('a[href="/previous-passport"]');
    this.changeAddressLink = By.css('a[href="/address"]');
  }

  /**
   * Get the summary list element.
   * @returns {Promise<WebElement>}
   */
  async getSummaryList() {
    return this.waitForElement(this.summaryList);
  }

  /**
   * Check if summary list is displayed.
   * @returns {Promise<boolean>}
   */
  async isSummaryListDisplayed() {
    try {
      const element = await this.driver.findElement(this.summaryList);
      return element.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  /**
   * Get all summary list row values.
   * @returns {Promise<string[]>}
   */
  async getSummaryValues() {
    const rows = await this.driver.findElements(By.className('govuk-summary-list__value'));
    const values = [];
    for (const row of rows) {
      values.push(await row.getText());
    }
    return values;
  }

  /**
   * Click the Change link for date of birth.
   */
  async clickChangeDateOfBirth() {
    const link = await this.waitForClickable(this.changeDateOfBirthLink);
    await link.click();
  }

  /**
   * Click the Change link for previous passport.
   */
  async clickChangePreviousPassport() {
    const link = await this.waitForClickable(this.changePreviousPassportLink);
    await link.click();
  }

  /**
   * Click the Change link for address.
   */
  async clickChangeAddress() {
    const link = await this.waitForClickable(this.changeAddressLink);
    await link.click();
  }

  /**
   * Click the Accept and submit button.
   */
  async clickSubmit() {
    const button = await this.waitForClickable(this.submitButton);
    await button.click();
  }
}

module.exports = CheckAnswersPage;
