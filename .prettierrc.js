// @ts-check
/**
 * @see {@link https://prettier.io/docs/configuration}
 * @type {import('prettier').Config}
 * @internal
 */
const config = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  plugins: [
    '@prettier/plugin-oxc',
    'prettier-plugin-packagejson',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-properties',
    // '@castlabs/prettier-tsdoc-plugin',
  ],
  // Options for sort-imports plugin
  importOrder: [
    '<TYPES>^(node:)',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '',
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '',
    '^@alphainbay/(.*)$',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '7.0.0',
  // Overrides for specific file types
  overrides: [
    {
      files: '.env*',
      options: {
        printWidth: 0,
      },
    },
  ],
}
export default config
