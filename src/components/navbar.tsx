import type { SiteLink } from '@/lib/links.ts'

import { nav, site } from '@/lib/site.ts'
import * as stylex from '@stylexjs/stylex'

import { styles } from './navbar.stylex.ts'
import { ThemeToggle } from './theme-toggle.tsx'

export interface NavbarProps {
  /** Locale prefix: `''` for English, `'/cn'` for Chinese. */
  prefix: string
  /** Current pathname, used to mark the active entry. */
  current: string
  /** Locale-aware href builder, so the navbar does not re-implement the rule. */
  href: (link: SiteLink) => string
}

/**
 * Site header.
 *
 * Mirrors `partials/components/headers/navbar.html`: brand text, a
 * checkbox-driven mobile menu, the menu from `config/_default/menu.yaml`, and
 * the theme chooser. Search and the language chooser stay disabled because
 * `params.yaml` set `show_search: false` and `show_language: false`.
 */
export function Navbar({ current, href, prefix }: NavbarProps) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <header {...stylex.props(styles.header)}>
        <nav aria-label="Main" {...stylex.props(styles.nav)}>
          <a
            href={prefix || '/'}
            {...stylex.props(styles.brand)}
            title={site.title}
          >
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
            {nav.map(item => {
              const link: SiteLink =
                item.hash === undefined
                  ? { to: item.to }
                  : { hash: item.hash, to: item.to }
              const to = href(link)
              const active =
                item.hash === undefined &&
                `/${current.split('/')[1] ?? ''}` === item.to
              return (
                <li key={item.label}>
                  <a
                    aria-current={active ? 'page' : undefined}
                    href={to}
                    {...stylex.props(
                      styles.navLink,
                      active && styles.navLinkActive,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div {...stylex.props(styles.actions)}>
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </div>
  )
}
