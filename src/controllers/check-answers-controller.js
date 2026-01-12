/**
 * GET /check-answers
 */
function getCheckAnswers(req, res) {
  const { dateOfBirth, previousPassport, address } = req.session;

  // Redirect to start if no data
  if (!dateOfBirth || !previousPassport || !address) {
    return res.redirect('/date-of-birth');
  }

  res.render('pages/check-answers.html', {
    pageTitle: 'Check your answers',
    dateOfBirth,
    previousPassport,
    address
  });
}

/**
 * POST /check-answers
 */
function postCheckAnswers(req, res) {
  // In a real app, this would submit the application
  // For now, just redirect to confirmation
  res.redirect('/confirmation');
}

module.exports = {
  getCheckAnswers,
  postCheckAnswers
};
