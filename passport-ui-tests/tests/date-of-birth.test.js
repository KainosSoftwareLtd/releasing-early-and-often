const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');
const DateOfBirthPage = require('../pages/DateOfBirthPage');

describe('Date of Birth Page', function () {
  let driver;
  let dateOfBirthPage;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/date-of-birth');
    dateOfBirthPage = new DateOfBirthPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the date of birth page', async function () {
    const heading = await dateOfBirthPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('date of birth');
  });

  it('should allow entering a valid date of birth', async function () {
    await dateOfBirthPage.enterDateOfBirth('15', '06', '1990');

    expect(await dateOfBirthPage.getDayValue()).to.equal('15');
    expect(await dateOfBirthPage.getMonthValue()).to.equal('06');
    expect(await dateOfBirthPage.getYearValue()).to.equal('1990');
  });

  it('should show error for empty date of birth', async function () {
    await dateOfBirthPage.clickContinue();

    const hasError = await dateOfBirthPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });

  it('should show error for invalid date', async function () {
    await dateOfBirthPage.enterDateOfBirth('32', '13', '1990');
    await dateOfBirthPage.clickContinue();

    const hasError = await dateOfBirthPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });

  it('should show error for future date', async function () {
    await dateOfBirthPage.enterDateOfBirth('01', '01', '2030');
    await dateOfBirthPage.clickContinue();

    const hasError = await dateOfBirthPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });
});
