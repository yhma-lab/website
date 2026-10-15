import * as stylex from '@stylexjs/stylex'

import { SPACE, TEXT, gray, neutral, primary } from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'


/** Ports `layouts/partials/blox/hero.html`. */
export const styles = stylex.create({
  action: {
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    fontSize: TEXT.sm,
    fontWeight: 600,
    paddingBlock: '0.625rem',
    paddingInline: '0.875rem',
    textDecorationLine: 'none',
  },
  actionIcon: {
    paddingInlineStart: SPACE['2'],
  },
  actionRow: {
    columnGap: SPACE['6'],
    display: 'flex',
    marginBlockStart: SPACE['10'],
  },
  announcement: {
    borderColor: {
      default: 'color-mix(in oklab, oklch(0.21 0.006 285.885) 10%, transparent)',
      [stylex.when.ancestor(DARK)]: gray['300'],
    },
    borderRadius: '9999px',
    borderStyle: 'solid',
    borderWidth: {
      default: 0,
      '@media (min-width: 1024px)': 1,
    },
    color: {
      default: gray['600'],
      [stylex.when.ancestor(DARK)]: gray['300'],
    },
    columnGap: SPACE['1'],
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 1024px)': 'row',
    },
    fontSize: TEXT.sm,
    justifyContent: {
      default: 'center',
      '@media (min-width: 1024px)': 'flex-start',
    },
    lineHeight: '1.5rem',
    marginBlockEnd: SPACE['4'],
    paddingInline: SPACE['2'],
  },
  announcementLink: {
    color: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: primary['300'],
    },
    fontWeight: 600,
  },
  inner: {
    marginInline: 'auto',
    maxWidth: '42rem',
    paddingBlock: '8rem',
  },
  innerCompact: {
    paddingBlock: 0,
  },
  primaryAction: {
    backgroundColor: primary['600'],
    color: '#ffffff',
    ':hover': {
      backgroundColor: primary['500'],
    },
  },
  root: {
    paddingInline: SPACE['6'],
    position: 'relative',
  },
  secondaryAction: {
    color: {
      default: gray['900'],
      [stylex.when.ancestor(DARK)]: gray['100'],
    },
    fontSize: TEXT.sm,
    fontWeight: 600,
    lineHeight: '1.5rem',
    textDecorationLine: 'none',
  },
  subtitle: {
    color: {
      default: gray['600'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
    fontSize: TEXT.lg,
    lineHeight: '2rem',
    marginBlockStart: SPACE['6'],
    textWrap: 'pretty',
  },
  title: {
    color: {
      default: gray['900'],
      [stylex.when.ancestor(DARK)]: gray['100'],
    },
    fontSize: {
      default: TEXT['3xl'],
      '@media (min-width: 640px)': TEXT['5xl'],
    },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    textWrap: 'balance',
  },
})
