const path = require('path');

module.exports = {
  testEnvironment: 'node',
  rootDir: path.join(__dirname, '..'),
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  watchPlugins: [
    'jest-watch-select-projects',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
