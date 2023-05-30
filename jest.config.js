module.exports = {
    roots: ['<rootDir>'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
        '\\.(css|scss|less|sass)$': '<rootDir>/__mocks__/styleMock.js',
        '^@app(.*)$': '<rootDir>/src/app$1',
        '^@layouts(.*)$': '<rootDir>/src/layouts$1',
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@shared(.*)$': '<rootDir>/src/shared$1',
        '^@modules(.*)$': '<rootDir>/src/modules$1',
        '^@styles(.*)$': '<rootDir>/src/styles$1',
        '^@services(.*)$': '<rootDir>/src/services$1',
        '^@models(.*)$': '<rootDir>/src/models$1',
        '^@stores(.*)$': '<rootDir>/src/stores$1',
        '^@public(.*)$': '<rootDir>/public$1',
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        '^.+\\.(js|jsx|ts|tsx)$': [
            'babel-jest',
            {
                presets: ['next/babel'],
                plugins: [
                    [
                        'module-resolver',
                        {
                            root: ['./'],
                            alias: {
                                '@app': './src/app',
                                '@layouts': './src/layouts',
                                '@components': './src/components',
                                '@shared': './src/components/shared',
                                '@modules': './src/components/modules',
                                '@styles': './src/styles',
                                '@services': './src/services',
                                '@models': './src/models',
                                '@stores': './src/stores',
                                '@public': './public',
                                '@': './'
                            }
                        }
                    ]
                ]
            }
        ]
    }
}
