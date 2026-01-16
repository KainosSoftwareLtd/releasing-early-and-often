const axios = require('axios');
const config = require('../../config/config.json');

function getCheckAnswers(req, res) {
  const { dateOfBirth, previousPassport, address, parentsDetails } = req.session;

  // Redirect to start if no data
  if (!dateOfBirth || !previousPassport || !address) {
    return res.redirect('/date-of-birth');
  }

  const rows = [
    {
      key: { text: 'Date of birth' },
      value: { text: `${dateOfBirth.day}/${dateOfBirth.month}/${dateOfBirth.year}` },
      actions: {
        items: [
          { href: '/date-of-birth', text: 'Change', visuallyHiddenText: 'date of birth' }
        ]
      }
    },
    {
      key: { text: 'Previous UK passport' },
      value: { text: previousPassport === 'yes' ? 'Yes' : 'No' },
      actions: {
        items: [
          { href: '/previous-passport', text: 'Change', visuallyHiddenText: 'previous passport' }
        ]
      }
    },
    {
      key: { text: 'Address' },
      value: {
        html: `${address.addressLine1}<br>${address.addressLine2 ? address.addressLine2 + '<br>' : ''}${address.townCity}<br>${address.postcode}`
      },
      actions: {
        items: [
          { href: '/address', text: 'Change', visuallyHiddenText: 'address' }
        ]
      }
    }
  ];

  const config = require('../../config/config.json');
  if (config.featureFlags.enableChildRenewals && parentsDetails) {
    let parentsHtml = `<strong>Parent 1:</strong><br>${parentsDetails.parent1FullName}<br>${parentsDetails.parent1Contact}`;
    if (parentsDetails.parent2FullName) {
      parentsHtml += `<br><br><strong>Parent 2:</strong><br>${parentsDetails.parent2FullName}<br>${parentsDetails.parent2Contact}`;
    }
    rows.push({
      key: { text: 'Parent or guardian details' },
      value: { html: parentsHtml },
      actions: {
        items: [
          { href: '/parents-details', text: 'Change', visuallyHiddenText: 'parent or guardian details' }
        ]
      }
    });
  }

  res.render('pages/check-answers.html', {
    pageTitle: 'Check your answers',
    rows
  });
}

async function postCheckAnswers(req, res) {

  let referenceNumber;

  if (config.featureFlags.enableBackendServiceCalls) {
    try {
      // Call backend service
      const { dateOfBirth, previousPassport, address, parentsDetails } = req.session;

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

      let apiVersion = '1.0';
      // Include child-specific fields when feature flag is enabled
      if (config.featureFlags.enableChildRenewals && parentsDetails) {
        apiVersion = '2.0';
        payload.parent1FullName = parentsDetails.parent1FullName;
        payload.parent1Contact = parentsDetails.parent1Contact;
        if (parentsDetails.parent2FullName) {
          payload.parent2FullName = parentsDetails.parent2FullName;
          payload.parent2Contact = parentsDetails.parent2Contact;
        }
      }

      const response = await axios.post(`${config.backend.apiUrl}/applications`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': apiVersion
        },
        timeout: 5000
      });

      referenceNumber = response.data.applicationId;

      console.info('Response from backend service api call:', response.data, '\n\tusing API version:', apiVersion);

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
