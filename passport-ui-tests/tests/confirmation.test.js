const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');
const { completeAndSubmitApplication } = require('../support/journeyHelper');
const ConfirmationPage = require('../pages/ConfirmationPage');

describe('Confirmation Page', function () {
  let driver;
  let confirmationPage;

  beforeEach(async function () {
    driver = await createDriver();
    // Complete and submit the application to reach confirmation page
    await completeAndSubmitApplication(driver);
    confirmationPage = new ConfirmationPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the confirmation panel', async function () {
    const isDisplayed = await confirmationPage.isConfirmationPanelDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('should display "Application complete" title', async function () {
    const title = await confirmationPage.getPanelTitle();
    expect(title.toLowerCase()).to.include('application complete');
  });

  it('should display a reference number', async function () {
    const panelBody = await confirmationPage.getPanelBody();
    expect(panelBody.toLowerCase()).to.include('reference number');
  });

  it('should display "What happens next" section', async function () {
    const isDisplayed = await confirmationPage.isWhatHappensNextDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('should have a link to start a new application', async function () {
    await confirmationPage.clickStartNewApplication();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/date-of-birth'); // Redirects to start of journey
  });
});
