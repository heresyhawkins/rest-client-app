/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/', 'src/setupTests.ts', '*.config.ts', '*.config.js', '**/*.d.ts'],
    },
  },
  plugins: [tsconfigPaths()],
})
