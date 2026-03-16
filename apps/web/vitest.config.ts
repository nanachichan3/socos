import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
      "@ts-monorepo-boilerplate/common": path.resolve(__dirname, "../../packages/shared-package/src"),
    },
  },
});
