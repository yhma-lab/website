import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test discovery must not descend into the vendored reference checkouts.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.references/**',
      '**/.source/**',
    ],
    environment: 'node',
    include: [
      'packages/*/src/**/*.test.ts',
      'packages/*/src/**/*.test.tsx',
      'sites/*/src/**/*.test.ts',
      'sites/*/src/**/*.test.tsx',
    ],
  },
})
