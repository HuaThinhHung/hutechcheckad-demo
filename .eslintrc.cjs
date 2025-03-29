module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    // including prettier here ensures that we don't set any rules which will conflict
    // with Prettier's formatting. Keep it last in the list so that nothing else messes
    // with it!
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error'
  },
  overrides: [
    {
      files: 'bin/**',
      rules: {
        'no-var': 'off'
      }
    }
  ]
}
