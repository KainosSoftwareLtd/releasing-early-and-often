
function getChildApplication(req, res) {
  // Only show the page on GET, on POST continue the journey
  if (req.method === 'POST') {
    return res.redirect('/previous-passport');
  }
  res.render('pages/child-application.html', {
    pageTitle: 'Child Application'
  });
}

function getChildUnavailable(req, res) {
  res.render('pages/child-unavailable.html', {
    pageTitle: 'Service Unavailable'
  });
}

module.exports = {
  getChildApplication,
  getChildUnavailable
};
