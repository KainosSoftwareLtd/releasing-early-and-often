const {
  getDateOfBirth,
  postDateOfBirth
} = require('../../controllers/dateOfBirthController');

describe('DateOfBirthController', () => {
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

  describe('getDateOfBirth', () => {
    test('should render date of birth page with session data', () => {
      req.session.dateOfBirth = { day: '1', month: '1', year: '2000' };
      
      getDateOfBirth(req, res);
      
      expect(res.render).toHaveBeenCalledWith('pages/date-of-birth.njk', {
        pageTitle: 'Date of birth',
        values: { day: '1', month: '1', year: '2000' },
        errors: {}
      });
    });

    test('should render empty page if no session data', () => {
      getDateOfBirth(req, res);
      
      expect(res.render).toHaveBeenCalledWith('pages/date-of-birth.njk', {
        pageTitle: 'Date of birth',
        values: {},
        errors: {}
      });
    });
  });

  describe('postDateOfBirth', () => {
    test('should redirect to next page on valid date', () => {
      req.body = { day: '1', month: '1', year: '2000' };
      
      postDateOfBirth(req, res);
      
      expect(req.session.dateOfBirth).toEqual({ day: '1', month: '1', year: '2000' });
      expect(res.redirect).toHaveBeenCalledWith('/previous-passport');
    });

    test('should redirect back with errors on invalid date', () => {
      req.body = { day: '', month: '1', year: '2000' };
      
      postDateOfBirth(req, res);
      
      expect(req.session.errors).toBeDefined();
      expect(res.redirect).toHaveBeenCalledWith('/date-of-birth');
    });

    test('should reject person under 16', () => {
      const today = new Date();
      const recentYear = today.getFullYear() - 10;
      req.body = { day: '1', month: '1', year: recentYear.toString() };
      
      postDateOfBirth(req, res);
      
      expect(req.session.errors.dateOfBirth).toContain('16 or older');
      expect(res.redirect).toHaveBeenCalledWith('/date-of-birth');
    });
  });
});
