module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  headless: process.env.HEADLESS === 'true',
  timeout: {
    implicit: 10000,
    pageLoad: 30000
  }
};
