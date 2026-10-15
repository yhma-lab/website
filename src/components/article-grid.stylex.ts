import * as stylex from '@stylexjs/stylex'

import { gray, primary, SPACE, TEXT } from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'

/** Authored `design.columns`, mapped to a grid template. */
const COLUMNS: Record<number, string> = {
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(1, minmax(0, 1fr))',
  3: 'repeat(1, minmax(0, 1fr))',
  4: 'repeat(1, minmax(0, 1fr))',
}

const COLUMNS_MD: Record<number, string> = {
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
}

/**
 * Ports `blog-post-card` from `partials/views/article-grid.html`: a linked card
 * with a 16:9 cover, a category label, title, summary and author/date line.
 */
export const styles = stylex.create({
  card: {
    cursor: 'pointer',
  },
  category: {
    color: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: primary['400'],
    },
    fontSize: TEXT.sm,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  coverImage: {
    blockSize: '100%',
    inset: 0,
    inlineSize: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  coverLink: {
    aspectRatio: '16 / 9',
    display: 'block',
    position: 'relative',
  },
  coverWrap: {
    backgroundColor: {
      default: gray['100'],
      [stylex.when.ancestor(DARK)]: gray['800'],
    },
    borderRadius: '0.375rem',
    overflow: 'hidden',
    transitionProperty: 'all',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  grid: {
    columnGap: SPACE['4'],
    display: 'grid',
    rowGap: SPACE['8'],
  },
  meta: {
    color: {
      default: gray['500'],
      [stylex.when.ancestor(DARK)]: gray['400'],
    },
    fontSize: TEXT.sm,
  },
  summary: {
    color: {
      default: gray['600'],
      [stylex.when.ancestor(DARK)]: gray['300'],
    },
    fontSize: TEXT.sm,
    marginBlock: SPACE['2'],
  },
  title: {
    color: {
      default: gray['900'],
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: TEXT.xl,
    fontWeight: 700,
    marginBlock: `${SPACE['1']} 0`,
    textDecorationLine: 'none',
  },
})

export function columnTemplate(columns: number): string {
  return COLUMNS[columns] ?? COLUMNS[2] ?? 'repeat(1, minmax(0, 1fr))'
}

export function columnTemplateMd(columns: number): string {
  return COLUMNS_MD[columns] ?? COLUMNS_MD[2] ?? 'repeat(1, minmax(0, 1fr))'
}
