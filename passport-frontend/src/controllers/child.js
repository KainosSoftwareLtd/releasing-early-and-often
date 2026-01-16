// Controller for child-specific application page
function getChildUnavailable(req, res) {
  res.render('pages/child-unavailable.html', {
    pageTitle: 'Service Unavailable'
  });
}

module.exports = {
  getChildUnavailable
};
