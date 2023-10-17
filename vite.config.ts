import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // https://dev.to/lico/react-vitest-tutorial-set-up-and-test-examples-with-todo-app-519i
    globals: true,
    setupFiles: "./setupTests.ts",
    testTimeout: 15000,
    maxConcurrency: 3,
  },
});
