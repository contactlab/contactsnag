import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  automock: false,
  bail: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/test/bin/_data.ts',
    '<rootDir>/node_modules/'
  ],
  coverageReporters: ['text'],
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  },
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  preset: 'ts-jest',
  roots: ['<rootDir>/test/'],
  testMatch: undefined,
  testRegex: '(\\.|/)spec\\.ts$'
};

export default config;
