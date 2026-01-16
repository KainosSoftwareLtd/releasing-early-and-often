const { validateDateOfBirth } = require('../services/validation');


function getDateOfBirth(req, res) {
  const sessionData = req.session.dateOfBirth || {};

  res.render('pages/date-of-birth.html', {
    pageTitle: 'Date of birth',
    values: sessionData,
    errors: req.session.errors || {}
  });

  delete req.session.errors;
}

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

  const config = require('../../config/config.json');

  if (validation.isUnder16) {
    if (config.featureFlags.enableChildRenewals) {
      return res.redirect('/parents-details');
    } else {
      return res.redirect('/child-unavailable');
    }
  }

  res.redirect('/previous-passport');
}

module.exports = {
  getDateOfBirth,
  postDateOfBirth
};
