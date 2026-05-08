const { validateParentDetails } = require('../services/validation');
const { isChildApplicant, isChildJourneyEnabled } = require('../services/child-journey');

function isEligibleForChildJourney(req) {
  return isChildJourneyEnabled() && req.session.dateOfBirth && isChildApplicant(req.session.dateOfBirth);
}

function getParentsDetails(req, res) {
  if (!isEligibleForChildJourney(req)) {
    return res.redirect('/date-of-birth');
  }

  const sessionData = req.session.parentDetails || {};

  res.render('pages/parents-details.html', {
    pageTitle: 'Parent details',
    values: sessionData,
    errors: req.session.errors || {}
  });

  delete req.session.errors;
}

function postParentsDetails(req, res) {
  if (!isEligibleForChildJourney(req)) {
    return res.redirect('/date-of-birth');
  }

  const parentDetails = {
    parent1FullName: req.body.parent1FullName,
    parent1Contact: req.body.parent1Contact,
    parent2FullName: req.body.parent2FullName,
    parent2Contact: req.body.parent2Contact
  };

  const validation = validateParentDetails(parentDetails);

  if (!validation.isValid) {
    req.session.errors = validation.errors;
    req.session.parentDetails = parentDetails;
    return res.redirect('/parents-details');
  }

  req.session.parentDetails = validation.value;
  delete req.session.errors;

  return res.redirect('/previous-passport');
}

module.exports = {
  getParentsDetails,
  postParentsDetails
};