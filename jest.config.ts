import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';

// Read and parse tsconfig.json safely
const tsConfigContent = readFileSync('./tsconfig.json', 'utf-8');
const tsConfig = JSON.parse(tsConfigContent);
const { paths = {} } = tsConfig.compilerOptions || {};

const config: Config.InitialOptions = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      testMatch: [
        '**/?(*.)+(spec|test).ts'
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/index.ts$',
        '/tests/*', // Exclude integration tests
        // '/tests/' // Exclude integration tests
      ],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
      coverageDirectory: 'coverage',
      collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts'
      ],
      moduleNameMapper: {
        ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' })
      }
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      testMatch: [
        '**/?(*.)+(spec|test).ts'
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/index.ts$',
        '/src/*', // Exclude unit tests
      ],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
      coverageDirectory: 'coverage',
      collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts'
      ],
      moduleNameMapper: {
        ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' })
      }
    }
  ],
  // Additional Jest configuration for better TypeScript support
  globals: {
    'ts-jest': {
      useESM: false,
      tsconfig: {
        target: 'ES2020',
        module: 'CommonJS'
      }
    }
  },
  coverageDirectory: 'coverage'
};

export default config;