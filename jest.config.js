module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ]
};
