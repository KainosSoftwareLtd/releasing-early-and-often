const {
  validateDateOfBirth,
  validatePreviousPassport,
  validateAddress
} = require('../../services/validationService');

describe('ValidationService', () => {
  describe('validateDateOfBirth', () => {
    test('should return valid for a person aged 16 or older', () => {
      const date = {
        day: '1',
        month: '1',
        year: '2000'
      };
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return invalid if any field is missing', () => {
      const date = {
        day: '1',
        month: '',
        year: '2000'
      };
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Enter your date of birth');
    });

    test('should return invalid for person under 16', () => {
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      const date = {
        day: '1',
        month: '1',
        year: recentYear.toString()
      };
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('You must be 16 or older to apply for an adult passport');
    });

    test('should return invalid for invalid date', () => {
      const date = {
        day: '31',
        month: '2',
        year: '2000'
      };
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date of birth must be a real date');
    });

    test('should return invalid for non-numeric values', () => {
      const date = {
        day: 'abc',
        month: '1',
        year: '2000'
      };
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date of birth must be a real date');
    });
  });

  describe('validatePreviousPassport', () => {
    test('should return valid for "yes"', () => {
      const result = validatePreviousPassport('yes');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return valid for "no"', () => {
      const result = validatePreviousPassport('no');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return invalid for missing value', () => {
      const result = validatePreviousPassport('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Select whether you have had a UK passport before');
    });

    test('should return invalid for invalid value', () => {
      const result = validatePreviousPassport('maybe');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Select whether you have had a UK passport before');
    });
  });

  describe('validateAddress', () => {
    test('should return valid for complete address', () => {
      const address = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should return invalid if addressLine1 is missing', () => {
      const address = {
        addressLine1: '',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors.addressLine1).toBe('Enter address line 1');
    });

    test('should return invalid if townCity is missing', () => {
      const address = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: '',
        postcode: 'SW1A 2AA'
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors.townCity).toBe('Enter town or city');
    });

    test('should return invalid if postcode is missing', () => {
      const address = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: ''
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors.postcode).toBe('Enter postcode');
    });

    test('should return invalid for invalid postcode format', () => {
      const address = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'INVALID'
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors.postcode).toBe('Enter a valid UK postcode');
    });

    test('should accept addressLine2 as optional', () => {
      const address = {
        addressLine1: '10 Downing Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      const result = validateAddress(address);
      expect(result.isValid).toBe(true);
    });
  });
});
