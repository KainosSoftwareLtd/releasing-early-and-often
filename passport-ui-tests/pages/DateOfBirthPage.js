const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Date of Birth page.
 */
class DateOfBirthPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators - GDS date input uses id-day, id-month, id-year pattern
    this.dayInput = By.id('dob-day');
    this.monthInput = By.id('dob-month');
    this.yearInput = By.id('dob-year');
  }

  /**
   * Enter the date of birth.
   * @param {string} day
   * @param {string} month
   * @param {string} year
   */
  async enterDateOfBirth(day, month, year) {
    await this.enterDay(day);
    await this.enterMonth(month);
    await this.enterYear(year);
    return this;
  }

  /**
   * Enter the day.
   * @param {string} day
   */
  async enterDay(day) {
    const input = await this.waitForElement(this.dayInput);
    await input.clear();
    await input.sendKeys(day);
    return this;
  }

  /**
   * Enter the month.
   * @param {string} month
   */
  async enterMonth(month) {
    const input = await this.waitForElement(this.monthInput);
    await input.clear();
    await input.sendKeys(month);
    return this;
  }

  /**
   * Enter the year.
   * @param {string} year
   */
  async enterYear(year) {
    const input = await this.waitForElement(this.yearInput);
    await input.clear();
    await input.sendKeys(year);
    return this;
  }

  /**
   * Get the current day value.
   * @returns {Promise<string>}
   */
  async getDayValue() {
    const input = await this.driver.findElement(this.dayInput);
    return input.getAttribute('value');
  }

  /**
   * Get the current month value.
   * @returns {Promise<string>}
   */
  async getMonthValue() {
    const input = await this.driver.findElement(this.monthInput);
    return input.getAttribute('value');
  }

  /**
   * Get the current year value.
   * @returns {Promise<string>}
   */
  async getYearValue() {
    const input = await this.driver.findElement(this.yearInput);
    return input.getAttribute('value');
  }
}

module.exports = DateOfBirthPage;
