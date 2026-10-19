import type { PluginOption } from 'vite'

import { fileURLToPath } from 'node:url'

import stylex from '@stylexjs/unplugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
    include: [
      'react-aria-components/Button',
      'react-aria-components/Disclosure',
      'react-aria-components/composeRenderProps',
    ],
  },
  plugins: [
    stylex.vite({
      devMode: 'css-only',
      devPersistToDisk: false,
      useCSSLayers: true,
      runtimeInjection: false,
      treeshakeCompensation: true,
      enableMediaQueryOrder: false,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: workspaceRoot,
      },
    }) as PluginOption,
    react(),
  ],
  test: {
    include: ['src/**/*.browser.test.tsx'],
    setupFiles: ['src/__tests__/browser.setup.ts'],
    restoreMocks: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
