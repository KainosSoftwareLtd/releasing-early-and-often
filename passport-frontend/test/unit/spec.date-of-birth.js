const sinon = require('sinon');
const configService = require('../../src/services/config');
const {
  getDateOfBirth,
  postDateOfBirth
} = require('../../src/controllers/date-of-birth');

describe('DateOfBirthController', () => {
  let req, res;

  beforeEach(() => {
    sinon.stub(configService, 'getConfig').returns({
      featureFlags: {
        enabledChildRenewals: false,
        enableBackendServiceCalls: true
      },
      backend: {
        apiUrl: 'http://localhost:8080/api'
      }
    });
    req = {
      session: {},
      body: {}
    };
    res = {
      render: sinon.stub(),
      redirect: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getDateOfBirth', () => {
    it('should render date of birth page with session data', () => {
      req.session.dateOfBirth = { day: '1', month: '1', year: '2000' };

      getDateOfBirth(req, res);

      expect(res.render).to.have.been.calledWith('pages/date-of-birth.html', {
        pageTitle: 'Date of birth',
        values: { day: '1', month: '1', year: '2000' },
        errors: {}
      });
    });

    it('should render empty page if no session data', () => {
      getDateOfBirth(req, res);

      expect(res.render).to.have.been.calledWith('pages/date-of-birth.html', {
        pageTitle: 'Date of birth',
        values: {},
        errors: {}
      });
    });
  });

  describe('postDateOfBirth', () => {
    it('should redirect to next page on valid date', () => {
      req.body = { day: '1', month: '1', year: '2000' };

      postDateOfBirth(req, res);

      expect(req.session.dateOfBirth).to.deep.equal({ day: '1', month: '1', year: '2000' });
      expect(res.redirect).to.have.been.calledWith('/previous-passport');
    });

    it('should redirect back with errors on invalid date', () => {
      req.body = { day: '', month: '1', year: '2000' };

      postDateOfBirth(req, res);

      expect(req.session.errors).to.exist;
      expect(res.redirect).to.have.been.calledWith('/date-of-birth');
    });

    it('should reject person under 16', () => {
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      req.body = { day: '1', month: '1', year: recentYear.toString() };

      postDateOfBirth(req, res);

      expect(res.redirect).to.have.been.calledWith('/child-unavailable');
    });

    it('should route child applicants to parent details when child renewals are enabled', () => {
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      configService.getConfig.returns({
        featureFlags: {
          enabledChildRenewals: true,
          enableBackendServiceCalls: true
        },
        backend: {
          apiUrl: 'http://localhost:8080/api'
        }
      });
      req.body = { day: '1', month: '1', year: recentYear.toString() };

      postDateOfBirth(req, res);

      expect(res.redirect).to.have.been.calledWith('/parents-details');
    });
  });
});
