const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Parents/Guardian Details page.
 */
class ParentsDetailsPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.parent1FullNameInput = By.id('parent1FullName');
    this.parent1ContactInput = By.id('parent1Contact');
    this.parent2FullNameInput = By.id('parent2FullName');
    this.parent2ContactInput = By.id('parent2Contact');
  }

  async enterParent1FullName(name) {
    const input = await this.waitForElement(this.parent1FullNameInput);
    await input.clear();
    await input.sendKeys(name);
    return this;
  }

  async enterParent1Contact(email) {
    const input = await this.waitForElement(this.parent1ContactInput);
    await input.clear();
    await input.sendKeys(email);
    return this;
  }

  async enterParent2FullName(name) {
    const input = await this.waitForElement(this.parent2FullNameInput);
    await input.clear();
    await input.sendKeys(name);
    return this;
  }

  async enterParent2Contact(email) {
    const input = await this.waitForElement(this.parent2ContactInput);
    await input.clear();
    await input.sendKeys(email);
    return this;
  }

  async enterParentDetails(parent1FullName, parent1Contact, parent2FullName = '', parent2Contact = '') {
    await this.enterParent1FullName(parent1FullName);
    await this.enterParent1Contact(parent1Contact);
    if (parent2FullName) await this.enterParent2FullName(parent2FullName);
    if (parent2Contact) await this.enterParent2Contact(parent2Contact);
    return this;
  }

  async getParent1FullNameValue() {
    const input = await this.driver.findElement(this.parent1FullNameInput);
    return input.getAttribute('value');
  }

  async getParent1ContactValue() {
    const input = await this.driver.findElement(this.parent1ContactInput);
    return input.getAttribute('value');
  }
}

module.exports = ParentsDetailsPage;
