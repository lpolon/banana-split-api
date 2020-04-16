const path = require('path')

module.exports = {
  testEnvironment: 'node',
  rootDir: path.join(__dirname, '..'),
  testPathIgnorePatterns: ['<rootDir>/dist/'],
}