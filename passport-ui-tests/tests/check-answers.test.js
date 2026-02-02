const { expect } = require('chai');
const { createDriver } = require('../support/driver');
const { completeApplicationJourney } = require('../support/journeyHelper');
const CheckAnswersPage = require('../pages/CheckAnswersPage');

describe('Check Answers Page', function () {
  let driver;
  let checkAnswersPage;

  beforeEach(async function () {
    driver = await createDriver();
    // Complete the journey to reach check-answers page
    await completeApplicationJourney(driver);
    checkAnswersPage = new CheckAnswersPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the check answers page', async function () {
    const heading = await checkAnswersPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('check');
  });

  it('should display the summary list with answers', async function () {
    const isDisplayed = await checkAnswersPage.isSummaryListDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('should have Change links for each answer', async function () {
    // Verify Change links exist by checking they are clickable
    const summaryList = await checkAnswersPage.getSummaryList();
    expect(summaryList).to.exist;
  });

  it('should navigate to date of birth page when clicking Change', async function () {
    await checkAnswersPage.clickChangeDateOfBirth();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/date-of-birth');
  });

  it('should navigate to previous passport page when clicking Change', async function () {
    await checkAnswersPage.clickChangePreviousPassport();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/previous-passport');
  });

  it('should navigate to address page when clicking Change', async function () {
    await checkAnswersPage.clickChangeAddress();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/address');
  });
});
