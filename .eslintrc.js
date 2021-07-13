module.exports = {
  extends: '@youjinbu',
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules', 'bin'],
}
