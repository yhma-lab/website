import type { SiteConfig } from '../site/types.ts'

/**
 * `robots.txt`.
 *
 * The previous build enabled `enableRobotsTXT`, which emitted exactly this file:
 * an allow-all group plus the sitemap URL. It is served from an API route rather
 * than `public/` so the host in the sitemap line cannot drift from the site's
 * `baseUrl`.
 */
export function robotsRoute(site: SiteConfig) {
  return {
    GET: () =>
      new Response(`User-agent: *\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`, {
        headers: { 'content-type': 'text/plain' },
      }),
    // Prerendered at build time; the API routes have no runtime component.
    getConfig: () => Promise.resolve({ render: 'static' } as const),
  }
}
