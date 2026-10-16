/**
 * The documents published at fixed paths.
 *
 * Each factory returns the build-time handler the shared route table registers as
 * a static API route (`siteApis` in `../router/shared-routes.ts`).
 */
export { feedHandler } from './feed.ts'
export { robotsHandler } from './robots.ts'
export { sitemapHandler } from './sitemap.ts'
