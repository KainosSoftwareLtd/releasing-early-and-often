const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');
const PreviousPassportPage = require('../pages/PreviousPassportPage');

describe('Previous Passport Page', function () {
  let driver;
  let previousPassportPage;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/previous-passport');
    previousPassportPage = new PreviousPassportPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the previous passport page', async function () {
    const heading = await previousPassportPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('passport');
  });

  it('should allow selecting Yes option', async function () {
    await previousPassportPage.selectYes();

    const isSelected = await previousPassportPage.isYesSelected();
    expect(isSelected).to.be.true;
  });

  it('should allow selecting No option', async function () {
    await previousPassportPage.selectNo();

    const isSelected = await previousPassportPage.isNoSelected();
    expect(isSelected).to.be.true;
  });

  it('should show error when no option selected', async function () {
    await previousPassportPage.clickContinue();

    const hasError = await previousPassportPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });
});
