
function getConfirmation(req, res) {
  // Get reference number from session
  const referenceNumber = req.session.referenceNumber || 'HDJ2123F';

  // Clear session data after submission
  const sessionData = { ...req.session };
  req.session.destroy();

  res.render('pages/confirmation.html', {
    pageTitle: 'Application complete',
    referenceNumber
  });
}

module.exports = {
  getConfirmation
};
