const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Address page.
 */
class AddressPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.addressLine1Input = By.id('addressLine1');
    this.addressLine2Input = By.id('addressLine2');
    this.townInput = By.id('townCity');
    this.postcodeInput = By.id('postcode');
  }

  /**
   * Enter the full address.
   * @param {string} line1
   * @param {string} line2
   * @param {string} town
   * @param {string} postcode
   */
  async enterAddress(line1, line2, town, postcode) {
    await this.enterAddressLine1(line1);
    await this.enterAddressLine2(line2);
    await this.enterTown(town);
    await this.enterPostcode(postcode);
    return this;
  }

  /**
   * Enter address line 1.
   * @param {string} line1
   */
  async enterAddressLine1(line1) {
    const input = await this.waitForElement(this.addressLine1Input);
    await input.clear();
    await input.sendKeys(line1);
    return this;
  }

  /**
   * Enter address line 2.
   * @param {string} line2
   */
  async enterAddressLine2(line2) {
    const input = await this.waitForElement(this.addressLine2Input);
    await input.clear();
    await input.sendKeys(line2);
    return this;
  }

  /**
   * Enter town/city.
   * @param {string} town
   */
  async enterTown(town) {
    const input = await this.waitForElement(this.townInput);
    await input.clear();
    await input.sendKeys(town);
    return this;
  }

  /**
   * Enter postcode.
   * @param {string} postcode
   */
  async enterPostcode(postcode) {
    const input = await this.waitForElement(this.postcodeInput);
    await input.clear();
    await input.sendKeys(postcode);
    return this;
  }

  /**
   * Get address line 1 value.
   * @returns {Promise<string>}
   */
  async getAddressLine1Value() {
    const input = await this.driver.findElement(this.addressLine1Input);
    return input.getAttribute('value');
  }

  /**
   * Get postcode value.
   * @returns {Promise<string>}
   */
  async getPostcodeValue() {
    const input = await this.driver.findElement(this.postcodeInput);
    return input.getAttribute('value');
  }
}

module.exports = AddressPage;
