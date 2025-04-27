import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import importAlias from "eslint-plugin-import-alias";
import unusedImports from "eslint-plugin-unused-imports";

// MEMO: 直したいけど直し方がわからない、一応動くのでこのままにしておく
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "airbnb-base",
      "plugin:import/typescript",
      "prettier",
    ),
  ),
  {
    ignores: ["eslint.config.mjs"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: fixupPluginRules(_import),
      "unused-imports": unusedImports,
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      "import-alias": importAlias,
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        alias: {
          map: [
            {
              alias: "@",
              name: "./src",
            },
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    rules: {
      // 一般的なDDD用の緩和ルール
      "consistent-return": "off",
      "no-underscore-dangle": "off",
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": "error",
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "off",
      "class-methods-use-this": "off",
      "max-classes-per-file": "off",
      
      // プロパティの命名規則の緩和（DDDで_privatePropsが使いやすくなる）
      "camelcase": "off",
      
      // 未使用変数チェックの緩和
      // TODO: 一旦警告にするが、構築完了後に調整が必要
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          args: "none",
          caughtErrors: "all",
        },
      ],

      // インポート関連
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "unused-imports/no-unused-imports": "error",

      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
          },
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      "import-alias/import-alias": [
        "warn",
        {
          "relativeDepth": 0
        },
      ],

      "no-restricted-imports": [
        "warn",
        {
          patterns: ["./*", "../*"],
        },
      ],
    },
  },
  // テスト用の設定
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "no-unused-expressions": "off",
      "max-classes-per-file": "off",
      "no-useless-constructor": "off",
    },
  },
];