module.exports = {
  preset: 'jest-puppeteer',
  moduleNameMapper: {
    jquery: '<rootDir>/test/assets/jquery-1.12.4.js',
  },
  testRegex: 'test/.*\\.spec\\.js$',
};