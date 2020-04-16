module.exports = {
  ...require('./test/jest-common'),
  collectCoverageFrom: ['**/src/**/*.js', '!**/__tests__/**'],
  projects: ['./test/jest.mongoose-setup.js', './test/jest.main.js'],
}
