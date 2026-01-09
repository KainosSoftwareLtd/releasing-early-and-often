/**
 * Validation service for form inputs
 */

/**
 * Validate date of birth
 * @param {Object} date - Object with day, month, year
 * @returns {Object} - { isValid: boolean, errors: array }
 */
function validateDateOfBirth(date) {
  const errors = [];
  
  if (!date.day || !date.month || !date.year) {
    errors.push('Enter your date of birth');
    return { isValid: false, errors };
  }

  const day = parseInt(date.day, 10);
  const month = parseInt(date.month, 10);
  const year = parseInt(date.year, 10);

  // Check if values are numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    errors.push('Date of birth must be a real date');
    return { isValid: false, errors };
  }

  // Basic range validation
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
    errors.push('Date of birth must be a real date');
    return { isValid: false, errors };
  }

  // Create date and check validity
  const dateObj = new Date(year, month - 1, day);
  if (dateObj.getDate() !== day || dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year) {
    errors.push('Date of birth must be a real date');
    return { isValid: false, errors };
  }

  // Check if 16 or older
  const today = new Date();
  const age = today.getFullYear() - year - 
    (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);
  
  if (age < 16) {
    errors.push('You must be 16 or older to apply for an adult passport');
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [], date: dateObj };
}

/**
 * Validate previous passport answer
 * @param {string} answer - 'yes' or 'no'
 * @returns {Object} - { isValid: boolean, errors: array }
 */
function validatePreviousPassport(answer) {
  const errors = [];
  
  if (!answer || (answer !== 'yes' && answer !== 'no')) {
    errors.push('Select whether you have had a UK passport before');
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
}

/**
 * Validate address details
 * @param {Object} address - Object with address fields
 * @returns {Object} - { isValid: boolean, errors: array }
 */
function validateAddress(address) {
  const errors = {};
  let isValid = true;

  if (!address.addressLine1 || address.addressLine1.trim() === '') {
    errors.addressLine1 = 'Enter address line 1';
    isValid = false;
  }

  if (!address.townCity || address.townCity.trim() === '') {
    errors.townCity = 'Enter town or city';
    isValid = false;
  }

  if (!address.postcode || address.postcode.trim() === '') {
    errors.postcode = 'Enter postcode';
    isValid = false;
  } else {
    // Basic UK postcode format validation
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(address.postcode.trim())) {
      errors.postcode = 'Enter a valid UK postcode';
      isValid = false;
    }
  }

  return { isValid, errors };
}

module.exports = {
  validateDateOfBirth,
  validatePreviousPassport,
  validateAddress
};
