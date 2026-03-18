const sinon = require('sinon');
const {
  getDateOfBirth,
  postDateOfBirth
} = require('../../src/controllers/date-of-birth');

describe('DateOfBirthController', () => {
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

    it('redirects under 16 to parents-details when child renewals enabled', () => {
      const config = require('../../config/config.json');
      const original = config.featureFlags.enableChildRenewals;
      config.featureFlags.enableChildRenewals = true;
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      req.body = { day: '1', month: '1', year: recentYear.toString() };

      postDateOfBirth(req, res);

      expect(req.session.dateOfBirth).to.deep.equal({ day: '1', month: '1', year: recentYear.toString() });
      expect(res.redirect).to.have.been.calledWith('/parents-details');
      config.featureFlags.enableChildRenewals = original;
    });

    it('redirects under 16 to child-unavailable when child renewals disabled', () => {
      const config = require('../../config/config.json');
      const original = config.featureFlags.enableChildRenewals;
      config.featureFlags.enableChildRenewals = false;
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      req.body = { day: '1', month: '1', year: recentYear.toString() };

      postDateOfBirth(req, res);

      expect(req.session.dateOfBirth).to.deep.equal({ day: '1', month: '1', year: recentYear.toString() });
      expect(res.redirect).to.have.been.calledWith('/child-unavailable');
      config.featureFlags.enableChildRenewals = original;
    });

    it('redirects child whose birthday is later this year to parents-details', () => {
      const config = require('../../config/config.json');
      const original = config.featureFlags.enableChildRenewals;
      config.featureFlags.enableChildRenewals = true;
      const today = new Date();
      const birthYear = today.getFullYear() - 15; // Will turn 16 this year
      const birthMonth = today.getMonth() + 2; // Birthday is 2 months from now
      req.body = { day: '15', month: birthMonth.toString(), year: birthYear.toString() };

      postDateOfBirth(req, res);

      expect(res.redirect).to.have.been.calledWith('/parents-details');
      config.featureFlags.enableChildRenewals = original;
    });
  });
});
