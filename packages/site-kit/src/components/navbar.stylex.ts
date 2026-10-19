import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  MOTION,
  RADIUS,
  TEXT,
  theme,
} from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

/**
 * Sticky navigation.
 *
 * The bar is a material, not an opaque strip: content scrolls underneath a
 * translucent paper surface with a hairline at its lower edge, and it turns solid
 * when the reader asks for reduced transparency. The menu centers between the
 * wordmark and the appearance controls on desktop and collapses into the
 * disclosure below 1024px.
 */
export const styles = stylex.create({
  actions: {
    alignItems: 'center',
    columnGap: '2px',
    display: 'flex',
    flexShrink: 0,
  },
  brand: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    columnGap: '0.625rem',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.base,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    minBlockSize: '2.75rem',
    textDecorationLine: 'none',
  },
  brandMark: {
    blockSize: '1.375rem',
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    flexShrink: 0,
    inlineSize: '1.375rem',
  },
  divider: {
    backgroundColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    blockSize: '1rem',
    inlineSize: 1,
    marginInline: '0.375rem',
  },
  header: {
    backdropFilter: {
      default: 'saturate(140%) blur(14px)',
      '@media (prefers-reduced-transparency: reduce)': 'none',
    },
    backgroundColor: {
      default: 'color-mix(in srgb, #f4f5f3 82%, transparent)',
      '@media (prefers-reduced-transparency: reduce)': theme.bg,
      '@media (prefers-contrast: more)': theme.bg,
      [stylex.when.ancestor(DARK)]:
        'color-mix(in srgb, #0c1116 78%, transparent)',
    },
    borderBlockEndColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },
  langSwitch: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    display: 'inline-flex',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.small,
    fontWeight: 500,
    minBlockSize: '2.25rem',
    paddingInline: '0.625rem',
    textDecorationLine: 'none',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color',
    transitionTimingFunction: MOTION.easeOut,
    whiteSpace: 'nowrap',
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        backgroundColor: {
          default: theme.bgSubtle,
          [stylex.when.ancestor(DARK)]: '#172028',
        },
        color: {
          default: theme.fg,
          [stylex.when.ancestor(DARK)]: '#e9eeec',
        },
      },
    },
  },
  nav: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minBlockSize: '4.25rem',
    paddingBlock: '0.5rem',
  },
  navLink: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    display: 'inline-flex',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.base,
    fontWeight: 500,
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
    textDecorationLine: 'none',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color',
    transitionTimingFunction: MOTION.easeOut,
    whiteSpace: 'nowrap',
    '@media (max-width: 1023px)': {
      minBlockSize: '2.75rem',
    },
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        backgroundColor: {
          default: theme.bgSubtle,
          [stylex.when.ancestor(DARK)]: '#172028',
        },
        color: {
          default: theme.fg,
          [stylex.when.ancestor(DARK)]: '#e9eeec',
        },
      },
    },
  },
  navList: {
    alignItems: {
      default: 'stretch',
      '@media (min-width: 1024px)': 'center',
    },
    columnGap: '0.125rem',
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 1024px)': 'row',
    },
    listStyleType: 'none',
    margin: 0,
    paddingBlockEnd: {
      default: '0.5rem',
      '@media (min-width: 1024px)': 0,
    },
    paddingInline: 0,
  },
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
})
