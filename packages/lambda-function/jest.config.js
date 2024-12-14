module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    moduleNameMapper: {
      "^/opt/(.*)$": "<rootDir>/../infrastructure/lambda-layer/$1"
    }
  };
  