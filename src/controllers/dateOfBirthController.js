const { validateDateOfBirth } = require('../services/validationService');

/**
 * GET /date-of-birth
 */
function getDateOfBirth(req, res) {
  const sessionData = req.session.dateOfBirth || {};
  
  res.render('pages/date-of-birth.njk', {
    pageTitle: 'Date of birth',
    values: sessionData,
    errors: req.session.errors || {}
  });
  
  // Clear errors after displaying
  delete req.session.errors;
}

/**
 * POST /date-of-birth
 */
function postDateOfBirth(req, res) {
  const { day, month, year } = req.body;
  
  const validation = validateDateOfBirth({ day, month, year });
  
  if (!validation.isValid) {
    req.session.errors = { dateOfBirth: validation.errors[0] };
    req.session.dateOfBirth = { day, month, year };
    return res.redirect('/date-of-birth');
  }
  
  // Store in session
  req.session.dateOfBirth = { day, month, year };
  delete req.session.errors;
  
  res.redirect('/previous-passport');
}

module.exports = {
  getDateOfBirth,
  postDateOfBirth
};
