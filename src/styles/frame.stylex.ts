import * as stylex from '@stylexjs/stylex'

import { TEXT, WIDTH, neutral, theme } from './tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

/**
 * Page frame.
 *
 * The previous `_default/baseof.html` stacked a sticky `.page-header`, a
 * `.page-body` and a `.page-footer`, and `page-wrapper` made the body a
 * three-row grid so the footer sits at the bottom of short pages. Shared by both
 * route groups so `/` and `/cn` cannot drift apart.
 */
export const frameStyles = stylex.create({
  body: {
    flexGrow: 1,
  },
  container: {
    marginInline: 'auto',
    maxWidth: WIDTH.container,
    paddingInline: '1.5rem',
    width: '100%',
  },
  shell: {
    backgroundColor: {
      // `dark:bg-hb-dark`; written inline because StyleX only accepts literals
      // inside a conditional value: an imported constant binds as a StyleX value
      // object and fails condition validation.
      default: theme.bg,
      [stylex.when.ancestor(DARK)]: '#17181c',
    },
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: neutral['100'],
    },
    display: 'grid',
    fontSize: TEXT.base,
    gridTemplateColumns: '100%',
    gridTemplateRows: 'auto 1fr auto',
    lineHeight: 1.5,
    minHeight: '100vh',
  },
})
