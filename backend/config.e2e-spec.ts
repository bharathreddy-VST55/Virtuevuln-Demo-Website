import { SecRunner } from '@sectester/runner';

describe('/api', () => {
  const timeout = 600000;
  jest.setTimeout(timeout);

  let runner: SecRunner;

  beforeEach(async () => {
    runner = new SecRunner({ hostname: process.env.BRIGHT_CLUSTER });
    await runner.init();
  });

  afterEach(() => runner.clear());

  describe('GET /config', () => {
    it('should use and implement cookies with secure attributes', async () => {
      await runner
        .createScan({
          tests: ['cookie_security'],
          name: expect.getState().currentTestName
        })
        .timeout(timeout)
        .run({
          method: 'GET',
          url: `${process.env.SEC_TESTER_TARGET}/api/config`
        });
    });

    it('should not contain secret tokens leak', async () => {
      await runner
        .createScan({
          tests: ['secret_tokens'],
          name: expect.getState().currentTestName
        })
        .timeout(timeout)
        .run({
          method: 'GET',
          url: `${process.env.SEC_TESTER_TARGET}/api/config?query=no-sec-headers`
        });
    });

    it('should not contain errors that include full webroot path', async () => {
      await runner
        .createScan({
          tests: ['full_path_disclosure'],
          name: expect.getState().currentTestName
        })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: {
            cookie: `bc-calls-counter=${Date.now().toString()}`
          },
          url: `${process.env.SEC_TESTER_TARGET}/api/config`
        });
    });
  });
});
