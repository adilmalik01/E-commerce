module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    extensionsToTreatAsEsm: ['.jsx'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/', // Allow Jest to transform the axios module
        '/node_modules/(?!react-query)/',
        '/node_modules/(?!sweetalert2)/',
    ],

};