const { navigateTo } = require('./driver');
const DateOfBirthPage = require('../pages/DateOfBirthPage');
const PreviousPassportPage = require('../pages/PreviousPassportPage');
const AddressPage = require('../pages/AddressPage');

/**
 * Complete the full passport application journey.
 * This is needed to access check-answers and confirmation pages.
 * 
 * @param {WebDriver} driver - The WebDriver instance
 * @param {Object} data - Optional data to fill in
 */
async function completeApplicationJourney(driver, data = {}) {
  const defaults = {
    day: '15',
    month: '06',
    year: '1990',
    hasPreviousPassport: true,
    addressLine1: '10 Downing Street',
    addressLine2: '',
    town: 'London',
    postcode: 'SW1A 2AA'
  };

  const formData = { ...defaults, ...data };

  // Step 1: Date of Birth
  await navigateTo(driver, '/date-of-birth');
  const dobPage = new DateOfBirthPage(driver);
  await dobPage.enterDateOfBirth(formData.day, formData.month, formData.year);
  await dobPage.clickContinue();

  // Step 2: Previous Passport
  const previousPassportPage = new PreviousPassportPage(driver);
  if (formData.hasPreviousPassport) {
    await previousPassportPage.selectYes();
  } else {
    await previousPassportPage.selectNo();
  }
  await previousPassportPage.clickContinue();

  // Step 3: Address
  const addressPage = new AddressPage(driver);
  await addressPage.enterAddress(
    formData.addressLine1,
    formData.addressLine2,
    formData.town,
    formData.postcode
  );
  await addressPage.clickContinue();

  // Now we should be on check-answers page
}

/**
 * Complete the journey and submit the application.
 * This navigates to the confirmation page.
 * 
 * @param {WebDriver} driver - The WebDriver instance
 * @param {Object} data - Optional data to fill in
 */
async function completeAndSubmitApplication(driver, data = {}) {
  const CheckAnswersPage = require('../pages/CheckAnswersPage');
  
  await completeApplicationJourney(driver, data);
  
  // Submit the application
  const checkAnswersPage = new CheckAnswersPage(driver);
  await checkAnswersPage.clickSubmit();

  // Now we should be on confirmation page
}

module.exports = {
  completeApplicationJourney,
  completeAndSubmitApplication
};
