const html = require("@html-eslint/eslint-plugin");
const react = require("eslint-plugin-react");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: ["temp", "*.js", "node_modules", "dist/**/*"]
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions
    },
    settings: {
      react: {
        version: "detect"
      },
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off"
    },
    ...react.configs.flat.recommended
  },
  html.configs["flat/recommended"],
  tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ]
    }
  }
);
