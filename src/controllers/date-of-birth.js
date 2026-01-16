const { validateDateOfBirth } = require('../services/validation');

/**
 * GET /date-of-birth
 */
function getDateOfBirth(req, res) {
  const sessionData = req.session.dateOfBirth || {};

  res.render('pages/date-of-birth.html', {
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

  // Check for child age (under 16)
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const today = new Date();
  let age = today.getFullYear() - y;
  const mm = today.getMonth() - (m - 1);
  if (mm < 0 || (mm === 0 && today.getDate() < d)) {
    age--;
  }
  if (age < 16) {
    return res.redirect('/child-unavailable');
  }

  res.redirect('/previous-passport');
}

module.exports = {
  getDateOfBirth,
  postDateOfBirth
};
