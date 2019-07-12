module.exports = {
  automock: false,
  bail: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/test/_helpers.ts',
    '<rootDir>/node_modules/'
  ],
  coverageReporters: ['text'],
  roots: ['<rootDir>/test/'],
  testRegex: '(\\.|/)spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  },
  preset: 'ts-jest',
  testMatch: null
};