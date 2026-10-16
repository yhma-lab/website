/** @import { ConfigWithExtends } from '@eslint/config-helpers' */
import process from 'node:process'

import eslintReact from '@eslint-react/eslint-plugin'
import { rules } from '@stylexjs/eslint-plugin'
import packageJson from 'eslint-package-json'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

/** @type { ConfigWithExtends } */
const packageJsonConfig = {
  files: ['**/package.json'],
  plugins: { 'package-json': packageJson },
  extends: [packageJson.configs.all],
  rules: {
    // https://github.com/sindresorhus/eslint-package-json/blob/main/docs/rules/require-types-in-exports.md
    // Doesn't support type file ends with `.ts` directly now
    'package-json/require-types-in-exports': 'off',
    // https://github.com/sindresorhus/eslint-package-json/blob/main/docs/rules/sort-properties.md
    'package-json/sort-properties': 'off',
    'package-json/no-pre-release-dependencies': 'off',
    /**
     * The rule assumes a nested `package.json` is a sub-directory of the root
     * package, which a consumer never resolves by name. A pnpm workspace member is
     * nested by path but *is* resolved by name (pnpm links it into
     * `node_modules/`), so its `exports` is honored and the rule does not apply.
     */
    'package-json/no-nested-exports': 'off',
    // `@types/mdx` supplies `MDXContent` for the compiled bodies; the MDX
    // compiler itself is `fumadocs-mdx`, so there is no `mdx` package to pair
    // with it.
    'package-json/no-orphan-types': 'off',
  },
}
const reactExtends = [
  eslintReact.configs['recommended-typescript'],
  reactHooks.configs.flat['recommended-latest'],
  reactYouMightNotNeedAnEffect.configs.strict,
  // reactRefresh.configs.recommended(),
]

const stylexRules = {
  '@stylexjs/no-unused': 'warn',
  '@stylexjs/no-legacy-contextual-styles': 'error',
  '@stylexjs/sort-keys': ['error', { order: 'recess' }],
}
const stylexConfig = {
  plugins: {
    // @ts-ignore
    '@stylexjs': { rules },
  },
  // @ts-ignore
  rules: { ...stylexRules },
}

/**
 * `dangerouslySetInnerHTML` is used in three places, each with a fixed, trusted
 * source: KaTeX's own output for front-matter math, the inlined SVG bodies from
 * `icon-data.ts`, and the pre-paint theme bootstrap script.
 */
const trustedHtml = {
  files: [
    'packages/site-kit/src/components/math-text.tsx',
    'packages/site-kit/src/components/icon.tsx',
    'packages/site-kit/src/shell/root-shell.tsx',
  ],
  rules: { '@eslint-react/dom-no-dangerously-set-innerhtml': 'off' },
}

const customIgnores = globalIgnores([
  '**/node_modules/**',
  '**/dist/**',
  '**/.emit/**',
  '**/.references/**',
  '**/.agents/**',
  // Generated: `.source/` by fumadocs-mdx, `src/pages.gen.ts` by Waku router typegen.
  '**/.source/**',
  '**/src/pages.gen.ts',
])

const config = defineConfig(
  customIgnores,
  packageJsonConfig,
  {
    files: [tseslint.globs.ts],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        /**
         * Typed linting across a workspace: `service: true` finds the nearest
         * `tsconfig.json` for each file instead of assuming a single project at
         * the repository root (the sites and the kit each own theirs).
         */
        projectService: {
          defaultProject: false,
          // `eslint.config.js` itself is not part of any tsconfig.
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      perfectionist,
      unicorn,

      // '@stylexjs': { rules },
    },
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      ...reactExtends,
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      '@typescript-eslint/consistent-type-definitions': 'warn',

      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],

      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            FC: {
              message:
                'Avoid `React.FC`. Use explicit prop types and return values instead.',
            },
          },
        },
      ],

      // FIXME: temporarily disabled for refactoring / optimization
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // // Spread any additional rules provided in the options
      // ...rules,
    },

    // Spread any additional overrides provided in the options
    // ...stylexRules,
  },
  trustedHtml,
)

export default config
