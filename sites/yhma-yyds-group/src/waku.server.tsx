import type { SharedPaths } from '@yhma/site-kit/router'

import { createFileRoutes, createSharedRoutes } from '@yhma/site-kit/router'
import { createPages } from 'waku'
import adapter from 'waku/adapters/default'

import { context } from './lib/site-context.ts'

/**
 * This site's router.
 *
 * The routes both sites publish come from the shared table in
 * `@yhma/site-kit/router`: one entry per route, naming the languages that serve
 * it, registered here for this site's language. A route only this site has is a
 * module under `src/pages/` — see `src/pages/README.md`.
 *
 * The site context is imported (and so defined) before anything renders, which
 * is what lets the shared shell and views read this app's identity and content.
 */
const pages = createPages(fns => {
  const shared = createSharedRoutes(fns, context)
  const files = createFileRoutes(
    fns,
    import.meta.glob('./pages/**/*', { eager: true }),
    shared,
  )
  return Promise.resolve([...shared.pages, ...files])
})

declare module 'waku/router' {
  /**
   * The paths this app navigates to by name. The parameterised routes
   * (`/people/[...slugs]` and the other archives) are content URLs rather than a
   * fixed set, so they are not part of the union.
   */
  interface RouteConfig {
    paths: SharedPaths
  }
}

export default adapter(pages)
