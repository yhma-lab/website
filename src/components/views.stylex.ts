import * as stylex from '@stylexjs/stylex'

import { SPACE, TEXT, gray, neutral, primary, slate, zinc } from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'


/** Ports `layouts/partials/views/citation.html`. */
export const citation = stylex.create({
  authors: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
  },
  bold: {
    fontWeight: 700,
  },
  item: {
    marginBlockEnd: SPACE['4'],
    maxWidth: '60%',
  },
  title: {
    textDecorationLine: 'underline',
  },
})

/** Ports `layouts/partials/views/card.html` (the project's overridden version). */
export const card = stylex.create({
  body: {
    padding: SPACE['8'],
  },
  image: {
    blockSize: SPACE['48'],
    cursor: 'pointer',
    inlineSize: {
      default: '100%',
      '@media (min-width: 768px)': SPACE['48'],
    },
    objectFit: 'cover',
    transitionDuration: '500ms',
    transitionProperty: 'transform',
    ':hover': {
      transform: 'scale(1.25)',
    },
  },
  imageWrap: {
    flexShrink: 0,
    overflow: 'hidden',
  },
  item: {
    marginBlockEnd: SPACE['5'],
    textDecorationLine: 'none',
  },
  row: {
    display: {
      default: 'block',
      '@media (min-width: 768px)': 'flex',
    },
  },
  summary: {
    color: {
      default: '#000000',
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    display: 'block',
    fontSize: TEXT.sm,
    fontWeight: 500,
    lineHeight: '1.25',
    marginBlock: `${SPACE['1']} 0`,
  },
  title: {
    color: {
      default: primary['700'],
      [stylex.when.ancestor(DARK)]: primary['200'],
    },
    fontSize: TEXT.base,
    fontWeight: 600,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
  },
})

/** The two-column `Abstract` / `Cite` rows on a publication page. */
export const detail = stylex.create({
  grid: {
    columnGap: SPACE['4'],
    display: 'grid',
    gridTemplateColumns: {
      '@media (min-width: 768px)': '200px auto',
      default: '1fr',
    },
    marginBlock: SPACE['6'],
    maxWidth: '65ch',
  },
  label: {
    fontSize: TEXT['2xl'],
    fontWeight: 700,
  },
})

/** Ports the shared `.pub-list-item` frame and the article-grid meta rows. */
export const shared = stylex.create({
  meta: {
    color: {
      default: gray['500'],
      [stylex.when.ancestor(DARK)]: gray['300'],
    },
    fontSize: TEXT.sm,
    marginBlockStart: SPACE['2'],
  },
  pageTitle: {
    color: {
      default: slate['900'],
      [stylex.when.ancestor(DARK)]: slate['100'],
    },
    fontSize: TEXT['4xl'],
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBlockStart: SPACE['2'],
  },
  sectionTitle: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
    fontSize: TEXT['2xl'],
    fontWeight: 600,
    lineHeight: '1.5rem',
  },
  wrapper: {
    maxWidth: '65ch',
  },
  zinc: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: zinc['100'],
    },
  },
})
