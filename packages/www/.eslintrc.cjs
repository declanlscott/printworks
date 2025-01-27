/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ["@printworks/eslint-config/astro.cjs"],
    parserOptions: {
      project: true,
    },
    overrides: [
      {
        files: ["*.astro"],
        parser: "astro-eslint-parser",
        parserOptions: {
          parser: "@typescript-eslint/parser",
          extraFileExtensions: [".astro"],
        },
      },
    ],
  };
  