const configService = require('./config');

function isChildJourneyEnabled() {
  const config = configService.getConfig();
  return Boolean(config.featureFlags.enabledChildRenewals);
}

function getApplicantAge(dateOfBirth) {
  const day = parseInt(dateOfBirth.day, 10);
  const month = parseInt(dateOfBirth.month, 10);
  const year = parseInt(dateOfBirth.year, 10);
  const today = new Date();

  let age = today.getFullYear() - year;
  const monthOffset = today.getMonth() - (month - 1);

  if (monthOffset < 0 || (monthOffset === 0 && today.getDate() < day)) {
    age -= 1;
  }

  return age;
}

function isChildApplicant(dateOfBirth) {
  return getApplicantAge(dateOfBirth) < 16;
}

module.exports = {
  getApplicantAge,
  isChildApplicant,
  isChildJourneyEnabled
};