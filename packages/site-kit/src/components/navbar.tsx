import * as stylex from '@stylexjs/stylex'

import { alternateUrl, siteHref } from '../content/links.ts'
import { siteContext } from '../site-context.ts'
import { navFor } from '../site/nav.ts'
import { styles } from './navbar.stylex.ts'
import { ThemeToggle } from './theme-toggle.tsx'

/**
 * Site header.
 *
 * Mirrors `partials/components/headers/navbar.html`: brand text, a
 * checkbox-driven mobile menu, the main menu and the theme chooser. Search stays
 * disabled because `params.yaml` set `show_search: false`.
 *
 * The language chooser is the one addition to the previous markup: it links to
 * the paired site at the same path. `RootShell` rewrites the `href` before first
 * paint from `location`, so the rendered fallback (the other site's home page)
 * is only what a reader without JavaScript gets.
 */
export function Navbar() {
  const { locale, site } = siteContext()
  const nav = navFor(locale)
  const alternate = site.alternate

  return (
    <div {...stylex.props(styles.wrapper)}>
      <header {...stylex.props(styles.header)}>
        <nav aria-label="Main" {...stylex.props(styles.nav)}>
          <a href="/" {...stylex.props(styles.brand)} title={site.title}>
            {site.shortTitle}
          </a>

          <input
            aria-hidden
            {...stylex.props(styles.toggleInput)}
            id="nav-toggle"
            type="checkbox"
          />
          <label
            aria-label="Toggle menu"
            htmlFor="nav-toggle"
            {...stylex.props(styles.toggle)}
          >
            <svg {...stylex.props(styles.toggleIcon)} viewBox="0 0 20 20">
              <title>Open Menu</title>
              <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
            </svg>
          </label>

          <ul {...stylex.props(styles.navList)} id="nav-menu">
            {nav.map(item => (
              <li key={item.label}>
                <a
                  href={siteHref(
                    item.hash === undefined
                      ? { to: item.to }
                      : { hash: item.hash, to: item.to },
                  )}
                  {...stylex.props(styles.navLink)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div {...stylex.props(styles.actions)}>
            <a
              data-alt-site={alternate.baseUrl}
              href={alternateUrl(alternate.baseUrl, '/')}
              hrefLang={alternate.locale === 'cn' ? 'zh-Hans' : 'en'}
              lang={alternate.locale === 'cn' ? 'zh-Hans' : 'en'}
              {...stylex.props(styles.langSwitch)}
            >
              {alternate.label}
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </div>
  )
}
