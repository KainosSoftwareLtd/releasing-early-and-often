const { expect } = require('chai');
const { createDriver, navigateTo } = require('../support/driver');

describe('Child Unavailable Page', function () {
  let driver;

  beforeEach(async function () {
    driver = await createDriver();
    await navigateTo(driver, '/child-unavailable');
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the child unavailable page', async function () {
    const { By } = require('selenium-webdriver');
    const heading = await driver.findElement(By.css('h1'));
    const text = await heading.getText();
    expect(text.toLowerCase()).to.include('cannot use this service');
  });

  it('should display a link back to start', async function () {
    const { By } = require('selenium-webdriver');
    const link = await driver.findElement(By.css('a[href="/"]'));
    expect(link).to.exist;
  });
});
