const { expect } = require('chai');
const { until } = require('selenium-webdriver');
const { createDriver, navigateTo } = require('../support/driver');
const DateOfBirthPage = require('../pages/DateOfBirthPage');
const BasePage = require('../pages/BasePage');

describe('Child Renewals Disabled', function () {
  let driver;
  let dateOfBirthPage;
  let page;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/date-of-birth');
    dateOfBirthPage = new DateOfBirthPage(driver);
    page = new BasePage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should send child applicants to the unavailable page when the flag is off', async function () {
    await dateOfBirthPage.enterDateOfBirth('01', '01', `${new Date().getFullYear() - 10}`);
    await dateOfBirthPage.clickContinue();

    await driver.wait(until.urlContains('/child-unavailable'), 10000);

    const currentUrl = await driver.getCurrentUrl();
    const heading = await page.getPageHeading();

    expect(currentUrl).to.include('/child-unavailable');
    expect(heading.toLowerCase()).to.include('service unavailable');
  });
});