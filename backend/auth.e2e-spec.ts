import { SecRunner } from '@sectester/runner';
import axios from 'axios';

const generateToken = async (jwtType) => {
  const { headers } = await axios.post(
    `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/login`,
    {
      user: 'admin',
      password: 'admin',
      op: 'basic'
    }
  );
  return headers.authorization;
};

describe('/api', () => {
  const timeout = 600000;
  jest.setTimeout(timeout);

  let runner: SecRunner;

  beforeEach(async () => {
    runner = new SecRunner({ hostname: process.env.BRIGHT_CLUSTER });
    await runner.init();
  });

  afterEach(() => runner.clear());

  describe('GET /auth/jwt/{jwtType}/validate', () => {
    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'kid-sql';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });

    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'weak-key';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });

    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'jku';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });

    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'jwk';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });

    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'x5c';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });

    it('should contain secure implementation of JSON Web Token (JWT)', async () => {
      const jwtType = 'x5u';
      const token = await generateToken(jwtType);
      await runner
        .createScan({ tests: ['jwt'], name: `JWT ${jwtType}` })
        .timeout(timeout)
        .run({
          method: 'GET',
          headers: { authorization: token },
          url: `${process.env.SEC_TESTER_TARGET}/api/auth/jwt/${jwtType}/validate`
        });
    });
  });
});
