const express = require('express');
const router = express.Router();
const dateOfBirthController = require('./controllers/dateOfBirthController');
const previousPassportController = require('./controllers/previousPassportController');
const addressController = require('./controllers/addressController');
const checkAnswersController = require('./controllers/checkAnswersController');
const confirmationController = require('./controllers/confirmationController');

// Home - redirect to start
router.get('/', (req, res) => {
  res.redirect('/date-of-birth');
});

// Date of Birth
router.get('/date-of-birth', dateOfBirthController.getDateOfBirth);
router.post('/date-of-birth', dateOfBirthController.postDateOfBirth);

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
