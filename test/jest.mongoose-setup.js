module.exports = {
  ...require('./jest-common'),
  testMatch: ['**/database.test.js'],
  displayName: { name: 'mongoose setup', color: 'magentaBright' },
}
