module.exports = {
    // verbose: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/test/index.js',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1',
        '^vue$': 'vue/dist/vue.common.js',
        '^@/test$': '<rootDir>/test/index.js',
        '^@/test/(.*)$': '<rootDir>/test/$1',
        '\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: [
        'js',
        'ts',
        'vue',
        'json',
    ],
    transform: {
        '.*\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest',
        // '\\.(sass|scss)$': 'jest-css-modules',
        // '.*\\.(j|t)s$': 'babel-jest',
    },
    snapshotSerializers: [
        'jest-serializer-html',
    ],
    // collectCoverage: true,
    // collectCoverageFrom: [
    //   '<rootDir>/components/**/*.vue',
    //   '<rootDir>/pages/**/*.vue'
    // ],
    testMatch: [
        // Default
        // '**/test/**/*.js',
        // '<rootDir>/components/**/__tests__/**/*.spec.js',
        '<rootDir>/common/**/__tests__/**/*.spec.js',
    ],
};
