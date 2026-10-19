import * as stylex from '@stylexjs/stylex'

import { actionLinkStyles } from '../components/ui/action-link.stylex.ts'
import { ActionLink } from '../components/ui/action-link.tsx'
import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'
import {
  FONT_SANS,
  FONT_SERIF,
  TEXT,
  theme,
  WIDTH,
} from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

const styles = stylex.create({
  body: {
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.body,
    lineHeight: 1.65,
    marginBlock: '1rem 2rem',
    maxWidth: '46ch',
  },
  page: {
    marginInline: 'auto',
    maxWidth: WIDTH.page,
    paddingBlock: 'clamp(4rem, 12vw, 8rem)',
    paddingInline: 'clamp(1.25rem, 4vw, 2.5rem)',
    width: '100%',
  },
  title: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
    fontOpticalSizing: 'auto',
    fontWeight: 600,
    letterSpacing: '-0.03em',
    lineHeight: 1.05,
    marginBlock: 0,
  },
})

/**
 * Not-found body, rendered inside the normal page frame.
 *
 * It offers exactly one way out: back home. No search box, no decorative
 * illustration — a wrong URL is a moment for direction, not mood.
 */
export function NotFound() {
  const { locale } = siteContext()
  const t = translate(locale)

  return (
    <div {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.title)}>{t.notFoundTitle}</h1>
      <p {...stylex.props(styles.body)}>{t.notFoundBody}</p>
      <ActionLink
        href="/"
        xstyle={[actionLinkStyles.base, actionLinkStyles.primary]}
      >
        {t.notFoundHome}
      </ActionLink>
    </div>
  )
}
