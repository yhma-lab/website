import type { SiteContextValue } from '../site-context.ts'
import type { Locale } from '../site/types.ts'
import type {
  CreatedPage,
  RegisteredRoutes,
  RouteAuthorFns,
  SiteApi,
  SitePage,
} from './types.ts'

import { createPageOf } from './create-page.ts'
import { SiteLayout, SiteRoot } from './document.tsx'
import { claimedPaths, isParameterisedPath } from './paths.ts'
import { siteApis, sitePages } from './shared-routes.ts'

/**
 * Registering the shared route table.
 *
 * Every route this repository publishes is created here, for one language, with
 * Waku's config-based API: `createRoot` and `createLayout` for the document and
 * the frame, `createPage` per page, `createApi` for the feed and the two crawler
 * files. Both flags every route carries live here too — `render: 'static'` makes
 * each site a pure static export and `unstable_disableSSR` has the build emit
 * Waku's fallback shell plus the RSC payload instead of server-rendered HTML
 * (the trade-off is in `docs-dev/README.md#rendering`).
 */

/**
 * Refuse to build a route in a language its table entry does not declare.
 *
 * Exported so `pnpm test` can assert the gate without a router instance.
 */
export function assertRouteServes(
  entry: Pick<SitePage | SiteApi, 'locales' | 'path'>,
  locale: Locale,
): void {
  if (entry.locales.includes(locale)) return
  throw new Error(
    `route ${entry.path} is not served in "${locale}": its table entry declares ${entry.locales.join(', ')}`,
  )
}

function duplicatePath(path: string): Error {
  return new Error(
    `route ${path} is declared twice in the shared route table; a path may repeat only with disjoint \`locales\``,
  )
}

/**
 * Create every shared route for the language in `context`.
 *
 * The returned `claimed` set is the concrete paths this language already
 * serves, which the catch-all subtracts from its own params and a site file
 * route is checked against.
 */
export function createSharedRoutes(
  fns: RouteAuthorFns,
  context: SiteContextValue,
): RegisteredRoutes {
  const { locale } = context
  const createPage = createPageOf(fns.createPage)
  const claimed = new Set<string>()
  const patterns = new Set<string>()
  const pages: CreatedPage[] = []
  /**
   * The table keeps its literal paths for `SharedPaths`; as a list of entries an
   * entry without `staticParams` simply has no such key, which is what the
   * registration below tests.
   */
  const table: readonly SitePage[] = sitePages
  const apis: readonly SiteApi[] = siteApis

  fns.createRoot({ component: SiteRoot, render: 'static' })
  fns.createLayout({ component: SiteLayout, path: '/', render: 'static' })

  for (const entry of table) {
    assertRouteServes(entry, locale)
    if (patterns.has(entry.path) || claimed.has(entry.path)) {
      throw duplicatePath(entry.path)
    }

    const staticPaths = entry.staticParams?.(context, claimed)
    if (staticPaths === undefined) {
      if (isParameterisedPath(entry.path)) {
        throw new Error(
          `route ${entry.path} needs staticParams: a parameterised page is prerendered from concrete params`,
        )
      }
    } else if (!isParameterisedPath(entry.path)) {
      throw new Error(
        `route ${entry.path} returns staticParams but has no wildcard or segment to fill`,
      )
    }

    // Waku reads the key's presence, not its value, and only consults it for a
    // parameterised path, so the two shapes are built separately.
    const page =
      staticPaths === undefined
        ? createPage({
            component: entry.component,
            locale,
            path: entry.path,
            render: 'static',
            unstable_disableSSR: true,
          })
        : createPage({
            component: entry.component,
            locale,
            path: entry.path,
            render: 'static',
            staticPaths,
            unstable_disableSSR: true,
          })

    patterns.add(page.path)
    for (const path of claimedPaths(entry.path, staticPaths)) claimed.add(path)
    pages.push(page)
  }

  for (const entry of apis) {
    assertRouteServes(entry, locale)
    if (patterns.has(entry.path) || claimed.has(entry.path)) {
      throw duplicatePath(entry.path)
    }
    patterns.add(entry.path)
    fns.createApi({
      handler: entry.handler(context),
      method: 'GET',
      path: entry.path,
      render: 'static',
    })
  }

  return { claimed, locale, pages, patterns }
}
