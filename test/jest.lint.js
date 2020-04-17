module.exports = {
  runner: 'jest-runner-eslint',
  displayName: { name: 'lint', color: 'blackBright' },
  testMatch: ['<rootDir>/**/*.js'],
  // displayName: { name: 'mongoose setup', color: 'blue' },
  // configurado no package.json para ignorar tudo que estiver no .gitignore
  // testPathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/dist/'],
};
