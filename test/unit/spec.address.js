const sinon = require('sinon');
const {
  getAddress,
  postAddress
} = require('../../src/controllers/address');

describe('AddressController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {},
      body: {}
    };
    res = {
      render: sinon.stub(),
      redirect: sinon.stub()
    };
  });

  describe('getAddress', () => {
    it('should render address page with session data', () => {
      req.session.address = {
        addressLine1: '10 Downing Street',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };

      getAddress(req, res);

      expect(res.render).to.have.been.calledWith('pages/address.html', {
        pageTitle: 'Address details',
        values: req.session.address,
        errors: {}
      });
    });
  });

  describe('postAddress', () => {
    it('should redirect to check answers on valid address', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };

      postAddress(req, res);

      expect(req.session.address).to.deep.equal(req.body);
      expect(res.redirect).to.have.been.calledWith('/check-answers');
    });

    it('should redirect back with errors on missing required field', () => {
      req.body = {
        addressLine1: '',
        addressLine2: '',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };

      postAddress(req, res);

      expect(req.session.errors).to.exist;
      expect(req.session.errors.addressLine1).to.exist;
      expect(res.redirect).to.have.been.calledWith('/address');
    });

    it('should accept optional addressLine2', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'SW1A 2AA'
      };

      postAddress(req, res);

      expect(req.session.address.addressLine2).to.equal('Westminster');
      expect(res.redirect).to.have.been.calledWith('/check-answers');
    });

    it('should validate postcode format', () => {
      req.body = {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        townCity: 'London',
        postcode: 'INVALID'
      };

      postAddress(req, res);

      expect(req.session.errors.postcode).to.exist;
      expect(res.redirect).to.have.been.calledWith('/address');
    });
  });
});
