/**
 * `@yhma/site-kit/router`.
 *
 * The route table both sites publish and the seam Waku's config-based router is
 * driven from: an app's `src/waku.server.tsx` calls `createSharedRoutes` for its
 * language and then `createFileRoutes` for the routes only it owns. See
 * `docs-dev/README.md#routing`.
 */
export { SiteLayout, SiteRoot } from './document.tsx'
export { createFileRoutes, routePathForFile } from './file-routes.ts'
export { createSharedRoutes } from './register.ts'
export { type SharedPaths, siteApis, sitePages } from './shared-routes.ts'
export type {
  CreatedPage,
  FileRouteModule,
  FileRouteModules,
  PageComponent,
  RegisteredRoutes,
  RouteAuthorFns,
  SiteApi,
  SitePage,
} from './types.ts'
