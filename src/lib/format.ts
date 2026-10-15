/**
 * Formatting helpers.
 *
 * The formats mirror the Hugo configuration so the rendered text does not
 * change: `locale.date_format: 'Jan 2, 2006'`, the resume blocks'
 * `'January 2006'`, and the APA-style citation assembled by
 * `layouts/partials/views/citation.html`.
 */

const LOCALE = 'en-US'

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** `Jan 2, 2006` -- the site-wide date format. */
export function formatDate(value: string | undefined): string {
  const date = toDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** `January 2006` -- the resume blocks' `date_format`. */
export function formatMonthYear(value: string | undefined): string {
  const date = toDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(date)
}

/** `2006` -- the year used inside a citation. */
export function formatYear(value: string | undefined): string {
  const date = toDate(value)
  return date ? String(date.getFullYear()) : ''
}

/** `January 2, 2006` -- long form used by event cards. */
export function formatLongDate(value: string | undefined): string {
  const date = toDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function isFuture(value: string | undefined, now = new Date()): boolean {
  const date = toDate(value)
  return date ? date.getTime() > now.getTime() : false
}

/** Parse a `yyyy-mm-dd` value used for sorting; `0` when missing or invalid. */
export function timestamp(value: string | undefined): number {
  return toDate(value)?.getTime() ?? 0
}

const SHARE_TEMPLATES = {
  email: 'mailto:?subject={title}&body={url}',
  linkedin: 'https://www.linkedin.com/shareArticle?url={url}&title={title}',
  x: 'https://twitter.com/intent/tweet?url={url}&text={title}',
} as const

const SHARE_TITLES = {
  email: 'Email',
  linkedin: 'LinkedIn',
  x: 'X',
} as const

export type ShareTarget = keyof typeof SHARE_TEMPLATES

/** Enabled share targets, matching the entries that were active in `data/page_sharer.yaml`. */
export const SHARE_TARGETS: readonly ShareTarget[] = ['email', 'x', 'linkedin']

export function shareHref(target: ShareTarget, url: string, title: string): string {
  return SHARE_TEMPLATES[target]
    .replaceAll('{title}', encodeURIComponent(title))
    .replaceAll('{url}', encodeURIComponent(url))
}

export function shareTitle(target: ShareTarget): string {
  return SHARE_TITLES[target]
}
