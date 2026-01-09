const sinon = require('sinon');
const {
  getDateOfBirth,
  postDateOfBirth
} = require('../../src/controllers/date-of-birth-controller');

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

    it('should reject person under 16', () => {
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      req.body = { day: '1', month: '1', year: recentYear.toString() };

      postDateOfBirth(req, res);

      expect(req.session.errors.dateOfBirth).to.include('16 or older');
      expect(res.redirect).to.have.been.calledWith('/date-of-birth');
    });
  });
});
