import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
    trailingComma: "all",
  },
  ignores: ["README.md", "**/migrations/*"],
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": ["error", { tsconfigRootDir: "." }],
    "perfectionist/sort-jsx-props": ["error"],
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: ["README.md"],
    }],
    "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "unused-imports/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
  },
});
