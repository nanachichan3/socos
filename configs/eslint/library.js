/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js", "./additional-rules.js"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
};
