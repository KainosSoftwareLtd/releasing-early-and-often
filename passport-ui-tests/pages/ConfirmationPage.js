const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page object for the Confirmation page.
 */
class ConfirmationPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.confirmationPanel = By.className('govuk-panel--confirmation');
    this.panelTitle = By.className('govuk-panel__title');
    this.panelBody = By.className('govuk-panel__body');
    this.startNewApplicationLink = By.css('a[href="/"]');
  }

  /**
   * Check if confirmation panel is displayed.
   * @returns {Promise<boolean>}
   */
  async isConfirmationPanelDisplayed() {
    try {
      const element = await this.driver.findElement(this.confirmationPanel);
      return element.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the confirmation panel title text.
   * @returns {Promise<string>}
   */
  async getPanelTitle() {
    const element = await this.waitForElement(this.panelTitle);
    return element.getText();
  }

  /**
   * Get the confirmation panel body text (contains reference number).
   * @returns {Promise<string>}
   */
  async getPanelBody() {
    const element = await this.waitForElement(this.panelBody);
    return element.getText();
  }

  /**
   * Get the reference number from the panel.
   * @returns {Promise<string>}
   */
  async getReferenceNumber() {
    const bodyText = await this.getPanelBody();
    // Extract the reference number (typically on a new line after "Your reference number")
    const lines = bodyText.split('\n');
    return lines[lines.length - 1].trim();
  }

  /**
   * Click the Start a new application link.
   */
  async clickStartNewApplication() {
    const link = await this.waitForClickable(this.startNewApplicationLink);
    await link.click();
  }

  /**
   * Check if the "What happens next" section is displayed.
   * @returns {Promise<boolean>}
   */
  async isWhatHappensNextDisplayed() {
    try {
      const headings = await this.driver.findElements(By.className('govuk-heading-m'));
      for (const heading of headings) {
        const text = await heading.getText();
        if (text.includes('What happens next')) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

module.exports = ConfirmationPage;
