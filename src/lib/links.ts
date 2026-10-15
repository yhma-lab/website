/**
 * Locale-aware link building.
 *
 * `hideLocale: 'default-locale'` keeps English at the site root and prefixes
 * Chinese with `/cn`, so every internal link goes through these helpers rather
 * than concatenating strings at each call site.
 */

export interface SiteLink {
  /** Root-relative path, e.g. `'/'`, `'/people/yhma'`. */
  to: string
  /** Same-page anchor such as `'news'`; never locale-prefixed. */
  hash?: string | undefined
}

/** Prefix a root-relative path for a locale. */
export function localePath(prefix: string, to: string): string {
  const base = to === '/' ? '' : to
  if (prefix.length === 0) return base.length > 0 ? base : '/'
  return `${prefix}${base}`
}

/** Build an href from an internal link, preserving anchors. */
export function siteHref(prefix: string, link: SiteLink): string {
  const path = localePath(prefix, link.to)
  if (link.hash === undefined) return path
  return `${path === '/' ? '' : path}#${link.hash}`
}

/**
 * Resolve an authored internal URL.
 *
 * Front matter writes internal links as `/publications/`; external URLs and
 * anchors pass through untouched so the locale prefix never leaks onto them.
 */
export function resolveInternal(prefix: string, url: string): string {
  if (url.length === 0) return '/'
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return url
  return localePath(prefix, url)
}

/** Absolute URL for feeds and structured data. */
export function absoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}
