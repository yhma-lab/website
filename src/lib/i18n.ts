import { defineI18n } from 'fumadocs-core/i18n'

/**
 * Locales.
 *
 * `hideLocale: 'default-locale'` keeps the English URLs exactly as they were
 * under Hugo (`/publication/<slug>/`) and prefixes only Chinese
 * (`/cn/publication/<slug>/`).
 *
 * `parser: 'dot'` reads translations from a locale marker before the extension,
 * so a translated file is `index.cn.mdx` next to `index.mdx`.
 *
 * `fallbackLanguage: null` means an untranslated page simply has no `/cn/` URL
 * instead of silently serving its English body under a Chinese prefix.
 */
export const i18n = defineI18n({
  defaultLanguage: 'en',
  fallbackLanguage: null,
  hideLocale: 'default-locale',
  languages: ['en', 'cn'],
  parser: 'dot',
})

export type Locale = 'cn' | 'en'
