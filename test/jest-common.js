const path = require('path');

module.exports = {
  testEnvironment: 'node',
  rootDir: path.join(__dirname, '..'),
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: [require.resolve('./setup-env.js')],
  watchPlugins: [
    'jest-watch-select-projects',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
