import * as stylex from '@stylexjs/stylex'

import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'

const DARK = '[data-theme="dark"]'

/** Evaluated at module load; the site is a static export, so this is the build year. */
const BUILD_YEAR = new Date().getFullYear()

const styles = stylex.create({
  badge: {
    blockSize: '1.75rem',
    inlineSize: '1.75rem',
  },
  iconRow: {
    marginBlock: 0,
    paddingBlockEnd: '1rem',
    textAlign: 'center',
  },
  link: {
    color: {
      default: 'inherit',
      [stylex.when.ancestor(DARK)]: 'inherit',
    },
    textDecorationLine: 'underline',
  },
  text: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: '0.875rem',
    marginBlock: 0,
    paddingBlock: '1.5rem',
    textAlign: 'center',
  },
})

/**
 * Minimal footer.
 *
 * Ports `partials/components/footers/minimal.html` with the notice and licence
 * from `config/_default/params.yaml` (`yhma Lab © {year}. This site is licensed
 * under {license}. Build with ❤️`). The previous markup printed the licence icons
 * as Font Awesome glyphs; here the Creative Commons badge is an image, which is
 * what Font Awesome was approximating.
 */
export function Footer() {
  const { locale, site } = siteContext()
  const license = site.license
  const parts = translate(locale).footerNotice.split('{license}')
  const before = parts[0] ?? ''
  const after = parts[1] ?? ''
  const fill = (template: string): string =>
    template
      .replaceAll('{title}', site.shortTitle)
      .replaceAll('{year}', String(BUILD_YEAR))

  return (
    <footer>
      <p {...stylex.props(styles.text)}>
        {fill(before)}
        <a
          href={license.url}
          rel="noopener noreferrer"
          target="_blank"
          {...stylex.props(styles.link)}
        >
          {license.name}
        </a>
        {fill(after)}
      </p>
      <p {...stylex.props(styles.iconRow)}>
        <a
          aria-label={license.name}
          href={license.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt={license.name}
            height={31}
            src="/media/cc-by-nc-sa.svg"
            width={88}
            {...stylex.props(styles.badge)}
          />
        </a>
      </p>
    </footer>
  )
}
