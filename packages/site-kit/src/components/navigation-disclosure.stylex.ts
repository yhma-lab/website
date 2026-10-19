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
 * The mobile navigation disclosure.
 *
 * The island owns only the small-screen collapse; the links themselves are
 * server-owned anchors. The panel is a full-width row under the bar below
 * 1024px and disappears from the layout above it, where the list sits inline.
 */
/** The panel fades and drops 4px when the disclosure opens; no motion when reduced. */
const panelIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const styles = stylex.create({
  disclosure: {
    display: 'contents',
  },
  hidden: {
    display: 'none',
  },
  icon: {
    blockSize: '1.25rem',
    fill: 'none',
    inlineSize: '1.25rem',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeWidth: 1.75,
  },
  panel: {
    animationDuration: '180ms',
    animationFillMode: 'both',
    animationName: {
      default: panelIn,
      '@media (min-width: 1024px)': 'none',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: MOTION.easeOut,
    flexBasis: {
      default: '100%',
      '@media (min-width: 1024px)': 'auto',
    },
    flexGrow: {
      default: 0,
      '@media (min-width: 1024px)': 1,
    },
    display: {
      default: 'block',
      '@media (min-width: 1024px)': 'flex',
    },
    justifyContent: 'center',
    marginInlineStart: {
      default: 0,
      '@media (min-width: 1024px)': 'auto',
    },
    order: {
      default: 1,
      '@media (min-width: 1024px)': 0,
    },
    paddingBlockStart: {
      default: '8px',
      '@media (min-width: 1024px)': 0,
    },
    paddingBlockEnd: {
      default: '4px',
      '@media (min-width: 1024px)': 0,
    },
  },
  toggle: {
    borderRadius: RADIUS.md,
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.base,
    marginInlineStart: 'auto',
    minBlockSize: '2.75rem',
    minInlineSize: '2.75rem',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color',
    transitionTimingFunction: MOTION.easeOut,
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        backgroundColor: {
          default: theme.bgSubtle,
          [stylex.when.ancestor(DARK)]: '#172028',
        },
      },
    },
  },
})
