/* -----------------------------------
 *
 * Config
 *
 * -------------------------------- */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    'no-void': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/first': 'off',
    'import/order': 'off',
    'linebreak-style': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'const', next: 'function' },
      { blankLine: 'always', prev: 'const', next: 'return' },
      { blankLine: 'always', prev: 'const', next: 'if' },
      { blankLine: 'always', prev: 'const', next: 'try' },
      { blankLine: 'always', prev: 'const', next: 'expression' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
