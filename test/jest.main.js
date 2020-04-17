module.exports = {
  ...require('./jest-common.js'),
  displayName: 'main',
  testPathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/dist/'],
};
