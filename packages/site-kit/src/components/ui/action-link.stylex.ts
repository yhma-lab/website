import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  MOTION,
  RADIUS,
  TEXT,
  theme,
} from '../../styles/tokens.stylex.ts'

// Keep this selector local so StyleX can statically evaluate dark conditions.
const DARK = '[data-theme="dark"]'

/**
 * Action-link recipes.
 *
 * An action link is navigation, not a control: it stays a native anchor so it
 * works before hydration, but it borrows the same shape, press response and focus
 * ring as the buttons. The primary recipe is the page's single filled action; the
 * secondary is a quiet text link used beside it; attachments are compact chips
 * that carry their label as text rather than as an icon-only affordance.
 */
export const actionLinkStyles = stylex.create({
  /** Geometry and interaction shared by every action link. */
  base: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    display: 'inline-flex',
    fontFamily: FONT_SANS.family,
    fontWeight: 500,
    gap: '0.5rem',
    textDecorationLine: 'none',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color, border-color, transform',
    transitionTimingFunction: MOTION.easeOut,
    ':active': {
      transform: 'scale(0.97)',
    },
  },
  primary: {
    backgroundColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    color: {
      default: theme.accentFg,
      [stylex.when.ancestor(DARK)]: '#0a1018',
    },
    fontSize: TEXT.base,
    fontWeight: 600,
    paddingBlock: '0.6875rem',
    paddingInline: '1.125rem',
    ':hover': {
      backgroundColor: {
        default: theme.accentHover,
        [stylex.when.ancestor(DARK)]: '#a0baff',
      },
    },
  },
  secondary: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontSize: TEXT.base,
    fontWeight: 500,
    paddingBlock: '0.6875rem',
    paddingInline: '0.25rem',
    ':hover': {
      color: {
        default: theme.accent,
        [stylex.when.ancestor(DARK)]: '#a0baff',
      },
    },
  },
  /** The announcement's inline link, which sits inside running text. */
  announcement: {
    color: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#a0baff',
    },
    fontWeight: 500,
    textDecorationColor: {
      default: theme.borderStrong,
      [stylex.when.ancestor(DARK)]: '#34424c',
    },
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    ':hover': {
      textDecorationColor: {
        default: theme.accent,
        [stylex.when.ancestor(DARK)]: '#a0baff',
      },
    },
  },
  /** Compact attachment chip; `attachmentLarge` raises it to a page action. */
  attachment: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      [stylex.when.ancestor(DARK)]: 'transparent',
    },
    borderColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderRadius: RADIUS.md,
    borderStyle: 'solid',
    borderWidth: 1,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    display: 'inline-flex',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.micro,
    fontWeight: 500,
    gap: '0.375rem',
    paddingBlock: '0.25rem',
    paddingInline: '0.5625rem',
    textDecorationLine: 'none',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color, border-color, transform',
    transitionTimingFunction: MOTION.easeOut,
    whiteSpace: 'nowrap',
    ':active': {
      transform: 'scale(0.97)',
    },
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        backgroundColor: {
          default: theme.accentSoft,
          [stylex.when.ancestor(DARK)]: '#18233d',
        },
        borderColor: {
          default: theme.accent,
          [stylex.when.ancestor(DARK)]: '#82a6ff',
        },
        color: {
          default: theme.accent,
          [stylex.when.ancestor(DARK)]: '#a0baff',
        },
      },
    },
  },
  attachmentLarge: {
    fontSize: TEXT.small,
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
  },
})
