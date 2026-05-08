const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ParentsDetailsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.parent1FullName = By.id('parent1FullName');
    this.parent1Contact = By.id('parent1Contact');
    this.parent2FullName = By.id('parent2FullName');
    this.parent2Contact = By.id('parent2Contact');
  }

  async enterParentDetails(details) {
    await this.enterField(this.parent1FullName, details.parent1FullName);
    await this.enterField(this.parent1Contact, details.parent1Contact);
    await this.enterField(this.parent2FullName, details.parent2FullName || '');
    await this.enterField(this.parent2Contact, details.parent2Contact || '');
    return this;
  }

  async enterField(locator, value) {
    const input = await this.waitForElement(locator);
    await input.clear();
    if (value) {
      await input.sendKeys(value);
    }
  }
}

module.exports = ParentsDetailsPage;