import type {
  CreatedPage,
  FileRouteModule,
  FileRouteModules,
  RegisteredRoutes,
  RouteAuthorFns,
} from './types.ts'

import { createPageOf } from './create-page.ts'
import { isParameterisedPath } from './paths.ts'

/**
 * Routes a single site owns.
 *
 * The shared table covers the routes both sites publish; a route that belongs to
 * one site is a module under that site's `src/pages/`, which the app's
 * `waku.server.tsx` hands here as an eager `import.meta.glob`.
 *
 * Waku cannot run its file-system router in the same app as the config-based one
 * the shared table uses (`fsRouter` is a translator over `createPage`, and it is
 * not composable), so this module implements the small subset of the `src/pages`
 * conventions both sites need, using only `createPage`:
 *
 * - `./pages/index.tsx` → `/`, `./pages/blog.tsx` and `./pages/blog/index.tsx` → `/blog`;
 * - a file named `[...slugs].tsx` is a wildcard route and must export `staticPaths`;
 * - a path segment starting with `_` or `.`, and every file that is not
 *   `.ts`/`.tsx`, is ignored, so co-located modules and a `README.md` sit next to
 *   the routes.
 *
 * `_layout`, `_root`, `_api`, `_slices` and route groups are not part of the
 * subset: the document, the frame and the feed/crawler files are shared.
 */

/** A route file: TypeScript, because the components are TSX. */
const ROUTE_FILE = /\.(tsx|ts)$/

/** The directory the glob is rooted at; keys arrive as `pages/<path>`. */
const PAGES_DIR = 'pages/'

/** The directory's own route, exactly as in Waku's file router. */
const INDEX = 'index'

/**
 * Route path for a key from `import.meta.glob('./pages/**\/*')`.
 *
 * This is the subset of Waku's conventions documented above. Returns `undefined`
 * for a key that is not a route file, including the reserved `_`-prefixed ones.
 * A site's page directory belongs to that site's language, so no language is
 * involved here; the file loader stamps the app's own.
 */
export function routePathForFile(key: string): string | undefined {
  // `fsRouter` normalises glob keys the same way, so a URL-encoded file name and
  // a page directory outside the app root both map to the path they describe.
  const srcPath = new URL(key, 'http://localhost:3000').pathname.slice(1)
  if (!srcPath.startsWith(PAGES_DIR) || !ROUTE_FILE.test(srcPath)) {
    return undefined
  }

  const segments = srcPath
    .slice(PAGES_DIR.length)
    .replace(ROUTE_FILE, '')
    .split('/')
    .filter(Boolean)
  if (
    segments.length === 0 ||
    segments.some(segment => segment.startsWith('_') || segment.startsWith('.'))
  ) {
    return undefined
  }

  const routeSegments =
    segments.at(-1) === INDEX ? segments.slice(0, -1) : segments
  return `/${routeSegments.join('/')}`
}

/**
 * Create the routes a site owns, for the language `shared` was registered for.
 *
 * A path the shared table already serves in this language is an error rather
 * than a silent override: the shared table is where a path with more than one
 * language belongs.
 */
export function createFileRoutes(
  fns: Pick<RouteAuthorFns, 'createPage'>,
  modules: FileRouteModules,
  shared: RegisteredRoutes,
): CreatedPage[] {
  const createPage = createPageOf(fns.createPage)
  const { locale } = shared
  /** Route file by the path it claims, so two files cannot both claim one. */
  const files = new Map<string, string>()
  const pages: CreatedPage[] = []

  for (const key of Object.keys(modules).sort()) {
    const path = routePathForFile(key)
    if (path === undefined) continue

    const owner = files.get(path)
    if (owner !== undefined) {
      throw new Error(`route ${path} is claimed by both ${owner} and ${key}`)
    }
    if (shared.patterns.has(path) || shared.claimed.has(path)) {
      throw new Error(
        `route ${path} from ${key} is already served by the shared route table in "${locale}"; ` +
          'give this page a path only this site publishes, or add a `sitePages` entry with the languages that serve it',
      )
    }
    files.set(path, key)

    /** An eager glob gives the module itself; a missing one stays empty. */
    const mod: Partial<FileRouteModule> = modules[key] ?? {}
    const component = mod.default
    if (typeof component !== 'function') {
      throw new Error(
        `${key} must default-export the component that renders ${path}`,
      )
    }

    const staticPaths = mod.staticPaths
    if (isParameterisedPath(path) && staticPaths === undefined) {
      throw new Error(
        `${key} is a wildcard route: export \`staticPaths\` with the concrete params to prerender`,
      )
    }
    if (!isParameterisedPath(path) && staticPaths !== undefined) {
      throw new Error(
        `${key} exports \`staticPaths\` but ${path} has no wildcard`,
      )
    }

    const page =
      staticPaths === undefined
        ? createPage({
            component,
            locale,
            path,
            render: 'static',
            unstable_disableSSR: true,
          })
        : createPage({
            component,
            locale,
            path,
            render: 'static',
            staticPaths,
            unstable_disableSSR: true,
          })

    pages.push(page)
  }

  return pages
}
