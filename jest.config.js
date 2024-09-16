export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [
    '.ts',
    '.tsx'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
