import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  FONT_SERIF,
  MOTION,
  TEXT,
  theme,
} from '../styles/tokens.stylex.ts'

/** Ancestor selector for the dark colour scheme; must stay local to this module. */
const DARK = '[data-theme="dark"]'

/**
 * The one orchestrated entrance in the system.
 *
 * The copy rises 14px and fades once per page load, staggered by role; the
 * diagram's finite-time loop draws itself once. Both are removed entirely under
 * `prefers-reduced-motion`, leaving the finished state rather than a hidden one.
 */
const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(14px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

/** Opening hero: the lab's title page. */
export const styles = stylex.create({
  actionRow: {
    alignItems: 'center',
    columnGap: '1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    marginBlockStart: '2rem',
    rowGap: '0.875rem',
  },
  announcement: {
    alignItems: 'baseline',
    borderInlineStartColor: {
      default: theme.warm,
      [stylex.when.ancestor(DARK)]: '#f0b76d',
    },
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    columnGap: '0.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.small,
    lineHeight: 1.55,
    marginBlockEnd: '1.75rem',
    paddingInlineStart: '0.875rem',
  },
  copy: {
    maxWidth: '44rem',
    minWidth: 0,
  },
  enter: {
    animationDuration: MOTION.reveal,
    animationFillMode: 'both',
    animationName: {
      default: rise,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: MOTION.easeOut,
  },
  enterLate: {
    animationDelay: {
      default: '140ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
  },
  enterMid: {
    animationDelay: {
      default: '70ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
  },
  grid: {
    alignItems: 'center',
    columnGap: 'clamp(2rem, 5vw, 5rem)',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    rowGap: 'clamp(2.5rem, 6vw, 4rem)',
  },
  gridWithVisual: {
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 960px)': 'minmax(0, 7fr) minmax(0, 5fr)',
    },
  },
  root: {
    marginInline: 'auto',
    maxWidth: '76rem',
    paddingBlock: 'clamp(3.5rem, 7vw, 5.5rem)',
    paddingInline: 'clamp(1.25rem, 4vw, 2.5rem)',
    position: 'relative',
    width: '100%',
  },
  rootCompact: {
    paddingBlockStart: 'clamp(2.5rem, 5vw, 4rem)',
  },
  /** Hero paragraphs are UI-sized, not the reading serif: they set the scene. */
  subtitle: {
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.lead,
    lineHeight: 1.6,
    marginBlock: 0,
    marginBlockStart: '1.5rem',
    maxWidth: '56ch',
    textWrap: 'pretty',
  },
  subtitleParagraph: {
    marginBlock: 0,
    marginBlockStart: '0.75rem',
  },
  title: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: TEXT.display,
    fontOpticalSizing: 'auto',
    fontWeight: 600,
    letterSpacing: '-0.035em',
    lineHeight: 0.98,
    marginBlock: 0,
    maxWidth: '13ch',
    textWrap: 'balance',
  },
  visual: {
    justifySelf: {
      default: 'center',
      '@media (min-width: 960px)': 'end',
    },
    maxWidth: '30rem',
    minWidth: 0,
    width: '100%',
  },
})
