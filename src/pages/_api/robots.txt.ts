import { site } from '@/lib/site.ts'

/**
 * `robots.txt`.
 *
 * The previous build enabled `enableRobotsTXT`, which emitted exactly this file:
 * an allow-all group plus the sitemap URL. It is served from an API route rather
 * than `public/` so the host in the sitemap line cannot drift from `site.baseUrl`.
 */
export const GET = () =>
  new Response(`User-agent: *\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`, {
    headers: { 'content-type': 'text/plain' },
  })

export function getConfig() {
  return Promise.resolve({ render: 'static' } as const)
}
