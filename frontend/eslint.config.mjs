// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: ['**/dist/', '**/public/', '**/vcs/']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports'
        }
      ]
    }
  }
);
