// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json', // Use the path to your tsconfig.json
      },
    },
  };
  