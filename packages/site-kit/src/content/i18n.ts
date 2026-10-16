import type { Locale } from '../site/types.ts'

import { defineI18n } from 'fumadocs-core/i18n'

/**
 * Locale configuration for one site.
 *
 * Both sites keep `defaultLanguage: 'en'`: with `parser: 'dot'` the unsuffixed
 * file (`index.mdx`) is the English body and `index.cn.mdx` the Chinese one, so
 * the parser's default and the content tree's convention have to agree.
 *
 * What differs is the *serving* side:
 *
 * - the English site keeps `hideLocale: 'default-locale'`, so English URLs stay
 *   exactly as Hugo published them and nothing is prefixed;
 * - the Chinese site serves Chinese on its own origin, so `hideLocale: 'always'`
 *   drops the prefix for the `cn` storage too, and every route path matches the
 *   English site one for one — which is what makes the language switch a plain
 *   path-preserving link.
 *
 * `fallbackLanguage: 'en'` gives the Chinese site the English body for entries
 * that have no `index.cn.mdx` yet: the `cn` storage inherits the `en` one, so a
 * page is never missing, it is just not translated. The English site has no
 * fallback, because English is the source language.
 */
export function createSiteI18n(locale: Locale) {
  const chinese = locale === 'cn'

  return defineI18n({
    defaultLanguage: 'en',
    fallbackLanguage: chinese ? 'en' : null,
    hideLocale: chinese ? 'always' : 'default-locale',
    languages: ['en', 'cn'],
    parser: 'dot',
  })
}
