import { absoluteUrl } from '@/lib/links.ts'
import { sortedFundings, sortedPublications } from '@/lib/sort.ts'
import { localeTitles, site } from '@/lib/site.ts'

/**
 * Site feed.
 *
 * Hugo published it at `/index.xml`; keeping that path avoids breaking existing
 * subscribers. Items are the same set the old RSS template listed: publications
 * and funded projects, newest first, each with a `pubDate` and a link.
 */

type Item = { date: string; description: string; link: string; title: string }

function items(): Item[] {
  const publications = sortedPublications().map((page) => ({
    date: page.data.date,
    description: page.data.abstract,
    link: page.url,
    title: page.data.title,
  }))
  const fundings = sortedFundings().map((page) => ({
    date: page.data.date,
    description: page.data.summary,
    link: page.url,
    title: page.data.title,
  }))

  return [...publications, ...fundings].toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export const GET = () => {
  const list = items()
  const lastBuild = list[0]?.date ?? new Date().toISOString()

  const body = [
    '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>',
    `<title>${escapeXml(localeTitles['en'] ?? site.orgName)}</title>`,
    `<link>${site.baseUrl}/</link>`,
    `<atom:link href="${site.baseUrl}/index.xml" rel="self" type="application/rss+xml"/>`,
    `<description>${escapeXml(site.orgName)}</description>`,
    `<language>${site.languageCode}</language>`,
    `<lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>`,
    list
      .map((item) =>
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

  return new Response(body, { headers: { 'content-type': 'application/rss+xml' } })
}

function ensureSlash(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function getConfig() {
  return Promise.resolve({ render: 'static' } as const)
}
