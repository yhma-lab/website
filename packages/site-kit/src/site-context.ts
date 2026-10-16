import type { ContentSource } from './content/source.ts'
import type { Locale, SiteConfig } from './site/types.ts'

/**
 * Site context.
 *
 * The apps differ only in which `SiteConfig` and which `ContentSource` they
 * build, so the shared components read both from here instead of importing an
 * app module. Each app defines it once, at module load, from its own
 * `src/lib/site-context.ts`.
 *
 * A module-level registry rather than a React context, because server
 * components run against React's `react-server` build, which has no
 * `createContext`. That is safe here: a site is built and rendered by its own
 * process, every route module imports the app's context module (directly or
 * through the root element), and the value never changes during a build.
 */

export interface SiteContextValue {
  locale: Locale
  site: SiteConfig
  source: ContentSource
}

let current: SiteContextValue | undefined

/** Define this process's site. Called by the app's `src/lib/site-context.ts`. */
export function defineSite(value: SiteContextValue): SiteContextValue {
  current = value
  return value
}

/** The current site. Throws rather than rendering half a page without one. */
export function siteContext(): SiteContextValue {
  if (!current) {
    throw new Error(
      "site context is not defined: import the app's `src/lib/site-context.ts` first",
    )
  }
  return current
}
