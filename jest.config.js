const path = require('path')

module.exports = {
  testEnvironment: 'node',
  // anything that is in the src directory
  collectCoverageFrom: ['**/src/**/*.js'],
  // testMatch: ['**/src/**/*.js'],
  rootDir: path.join(__dirname, '.'),
  testPathIgnorePatterns: ['<rootDir>/dist/'],
}
