/**
 * Site-wide configuration.
 *
 * This is the typed replacement for `config/_default/*.yaml` plus
 * `data/page_sharer.yaml`.
 */

export const site = {
  /** `baseURL` from `config/_default/hugo.yaml`. */
  baseUrl: 'https://yhmayyds.group',
  description:
    "Yuhan Ma's personal resume and detail infomation about his research group",
  /** `languageCode`, used for the `<html lang>` attribute. */
  languageCode: 'en-US',
  /** `params.header.navbar.logo.text`. */
  shortTitle: 'yhma Lab',
  /** `title` from `hugo.yaml`. */
  title: 'yhma lab',
  /** `org_name`, used for the structured-data publisher. */
  orgName: 'Yuhan Ma Lab',
} as const

/** Per-locale page titles, from `config/_default/languages.yaml`. */
export const localeTitles: Record<string, string> = {
  cn: '马宇翰研究组',
  en: 'Research Group of Yuhan Ma',
}

export interface NavItem {
  label: string
  /** Route for the default locale; the `/cn` prefix is added at render time. */
  to: string
  /** A same-page anchor such as `#news`; never locale-prefixed. */
  hash?: string
}

/**
 * `config/_default/menu.yaml`, in weight order.
 *
 * The `News` entry points at the hero block on the home page, exactly as the
 * Hugo menu did.
 */
export const nav: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { hash: 'news', label: 'News', to: '/' },
  { label: 'People', to: '/people' },
  { label: 'Publications', to: '/publications' },
  { label: 'Fundings', to: '/fundings' },
]

/** `params.marketing.analytics.google_analytics`, also present in `.env` as `GA4_ID`. */
export const googleAnalyticsId = 'G-H0VB6P6W7B'

/**
 * `params.footer.copyright`: `'yhma Lab © {year}. This site is licensed under {license}. Build with ❤️'`
 * with a CC BY-NC-SA 4.0 licence (`allow_derivatives`, `share_alike`, no commercial use).
 */
export const license = {
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
} as const

/** `features.repository` from `params.yaml`. */
export const repository = {
  branch: 'main',
  contentDir: 'content',
  url: 'https://github.com/yhma-lab/website',
} as const
