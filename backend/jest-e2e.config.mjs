import baseConfig from '../jest.config.json' assert { type: 'json' };

export default {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
  rootDir: '.'
};
