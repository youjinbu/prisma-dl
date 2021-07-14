module.exports = {
  extends: '@youjinbu',
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules', 'bin'],
  settings: {
    react: {
      version: '999.999.999',
    },
  },
}
