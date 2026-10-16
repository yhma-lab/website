import type { ApiHandler } from '../router/types.ts'
import type { SiteConfig } from '../site/types.ts'

/**
 * `robots.txt`.
 *
 * The previous build enabled `enableRobotsTXT`, which emitted exactly this file:
 * an allow-all group plus the sitemap URL. It is served from an API route rather
 * than `public/` so the host in the sitemap line cannot drift from the site's
 * `baseUrl`; the shared route table writes the response to
 * `dist/public/robots.txt` at build time.
 */
export function robotsHandler(site: SiteConfig): ApiHandler {
  return () =>
    Promise.resolve(
      new Response(`User-agent: *\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`, {
        headers: { 'content-type': 'text/plain' },
      }),
    )
}
