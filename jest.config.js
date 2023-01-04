module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
      '^.+\\.(css|less|scss|sass|png|jpg|gif|svg|html|worker)$': 'identity-obj-proxy',
    },
};