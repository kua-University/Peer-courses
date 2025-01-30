module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Ensures Babel handles JSX & TypeScript
    },
    moduleNameMapper: {
        '^@stripe/react-stripe-js$': '<rootDir>/node_modules/@stripe/react-stripe-js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/$1',// Mock styles
    },
    transformIgnorePatterns: [
        '/node_modules/(?!@stripe/react-stripe-js)', // Ensures Stripe is transpiled correctly
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'], // Ensure setup file is included
};
