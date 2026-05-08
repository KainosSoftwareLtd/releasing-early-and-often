const axios = require('axios');
const configService = require('../services/config');
const { isChildApplicant, isChildJourneyEnabled } = require('../services/child-journey');

function getCheckAnswers(req, res) {
  const { dateOfBirth, previousPassport, address, parentDetails } = req.session;
  const isChildJourney = Boolean(
    dateOfBirth && isChildJourneyEnabled() && isChildApplicant(dateOfBirth)
  );

  // Redirect to start if no data
  if (!dateOfBirth || !previousPassport || !address) {
    return res.redirect('/date-of-birth');
  }

  if (isChildJourney && !parentDetails) {
    return res.redirect('/parents-details');
  }

  res.render('pages/check-answers.html', {
    pageTitle: 'Check your answers',
    dateOfBirth,
    previousPassport,
    address,
    parentDetails,
    isChildJourney
  });
}

async function postCheckAnswers(req, res) {
  const config = configService.getConfig();

  let referenceNumber;

  if (config.featureFlags.enableBackendServiceCalls) {
    try {
      // Call backend service
      const { dateOfBirth, previousPassport, address, parentDetails } = req.session;
      const isChildJourney = Boolean(
        dateOfBirth && isChildJourneyEnabled() && isChildApplicant(dateOfBirth)
      );

      // Format date of birth as YYYY-MM-DD
      const formattedDateOfBirth = `${dateOfBirth.year}-${dateOfBirth.month.padStart(2, '0')}-${dateOfBirth.day.padStart(2, '0')}`;

      // Prepare payload for backend
      const payload = {
        dateOfBirth: formattedDateOfBirth,
        previousPassport: previousPassport,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        townCity: address.townCity,
        postcode: address.postcode
      };

      if (isChildJourney && parentDetails) {
        payload.parent1FullName = parentDetails.parent1FullName;
        payload.parent1Contact = parentDetails.parent1Contact;
        payload.parent2FullName = parentDetails.parent2FullName;
        payload.parent2Contact = parentDetails.parent2Contact;
      }

      const response = await axios.post(`${config.backend.apiUrl}/applications`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': isChildJourney ? '2.0' : '1.0'
        },
        timeout: 5000
      });

      referenceNumber = response.data.applicationId;

    } catch (error) {
      console.error('Error calling backend service (fallback response generated):', error.message);

      // Fallback: generate a temporary reference number
      referenceNumber = 'TEMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  } else {
    // Use fake data when backend service is disabled
    referenceNumber = 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('Backend service disabled - using fake reference number:', referenceNumber);
  }

  // Store the reference number
  req.session.referenceNumber = referenceNumber;

  res.redirect('/confirmation');
}

module.exports = {
  getCheckAnswers,
  postCheckAnswers
};
