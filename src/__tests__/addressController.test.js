const {
  getAddress,
  postAddress
} = require('../../controllers/addressController');

describe('AddressController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {},
      body: {}
    };
    res = {
      render: jest.fn(),
      redirect: jest.fn()
    };
  });

  describe('getAddress', () => {
    test('should render address page with session data', () => {
      req.session.address = {
        addressLine1: '10 Downing Street',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      
      getAddress(req, res);
      
      expect(res.render).toHaveBeenCalledWith('pages/address.njk', {
        pageTitle: 'Address details',
        values: req.session.address,
        errors: {}
      });
    });
  });

  describe('postAddress', () => {
    test('should redirect to check answers on valid address', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      
      postAddress(req, res);
      
      expect(req.session.address).toEqual(req.body);
      expect(res.redirect).toHaveBeenCalledWith('/check-answers');
    });

    test('should redirect back with errors on missing required field', () => {
      req.body = {
        addressLine1: '',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      
      postAddress(req, res);
      
      expect(req.session.errors).toBeDefined();
      expect(req.session.errors.addressLine1).toBeDefined();
      expect(res.redirect).toHaveBeenCalledWith('/address');
    });

    test('should accept optional addressLine2', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };
      
      postAddress(req, res);
      
      expect(req.session.address.addressLine2).toBe('Westminster');
      expect(res.redirect).toHaveBeenCalledWith('/check-answers');
    });

    test('should validate postcode format', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'INVALID'
      };
      
      postAddress(req, res);
      
      expect(req.session.errors.postcode).toBeDefined();
      expect(res.redirect).toHaveBeenCalledWith('/address');
    });
  });
});
