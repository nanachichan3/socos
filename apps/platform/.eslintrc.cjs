/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@socos/eslint-config/library.js'],
  env: {
    browser: true,
    es2020: true,
  },
};
