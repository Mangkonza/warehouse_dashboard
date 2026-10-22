import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Architecture Boundary Rules (nextjs-project-structure.en.md & User Binding Amendments)
  // 1. components/ must NEVER import from features/ or app/
  {
    files: ["src/components/**/*.ts", "src/components/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features", "@/app/*", "@/app", "../features/*", "../app/*"],
              message: "Architecture boundary violation: components/ must NEVER import from features/ or app/.",
            },
          ],
        },
      ],
    },
  },
  // 2. lib/ must NEVER import from features/, components/, or app/
  {
    files: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features",
                "@/components/*",
                "@/components",
                "@/app/*",
                "@/app",
                "../features/*",
                "../components/*",
                "../app/*",
              ],
              message: "Architecture boundary violation: lib/ must NEVER import from features/, components/, or app/.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
