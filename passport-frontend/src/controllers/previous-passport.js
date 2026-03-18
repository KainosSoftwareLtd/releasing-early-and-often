const { validatePreviousPassport } = require('../services/validation');

function getPreviousPassport(req, res) {
  const sessionData = req.session.previousPassport || '';

  // Determine back link: if parents details exists, user came from child journey
  const backHref = req.session.parentsDetails ? '/parents-details' : '/date-of-birth';

  res.render('pages/previous-passport.html', {
    pageTitle: 'Previous UK passport',
    value: sessionData,
    error: req.session.errors?.previousPassport,
    backHref
  });

  delete req.session.errors;
}


function postPreviousPassport(req, res) {
  const { previousPassport } = req.body;

  const validation = validatePreviousPassport(previousPassport);

  if (!validation.isValid) {
    req.session.errors = { previousPassport: validation.errors[0] };
    return res.redirect('/previous-passport');
  }

  req.session.previousPassport = previousPassport;
  delete req.session.errors;

  res.redirect('/address');
}

module.exports = {
  getPreviousPassport,
  postPreviousPassport
};
