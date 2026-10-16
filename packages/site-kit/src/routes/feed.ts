import type { ContentSource } from '../content/source.ts'
import type { SiteConfig } from '../site/types.ts'

import { absoluteUrl } from '../content/links.ts'

/**
 * Site feed.
 *
 * Hugo published it at `/index.xml`; keeping that path avoids breaking existing
 * subscribers. Items are the same set the old RSS template listed: publications
 * and funded projects, newest first, each with a `pubDate` and a link. The
 * Chinese site gets its own feed in the same place, with its own titles and
 * absolute links.
 */

type Item = { date: string; description: string; link: string; title: string }

function items(source: ContentSource): Item[] {
  const publications = source.sortedPublications().map(page => ({
    date: page.data.date,
    description: page.data.abstract,
    link: page.url,
    title: page.data.title,
  }))
  const fundings = source.sortedFundings().map(page => ({
    date: page.data.date,
    description: page.data.summary,
    link: page.url,
    title: page.data.title,
  }))

  return [...publications, ...fundings].toSorted(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function ensureSlash(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function feedRoute(site: SiteConfig, source: ContentSource) {
  const GET = () => {
    const list = items(source)
    const lastBuild = list[0]?.date ?? new Date().toISOString()

    const body = [
      '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>',
      `<title>${escapeXml(site.title)}</title>`,
      `<link>${site.baseUrl}/</link>`,
      `<atom:link href="${site.baseUrl}/index.xml" rel="self" type="application/rss+xml"/>`,
      `<description>${escapeXml(site.orgName)}</description>`,
      `<language>${site.languageCode}</language>`,
      `<lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>`,
      list
        .map(item =>
          [
            '<item>',
            `<title>${escapeXml(item.title)}</title>`,
            `<link>${escapeXml(absoluteUrl(site.baseUrl, ensureSlash(item.link)))}</link>`,
            `<guid>${escapeXml(absoluteUrl(site.baseUrl, ensureSlash(item.link)))}</guid>`,
            `<pubDate>${new Date(item.date).toUTCString()}</pubDate>`,
            `<description>${escapeXml(item.description)}</description>`,
            '</item>',
          ].join(''),
        )
        .join(''),
      '</channel></rss>',
    ].join('')

    return new Response(body, {
      headers: { 'content-type': 'application/rss+xml' },
    })
  }

  return {
    GET,
    // Prerendered at build time; the API routes have no runtime component.
    getConfig: () => Promise.resolve({ render: 'static' } as const),
  }
}
