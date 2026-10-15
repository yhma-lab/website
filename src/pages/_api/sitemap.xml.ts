import { site } from '@/lib/site.ts'
import { absoluteUrl } from '@/lib/links.ts'
import { authors, fundings, pages, publications } from '@/lib/source.ts'

/**
 * `sitemap.xml`.
 *
 * Reproduces the shape Hugo's `sitemap.xml` template emitted: one `<url>` per
 * published page with a `<lastmod>` and `<changefreq>weekly</changefreq>`. The
 * route list is derived from the collections rather than the built output so the
 * sitemap cannot drift from the content model.
 */

type Entry = { loc: string; lastmod: string }

function entries(): Entry[] {
  const out: Entry[] = [{ lastmod: '', loc: '/' }]

  for (const page of pages.getPages('en')) {
    out.push({ lastmod: page.data.date ?? '', loc: page.url })
  }
  for (const page of publications.getPages('en')) {
    out.push({ lastmod: page.data.date, loc: page.url })
  }
  for (const page of fundings.getPages('en')) {
    out.push({ lastmod: page.data.date, loc: page.url })
  }
  for (const page of authors.getPages('en')) {
    if (page.data.title.length > 0) out.push({ lastmod: '', loc: page.url })
  }

  return out
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export const GET = () => {
  const urls = entries()
    .map((entry) => {
      const loc = `<loc>${escapeXml(absoluteUrl(site.baseUrl, normalize(entry.loc)))}</loc>`
      const lastmod = entry.lastmod.length > 0 ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''
      return `<url>${loc}${lastmod}<changefreq>weekly</changefreq></url>`
    })
    .join('')

  const body = `<?xml version="1.0" encoding="utf-8" standalone="yes"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`

  return new Response(body, { headers: { 'content-type': 'application/xml' } })
}

/** Hugo's URLs end in a slash; the loader's do not. */
function normalize(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function getConfig() {
  return Promise.resolve({ render: 'static' } as const)
}
