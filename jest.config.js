module.exports = {
  "verbose": true,
  // "collectCoverage": true,
  "preset": "jest-preset-angular",
  "globalSetup": 'jest-preset-angular/global-setup',
  "testRunner": 'jest-jasmine2',
  "testEnvironment": "jsdom",
  "moduleDirectories": ["node_modules", "src"],
  "setupFilesAfterEnv": [
      "<rootDir>/setup-jest.ts"
  ],
  "transformIgnorePatterns": [
      "node_modules/(?!@ngrx|ngx-socket-io)" // List any packages here that error
  ],
  "transform": {
      "^.+\\.(ts|js|html)$": "jest-preset-angular"
  },
  "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/cypress/",
      "<rootDir>/src/test.ts",
  ]
};
