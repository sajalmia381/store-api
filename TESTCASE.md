# Testing

## Dependancy Pacakge
```sh
npm i -D jest supertest ts-jest mongodb-memory-server
npm i -D @types/jest @types/supertest
```
## Jest Config filename="jest.config.js"
```javascript
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.spec.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true
};
```

## setup test on package.json
```json
{
  ...
  "scripts": {
    ...
    "test": "jest"
  },
  ...
}

```

## Run command
```sh
npm test
npm test product
npm test product --watch

```