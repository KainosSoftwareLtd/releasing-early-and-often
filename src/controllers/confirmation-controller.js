/**
 * GET /confirmation
 */
function getConfirmation(req, res) {
  // Clear session data after submission
  const sessionData = { ...req.session };
  req.session.destroy();
  
  res.render('pages/confirmation.njk', {
    pageTitle: 'Application complete'
  });
}

module.exports = {
  getConfirmation
};
