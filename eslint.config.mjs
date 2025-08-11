import html from "@html-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["temp", "node_modules", "dist"]
  },
  {
    ...react.configs.flat.recommended,
    files: ["src/renderer/**/*.ts", "src/renderer/**/*.tsx"],
    settings: {
      react: {
        version: "detect"
      },
      ecmaFeatures: {
        jsx: true,
        modules: true
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off"
    }
  },
  html.configs["flat/recommended"],
  tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
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
