import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/coverage/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
);
