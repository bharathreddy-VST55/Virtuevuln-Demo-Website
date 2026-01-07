import { hash, verify } from 'argon2';

export const hashPassword = (password: string): Promise<string> =>
  hash(password);

export const passwordMatches = (
  password: string,
  hash: string
): Promise<boolean> => verify(hash, password);
