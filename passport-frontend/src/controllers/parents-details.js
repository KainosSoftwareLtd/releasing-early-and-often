function getParentsDetails(req, res) {
  const values = req.session.parentsDetails || {};
  const errors = (req.session.errors && req.session.errors.parentsDetails) || {};

  res.render('pages/parents-details.html', {
    pageTitle: 'Parent or guardian details',
    values,
    errors
  });

  // Clear only parentsDetails errors after displaying
  if (req.session.errors) {
    delete req.session.errors.parentsDetails;
    if (Object.keys(req.session.errors).length === 0) {
      delete req.session.errors;
    }
  }
}

function postParentsDetails(req, res) {
  const { parent1FullName, parent1Contact, parent2FullName, parent2Contact } = req.body;
  const errors = {};

  // Validate parent 1 (mandatory)
  if (!parent1FullName || parent1FullName.trim().length === 0) {
    errors.parent1FullName = 'Enter parent 1\'s full name';
  }
  if (!parent1Contact || parent1Contact.trim().length === 0) {
    errors.parent1Contact = 'Enter parent 1\'s email';
  }

  // Parent 2 is completely optional - no validation needed

  if (Object.keys(errors).length > 0) {
    req.session.errors = req.session.errors || {};
    req.session.errors.parentsDetails = errors;
    req.session.parentsDetails = { parent1FullName, parent1Contact, parent2FullName, parent2Contact };
    return res.redirect('/parents-details');
  }

  req.session.parentsDetails = {
    parent1FullName: parent1FullName.trim(),
    parent1Contact: parent1Contact.trim(),
    parent2FullName: parent2FullName ? parent2FullName.trim() : '',
    parent2Contact: parent2Contact ? parent2Contact.trim() : ''
  };
  return res.redirect('/previous-passport');
}

function getChildUnavailable(req, res) {
  res.render('pages/child-unavailable.html', {
    pageTitle: 'Service Unavailable'
  });
}

module.exports = {
  getParentsDetails,
  postParentsDetails,
  getChildUnavailable
};
