const express = require('express');
const router = express.Router();
const dateOfBirthController = require('../controllers/date-of-birth');
const previousPassportController = require('../controllers/previous-passport');
const addressController = require('../controllers/address');
const checkAnswersController = require('../controllers/check-answers');
const confirmationController = require('../controllers/confirmation');
const parentsDetailsController = require('../controllers/parents-details');

// Home - redirect to start
router.get('/', (req, res) => {
  res.redirect('/date-of-birth');
});

// Date of Birth
router.get('/date-of-birth', dateOfBirthController.getDateOfBirth);
router.post('/date-of-birth', dateOfBirthController.postDateOfBirth);

// Child unavailable route
const childController = require('../controllers/child');
router.get('/child-unavailable', childController.getChildUnavailable);

// Parent details for child applications
router.get('/parents-details', parentsDetailsController.getParentsDetails);
router.post('/parents-details', parentsDetailsController.postParentsDetails);

// Previous UK Passport
router.get('/previous-passport', previousPassportController.getPreviousPassport);
router.post('/previous-passport', previousPassportController.postPreviousPassport);

// Address Details
router.get('/address', addressController.getAddress);
router.post('/address', addressController.postAddress);

// Check Your Answers
router.get('/check-answers', checkAnswersController.getCheckAnswers);
router.post('/check-answers', checkAnswersController.postCheckAnswers);

// Application Complete
router.get('/confirmation', confirmationController.getConfirmation);

module.exports = router;
