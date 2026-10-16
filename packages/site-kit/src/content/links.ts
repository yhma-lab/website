/**
 * Link building.
 *
 * Each site serves one language at the root of its own origin, so internal
 * links are plain root-relative paths and there is no locale prefix to add.
 * What remains here is the rule for *authored* URLs, which may be internal,
 * external or a same-page anchor, plus the mirror URL used by the language
 * switch.
 */

export interface SiteLink {
  /** Root-relative path, e.g. `'/'`, `'/people/yhma'`. */
  to: string
  /** Same-page anchor such as `'news'`. */
  hash?: string | undefined
}

/** Build an href from an internal link, preserving anchors. */
export function siteHref(link: SiteLink): string {
  if (link.hash === undefined) return link.to
  return `${link.to === '/' ? '' : link.to}#${link.hash}`
}

/**
 * Resolve an authored URL.
 *
 * Front matter writes internal links as `/publications/`; external URLs and
 * anchors pass through untouched. Since each site serves one language at its own
 * origin there is no prefix to add — this is the one place that knows that, and
 * it normalises the empty URL to the site root.
 */
export function resolveInternal(url: string): string {
  return url.length === 0 ? '/' : url
}

/** Absolute URL for feeds and structured data. */
export function absoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Absolute URL on the paired site, mirroring the current path.
 *
 * Both sites publish the same routes, so the language switch keeps the visitor
 * on the same page instead of dropping them at the other site's home page.
 * A path with no file extension is normalised to the trailing-slash form the
 * static export publishes (`/people/yhma/index.html` is served as
 * `/people/yhma/`).
 */
export function alternateUrl(
  alternateBaseUrl: string,
  pathname: string,
): string {
  const base = alternateBaseUrl.endsWith('/')
    ? alternateBaseUrl.slice(0, -1)
    : alternateBaseUrl
  if (pathname === '' || pathname === '/') return `${base}/`

  const hasExtension = /\.[a-z0-9]+$/i.test(pathname)
  const normalized =
    pathname.endsWith('/') || hasExtension ? pathname : `${pathname}/`

  return `${base}${normalized.startsWith('/') ? '' : '/'}${normalized}`
}
