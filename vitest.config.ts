import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/*.test.tsx'],
    globals: false,
    passWithNoTests: false,
    testTimeout: 10000, // increase timeout for tests that involve image loading and processing
  },
})
