const {
  getPreviousPassport,
  postPreviousPassport
} = require('../../controllers/previousPassportController');

describe('PreviousPassportController', () => {
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

  describe('getPreviousPassport', () => {
    test('should render previous passport page', () => {
      req.session.previousPassport = 'yes';
      
      getPreviousPassport(req, res);
      
      expect(res.render).toHaveBeenCalledWith('pages/previous-passport.njk', {
        pageTitle: 'Previous UK passport',
        value: 'yes',
        error: undefined
      });
    });
  });

  describe('postPreviousPassport', () => {
    test('should redirect to address page on valid selection', () => {
      req.body = { previousPassport: 'yes' };
      
      postPreviousPassport(req, res);
      
      expect(req.session.previousPassport).toBe('yes');
      expect(res.redirect).toHaveBeenCalledWith('/address');
    });

    test('should redirect back with error on missing selection', () => {
      req.body = { previousPassport: '' };
      
      postPreviousPassport(req, res);
      
      expect(req.session.errors).toBeDefined();
      expect(res.redirect).toHaveBeenCalledWith('/previous-passport');
    });

    test('should accept "no" as valid answer', () => {
      req.body = { previousPassport: 'no' };
      
      postPreviousPassport(req, res);
      
      expect(req.session.previousPassport).toBe('no');
      expect(res.redirect).toHaveBeenCalledWith('/address');
    });
  });
});
