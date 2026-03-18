const { navigateTo } = require('./driver');
const DateOfBirthPage = require('../pages/DateOfBirthPage');
const PreviousPassportPage = require('../pages/PreviousPassportPage');
const AddressPage = require('../pages/AddressPage');
const ParentsDetailsPage = require('../pages/ParentsDetailsPage');

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

/**
 * Complete the child passport application journey up to check-answers.
 * Uses a date of birth that results in an under-16 applicant.
 *
 * @param {WebDriver} driver - The WebDriver instance
 * @param {Object} data - Optional data to fill in
 */
async function completeChildApplicationJourney(driver, data = {}) {
  const defaults = {
    day: '15',
    month: '06',
    year: (new Date().getFullYear() - 10).toString(),
    hasPreviousPassport: false,
    parent1FullName: 'Jane Smith',
    parent1Contact: 'jane@example.com',
    parent2FullName: '',
    parent2Contact: '',
    addressLine1: '10 Downing Street',
    addressLine2: '',
    town: 'London',
    postcode: 'SW1A 2AA'
  };

  const formData = { ...defaults, ...data };

  // Step 1: Date of Birth (child — redirects to parents-details)
  await navigateTo(driver, '/date-of-birth');
  const dobPage = new DateOfBirthPage(driver);
  await dobPage.enterDateOfBirth(formData.day, formData.month, formData.year);
  await dobPage.clickContinue();

  // Step 2: Parents Details
  const parentsDetailsPage = new ParentsDetailsPage(driver);
  await parentsDetailsPage.enterParentDetails(
    formData.parent1FullName,
    formData.parent1Contact,
    formData.parent2FullName,
    formData.parent2Contact
  );
  await parentsDetailsPage.clickContinue();

  // Step 3: Previous Passport
  const previousPassportPage = new PreviousPassportPage(driver);
  if (formData.hasPreviousPassport) {
    await previousPassportPage.selectYes();
  } else {
    await previousPassportPage.selectNo();
  }
  await previousPassportPage.clickContinue();

  // Step 4: Address
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

module.exports = {
  completeApplicationJourney,
  completeAndSubmitApplication,
  completeChildApplicationJourney
};
