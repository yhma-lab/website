/** @import { ConfigWithExtends } from '@eslint/config-helpers' */
import process from 'node:process'
import packageJson from 'eslint-package-json'
import { defineConfig, globalIgnores } from 'eslint/config'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'

import eslintReact from '@eslint-react/eslint-plugin'
import { rules } from '@stylexjs/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'

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

const customIgnores = globalIgnores([
  '**/node_modules/**',
  '**/dist/**',
  '**/.emit/**',
  '**/.references/**',
  '**/.agents/**',
])

const config = defineConfig(customIgnores, packageJsonConfig, {
  files: [tseslint.globs.ts],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      projectService: {
        // allowDefaultProject: ['eslint.config.js'],
        defaultProject: 'tsconfig.json',
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
})

export default config
