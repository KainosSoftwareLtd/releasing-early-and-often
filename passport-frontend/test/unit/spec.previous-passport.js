const sinon = require('sinon');
const {
  getPreviousPassport,
  postPreviousPassport
} = require('../../src/controllers/previous-passport');

describe('PreviousPassportController', () => {
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

  describe('getPreviousPassport', () => {
    it('should render previous passport page with back link to date of birth for adult applications', () => {
      req.session.previousPassport = 'yes';

      getPreviousPassport(req, res);

      expect(res.render).to.have.been.calledWith('pages/previous-passport.html', {
        pageTitle: 'Previous UK passport',
        value: 'yes',
        error: undefined,
        backHref: '/date-of-birth'
      });
    });

    it('should render previous passport page with back link to parents details for child applications', () => {
      req.session.previousPassport = 'yes';
      req.session.parentsDetails = {
        parent1FullName: 'John Doe',
        parent1Contact: 'john@example.com'
      };

      getPreviousPassport(req, res);

      expect(res.render).to.have.been.calledWith('pages/previous-passport.html', {
        pageTitle: 'Previous UK passport',
        value: 'yes',
        error: undefined,
        backHref: '/parents-details'
      });
    });

    it('should render with error when errors exist', () => {
      req.session.previousPassport = '';
      req.session.errors = { previousPassport: 'Select an option' };

      getPreviousPassport(req, res);

      expect(res.render).to.have.been.calledWith('pages/previous-passport.html', {
        pageTitle: 'Previous UK passport',
        value: '',
        error: 'Select an option',
        backHref: '/date-of-birth'
      });
    });
  });

  describe('postPreviousPassport', () => {
    it('should redirect to address page on valid selection', () => {
      req.body = { previousPassport: 'yes' };

      postPreviousPassport(req, res);

      expect(req.session.previousPassport).to.equal('yes');
      expect(res.redirect).to.have.been.calledWith('/address');
    });

    it('should redirect back with error on missing selection', () => {
      req.body = { previousPassport: '' };

      postPreviousPassport(req, res);

      expect(req.session.errors).to.exist;
      expect(res.redirect).to.have.been.calledWith('/previous-passport');
    });

    it('should accept "no" as valid answer', () => {
      req.body = { previousPassport: 'no' };

      postPreviousPassport(req, res);

      expect(req.session.previousPassport).to.equal('no');
      expect(res.redirect).to.have.been.calledWith('/address');
    });
  });
});
