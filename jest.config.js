module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json',
            isolatedModules: true,
        },
    },
};
