import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  FONT_SERIF,
  SPACE,
  TEXT,
  theme,
  WIDTH,
} from '../styles/tokens.stylex.ts'

/** Ancestor selector for the dark colour scheme; must stay local to this module. */
const DARK = '[data-theme="dark"]'

/**
 * Section and heading chrome shared by every page.
 *
 * The design system owns vertical rhythm, not the authored `design.spacing`
 * field: pages use one section cadence, and a section that opens a page can drop
 * its top padding. Headings are left-aligned serif; a short sans-serif lead sits
 * under them at reading size.
 */
export const styles = stylex.create({
  /** The page edge: the one left alignment shared by every block. */
  column: {
    marginInline: 'auto',
    maxWidth: WIDTH.page,
    paddingInline: 'clamp(1.25rem, 4vw, 2.5rem)',
    width: '100%',
  },
  /**
   * Reading measure inside the page edge. Archive lists and bio grids stop here
   * so lines stay scannable while everything still starts on the page edge.
   */
  measure: {
    maxWidth: WIDTH.measure,
    width: '100%',
  },
  headingWrap: {
    marginBlockEnd: 'clamp(1.75rem, 4vw, 2.75rem)',
    maxWidth: '46rem',
  },
  heading: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: 'clamp(1.625rem, 3vw, 2.125rem)',
    fontOpticalSizing: 'auto',
    fontWeight: 600,
    letterSpacing: '-0.022em',
    lineHeight: 1.12,
    marginBlock: 0,
    textWrap: 'balance',
  },
  lead: {
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.body,
    lineHeight: 1.6,
    marginBlock: 0,
    marginBlockStart: '0.75rem',
    maxWidth: '58ch',
    textWrap: 'pretty',
  },
  muted: {
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
  },
  /** Sticky-navigation offset for in-page anchors such as the hero's `#news`. */
  section: {
    paddingBlock: 'clamp(3rem, 6vw, 5rem)',
    scrollMarginBlockStart: '5.5rem',
  },
  sectionPlain: {
    scrollMarginBlockStart: '5.5rem',
  },
  attachmentRow: {
    alignItems: 'center',
    columnGap: SPACE['1.5'],
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: SPACE['1.5'],
  },
  attachmentIcon: {
    display: 'inline-block',
    blockSize: '0.875rem',
    inlineSize: '0.875rem',
  },
})
