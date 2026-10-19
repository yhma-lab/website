import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  MOTION,
  RADIUS,
  TEXT,
  theme,
  WIDTH,
} from './tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

/**
 * Page frame.
 *
 * A three-row grid (frame, page, footer) so the footer sits at the bottom of
 * short pages, a shared width for the navigation and every page container, and
 * the skip link that makes the frame's landmark structure usable from a
 * keyboard. The document's `<html>` owns the StyleX theme marker and
 * `data-theme` for all descendants, so the dark pairs here are the only theme
 * switch the frame needs.
 */
export const frameStyles = stylex.create({
  body: {
    display: 'block',
    flexGrow: 1,
  },
  container: {
    marginInline: 'auto',
    maxWidth: WIDTH.container,
    paddingInline: 'clamp(1.25rem, 4vw, 2.5rem)',
    width: '100%',
  },
  /** Wide container for the editorial hero and the publication index. */
  containerWide: {
    marginInline: 'auto',
    maxWidth: WIDTH.container,
    paddingInline: 'clamp(1.25rem, 4vw, 2.5rem)',
    width: '100%',
  },
  main: {
    outlineStyle: 'none',
  },
  shell: {
    backgroundColor: {
      default: theme.bg,
      [stylex.when.ancestor(DARK)]: '#0c1116',
    },
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    display: 'grid',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.base,
    gridTemplateColumns: '100%',
    gridTemplateRows: 'auto 1fr auto',
    lineHeight: 1.55,
    minBlockSize: '100dvh',
  },
  skipLink: {
    backgroundColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    borderRadius: RADIUS.md,
    color: {
      default: theme.accentFg,
      [stylex.when.ancestor(DARK)]: '#0a1018',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.base,
    fontWeight: 600,
    insetBlockStart: 0,
    insetInlineStart: 0,
    paddingBlock: '0.625rem',
    paddingInline: '1rem',
    position: 'fixed',
    textDecorationLine: 'none',
    transform: 'translateY(-150%)',
    transitionDuration: {
      default: MOTION.press,
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionProperty: 'transform',
    transitionTimingFunction: MOTION.easeOut,
    zIndex: 100,
    ':focus-visible': {
      outlineColor: {
        default: '#ffffff',
        [stylex.when.ancestor(DARK)]: '#0a1018',
      },
      outlineOffset: 2,
      outlineStyle: 'solid',
      outlineWidth: 2,
      transform: 'translateY(0.75rem)',
    },
  },
})
