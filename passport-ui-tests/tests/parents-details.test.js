const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');
const ParentsDetailsPage = require('../pages/ParentsDetailsPage');

describe('Parents Details Page', function () {
  let driver;
  let parentsDetailsPage;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/parents-details');
    parentsDetailsPage = new ParentsDetailsPage(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the parents details page', async function () {
    const heading = await parentsDetailsPage.getPageHeading();
    expect(heading.toLowerCase()).to.include('parent');
  });

  it('should allow entering parent 1 details', async function () {
    await parentsDetailsPage.enterParent1FullName('Jane Smith');
    await parentsDetailsPage.enterParent1Contact('jane@example.com');

    expect(await parentsDetailsPage.getParent1FullNameValue()).to.equal('Jane Smith');
    expect(await parentsDetailsPage.getParent1ContactValue()).to.equal('jane@example.com');
  });

  it('should show error when required parent 1 fields are missing', async function () {
    await parentsDetailsPage.clickContinue();

    const hasError = await parentsDetailsPage.isErrorSummaryDisplayed();
    expect(hasError).to.be.true;
  });

  it('should proceed to next page when valid details are entered', async function () {
    await parentsDetailsPage.enterParentDetails('Jane Smith', 'jane@example.com');
    await parentsDetailsPage.clickContinue();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/previous-passport');
  });

  it('should allow proceeding without optional parent 2 details', async function () {
    await parentsDetailsPage.enterParent1FullName('Jane Smith');
    await parentsDetailsPage.enterParent1Contact('jane@example.com');
    await parentsDetailsPage.clickContinue();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/previous-passport');
  });

  it('should accept both parent 1 and parent 2 details', async function () {
    await parentsDetailsPage.enterParentDetails(
      'Jane Smith', 'jane@example.com',
      'John Smith', 'john@example.com'
    );
    await parentsDetailsPage.clickContinue();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/previous-passport');
  });
});
