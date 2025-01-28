//jest.config.js

module.exports = {
    transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@stripe)/)', // Add any specific node_modules packages if necessary
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom', // Removed duplicate
};
