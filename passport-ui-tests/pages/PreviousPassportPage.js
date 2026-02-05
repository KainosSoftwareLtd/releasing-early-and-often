const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Previous Passport page.
 */
class PreviousPassportPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators - GDS radios: click the label since input is visually hidden
    this.yesRadioLabel = By.css('label[for="previous-passport"]');
    this.noRadioLabel = By.css('label[for="previous-passport-2"]');
    this.yesRadio = By.id('previous-passport');
    this.noRadio = By.id('previous-passport-2');
  }

  /**
   * Select "Yes" for having a previous passport.
   */
  async selectYes() {
    const label = await this.waitForClickable(this.yesRadioLabel);
    await label.click();
    return this;
  }

  /**
   * Select "No" for not having a previous passport.
   */
  async selectNo() {
    const label = await this.waitForClickable(this.noRadioLabel);
    await label.click();
    return this;
  }

  /**
   * Check if the Yes radio is selected.
   * @returns {Promise<boolean>}
   */
  async isYesSelected() {
    const radio = await this.driver.findElement(this.yesRadio);
    return radio.isSelected();
  }

  /**
   * Check if the No radio is selected.
   * @returns {Promise<boolean>}
   */
  async isNoSelected() {
    const radio = await this.driver.findElement(this.noRadio);
    return radio.isSelected();
  }
}

module.exports = PreviousPassportPage;
