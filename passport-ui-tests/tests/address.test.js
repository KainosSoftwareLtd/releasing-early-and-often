const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');
const AddressPage = require('../pages/AddressPage');

describe('Address Page', function () {
  let driver;
  let addressPage;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/address');
    addressPage = new AddressPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the address page', async function () {
    const heading = await addressPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('address');
  });

  it('should allow entering a valid address', async function () {
    await addressPage.enterAddress(
      '10 Downing Street',
      '',
      'London',
      'SW1A 2AA'
    );

    expect(await addressPage.getAddressLine1Value()).to.equal('10 Downing Street');
    expect(await addressPage.getPostcodeValue()).to.equal('SW1A 2AA');
  });

  it('should show error for empty required fields', async function () {
    await addressPage.clickContinue();

    const hasError = await addressPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });

  it('should show error for invalid postcode', async function () {
    await addressPage.enterAddress(
      '10 Downing Street',
      '',
      'London',
      'INVALID'
    );
    await addressPage.clickContinue();

    const hasError = await addressPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });
});
