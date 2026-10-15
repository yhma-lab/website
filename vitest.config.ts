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
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
