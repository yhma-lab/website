import type { ReactNode } from 'react'
import type {
  CreateApi,
  CreateLayout,
  CreatePage,
  CreateRoot,
} from 'waku/router/server'
import type { SiteContextValue } from '../site-context.ts'
import type { Locale } from '../site/types.ts'

/**
 * Router types.
 *
 * A route is data: the path, the languages that serve it, and what renders it.
 * `shared-routes.ts` is the one description of the routes both sites publish;
 * `register.ts` turns it into Waku's config-based router, and `file-routes.ts`
 * adds the routes a single site owns.
 *
 * `locale` is a field rather than something derived from the file layout, so
 * "which languages serve this page" is a decision in one table instead of a
 * property of two identical file trees.
 */

/**
 * Props Waku hands a page component.
 *
 * Waku passes the slug segments of a wildcard route (`{ slugs: ['yhma'] }` for
 * `/people/[...slugs]`) and nothing else besides `path`; only a wildcard route
 * receives `slugs` at all, hence the optional field.
 */
export type PageComponent = (props: { slugs?: string[] }) => ReactNode

/**
 * The handler `createApi` accepts.
 *
 * Restated rather than imported: `waku/router/server` does not re-export
 * `ApiHandler`, which lives in its internal `create-pages-utils`. The shape is
 * Waku's, and a handler typed here is assignable where Waku expects one.
 */
export type ApiHandler = (
  request: Request,
  context: { params: Record<string, string | string[]> },
) => Promise<Response>

/**
 * A route from the shared table.
 *
 * `locales` is required and exhaustive: a language that is not listed does not
 * serve the route, and registering it for that language throws. A path that
 * needs different content per language is written as two entries with disjoint
 * `locales`.
 */
export interface SitePage {
  locales: readonly Locale[]
  path: string
  component: PageComponent
  /**
   * Concrete route params for a path with a wildcard or a segment, read from the
   * site's content source. A wildcard route without this cannot be prerendered,
   * and the registrar rejects it instead of letting Waku fail with a generic
   * "Invalid page configuration".
   *
   * `claimed` reports the paths the table registered before this entry, so the
   * catch-all can leave the pages other routes own to those routes.
   */
  staticParams?: (
    context: SiteContextValue,
    claimed: ReadonlySet<string>,
  ) => readonly string[] | readonly (readonly string[])[]
}

/**
 * A document published at a fixed path: the feed and the two crawler files.
 *
 * Registered as a static API route, so the response is written into the site's
 * build output rather than served at request time.
 */
export interface SiteApi {
  locales: readonly Locale[]
  path: string
  /** Build-time handler for the language being built. */
  handler: (context: SiteContextValue) => ApiHandler
}

/** The Waku authoring functions `createPages` hands its callback. */
export interface RouteAuthorFns {
  createApi: CreateApi
  createLayout: CreateLayout
  createPage: CreatePage
  createRoot: CreateRoot
}

/**
 * A page the router created, carrying the language it was created for.
 *
 * Waku ignores the extra field at runtime — it only reads the keys it knows —
 * but it is what makes the registration language-aware, and it is what the
 * router hands back to a caller that wants to report on the route set.
 */
export interface CreatedPage {
  locale: Locale
  path: string
  render: 'static' | 'dynamic'
  staticPaths?: readonly string[] | readonly (readonly string[])[]
}

/** What `createSharedRoutes` registered for one language. */
export interface RegisteredRoutes {
  /** Concrete paths the table claimed, e.g. `/people/yhma`. */
  claimed: ReadonlySet<string>
  locale: Locale
  /** The page descriptors, in table order. */
  pages: CreatedPage[]
  /** Path patterns the table declared, e.g. `/people/[...slugs]`. */
  patterns: ReadonlySet<string>
}

/** A module under a site's `src/pages/`, as `import.meta.glob` returns it. */
export interface FileRouteModule {
  default: PageComponent
  /** Params for a file whose name is `[...slugs].tsx`. */
  staticPaths?: readonly string[] | readonly (readonly string[])[]
}

/** An eager `import.meta.glob` result: `{ './pages/foo.tsx': module }`. */
export type FileRouteModules = Record<string, unknown>
