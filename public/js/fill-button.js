/**
 * Fill Button Functionality
 * Provides dummy data population for form fields across different pages
 */

// Fill button functionality
function fillFormWithDummyData() {
  const path = window.location.pathname;

  if (path === '/date-of-birth') {
    const dayInput = document.querySelector('input[name="day"]');
    const monthInput = document.querySelector('input[name="month"]');
    const yearInput = document.querySelector('input[name="year"]');

    if (dayInput) dayInput.value = '15';
    if (monthInput) monthInput.value = '6';
    if (yearInput) yearInput.value = '1990';
  } else if (path === '/previous-passport') {
    const yesRadio = document.querySelector('input[value="yes"]');
    if (yesRadio) yesRadio.checked = true;
  } else if (path === '/address') {
    const addressLine1 = document.querySelector('input[name="addressLine1"]');
    const addressLine2 = document.querySelector('input[name="addressLine2"]');
    const townCity = document.querySelector('input[name="townCity"]');
    const postcode = document.querySelector('input[name="postcode"]');

    if (addressLine1) addressLine1.value = '123 Main Street';
    if (addressLine2) addressLine2.value = 'Apartment 4B';
    if (townCity) townCity.value = 'London';
    if (postcode) postcode.value = 'SW1A 1AA';
  }

  // Auto-click the continue button after a short delay to allow form population
  setTimeout(() => {
    const continueButton = document.querySelector('.govuk-button:not(.fill-button)');
    if (continueButton) {
      continueButton.click();
    }
  }, 100);
}

// Show tooltip on first page
function showTooltipOnFirstPage() {
  const path = window.location.pathname;

  if (path === '/date-of-birth') {
    // Create tooltip if it doesn't exist
    if (!document.querySelector('.fill-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'fill-tooltip';
      tooltip.innerHTML = `
        <div class="fill-tooltip-content">
          <button class="fill-tooltip-close" type="button">&times;</button>
          <h3>Quick Fill Tool</h3>
          <p>Use the <strong>Fill</strong> button or press <strong>ESC</strong> to quickly populate forms with test data and auto-proceed to the next page.</p>
        </div>
      `;
      document.body.appendChild(tooltip);

      // Add close functionality
      const closeBtn = tooltip.querySelector('.fill-tooltip-close');
      closeBtn.addEventListener('click', () => {
        tooltip.style.display = 'none';
        localStorage.setItem('fill-tooltip-dismissed', 'true');
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        tooltip.style.display = 'none';
      }, 4000);
    }
  }
}

// Initialize fill button functionality
function initFillButton() {
  // Add ESC key listener
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      fillFormWithDummyData();
    }
  });

  // Add fill button click listener
  const fillButton = document.querySelector('.fill-button');
  if (fillButton) {
    fillButton.addEventListener('click', fillFormWithDummyData);
  }

  // Show tooltip on first page (unless previously dismissed)
  if (!localStorage.getItem('fill-tooltip-dismissed')) {
    showTooltipOnFirstPage();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initFillButton);