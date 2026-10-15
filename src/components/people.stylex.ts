import * as stylex from '@stylexjs/stylex'

import {
  gray,
  primary,
  secondary,
  SPACE,
  TEXT,
} from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'

/** Ports `layouts/partials/blox/community/people.html`. */
export const styles = stylex.create({
  avatar: {
    blockSize: '100px',
    inlineSize: '100px',
  },
  avatarEmoji: {
    backgroundColor: {
      default: '#ffffff',
      [stylex.when.ancestor(DARK)]: '#000000',
    },
    blockSize: SPACE['5'],
    borderRadius: '100%',
    fontSize: SPACE['5'],
    inlineSize: SPACE['5'],
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    lineHeight: SPACE['5'],
    position: 'absolute',
    textAlign: 'center',
  },
  avatarWrap: {
    blockSize: '100px',
    inlineSize: '100px',
    position: 'relative',
  },
  grid: {
    alignItems: 'flex-start',
    columnGap: SPACE['8'],
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBlockStart: SPACE['3'],
    paddingInline: {
      default: SPACE['4'],
      '@media (min-width: 1024px)': SPACE['16'],
    },
  },
  groupHeading: {
    fontSize: {
      '@media (min-width: 1024px)': TEXT['2xl'],
      default: TEXT.xl,
    },
  },
  groupWrap: {
    marginBlockEnd: SPACE['4'],
    marginBlockStart: SPACE['8'],
  },
  interests: {
    fontSize: '0.8rem',
  },
  name: {
    color: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: secondary['600'],
    },
    fontSize: TEXT.xl,
    textWrap: 'nowrap',
  },
  person: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '150px',
  },
  personInfo: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBlockStart: SPACE['3'],
    textAlign: 'center',
    textWrap: 'balance',
  },
  personName: {
    ':hover': {
      textDecorationColor: primary['600'],
      textDecorationLine: 'underline',
    },
  },
  role: {
    color: gray['400'],
    fontSize: TEXT.sm,
    marginBlock: SPACE['1'],
  },
  socialRow: {
    alignItems: 'center',
    columnGap: SPACE['2'],
    display: 'flex',
    listStyleType: 'none',
    paddingInline: 0,
  },
})
