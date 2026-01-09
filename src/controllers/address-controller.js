const { validateAddress } = require('../services/validation-service');

/**
 * GET /address
 */
function getAddress(req, res) {
  const sessionData = req.session.address || {};

  res.render('pages/address.html', {
    pageTitle: 'Address details',
    values: sessionData,
    errors: req.session.errors || {}
  });

  delete req.session.errors;
}

/**
 * POST /address
 */
function postAddress(req, res) {
  const { addressLine1, addressLine2, townCity, postcode } = req.body;

  const address = {
    addressLine1,
    addressLine2,
    townCity,
    postcode
  };

  const validation = validateAddress(address);

  if (!validation.isValid) {
    req.session.errors = validation.errors;
    req.session.address = address;
    return res.redirect('/address');
  }

  req.session.address = address;
  delete req.session.errors;

  res.redirect('/check-answers');
}

module.exports = {
  getAddress,
  postAddress
};
