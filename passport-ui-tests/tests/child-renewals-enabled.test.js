const { expect } = require('chai');
const { until } = require('selenium-webdriver');
const frontendConfig = require('../../passport-frontend/config/config.json');
const { createDriver } = require('../support/driver');
const { completeAndSubmitApplication } = require('../support/journeyHelper');
const ParentsDetailsPage = require('../pages/ParentsDetailsPage');
const ConfirmationPage = require('../pages/ConfirmationPage');

describe('Child Renewals Enabled', function () {
  let driver;

  before(function () {
    if (!frontendConfig.featureFlags.enabledChildRenewals) {
      this.skip();
    }
  });

  beforeEach(async function () {
    driver = await createDriver();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should show the parent details step for a child applicant', async function () {
    const { navigateTo } = require('../support/driver');
    const DateOfBirthPage = require('../pages/DateOfBirthPage');

    await navigateTo(driver, '/date-of-birth');
    const dateOfBirthPage = new DateOfBirthPage(driver);
    await dateOfBirthPage.enterDateOfBirth('01', '01', `${new Date().getFullYear() - 10}`);
    await dateOfBirthPage.clickContinue();

    await driver.wait(until.urlContains('/parents-details'), 10000);

    const parentsDetailsPage = new ParentsDetailsPage(driver);
    const heading = await parentsDetailsPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('parent details');
  });

  it('should complete the child journey and receive a non-fallback confirmation reference', async function () {
    await completeAndSubmitApplication(driver, {
      childApplication: true,
      day: '01',
      month: '01',
      year: `${new Date().getFullYear() - 10}`,
      hasPreviousPassport: false,
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com',
      parent2FullName: 'Sam Example',
      parent2Contact: 'sam@example.com'
    });

    await driver.wait(until.urlContains('/confirmation'), 10000);

    const confirmationPage = new ConfirmationPage(driver);
    const referenceNumber = await confirmationPage.getReferenceNumber();

    expect(await confirmationPage.isConfirmationPanelDisplayed()).to.be.true;
    expect(referenceNumber).to.not.match(/^TEMP-/);
  });
});