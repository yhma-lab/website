import type { Locale } from './i18n.ts'

/** The locale a route group serves. */
export function localeOf(prefix: string): Locale {
  return prefix === '/cn' ? 'cn' : 'en'
}
