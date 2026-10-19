import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  FONT_SERIF,
  RADIUS,
  TEXT,
  theme,
} from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

/**
 * Long-form typography.
 *
 * StyleX has no descendant selector, so the reading styles attach to each MDX
 * element through `getMdxComponents()` instead of hanging off a `.prose` root.
 * The body is set in Source Serif 4 at reading size; the interface sans appears
 * only in inline code, which is closer to a technical annotation than to prose.
 */
export const prose = stylex.create({
  a: {
    color: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#a0baff',
    },
    fontWeight: 500,
    textDecorationColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 2,
    ':focus-visible': {
      borderRadius: RADIUS.sm,
      outlineColor: {
        default: theme.accent,
        [stylex.when.ancestor(DARK)]: '#82a6ff',
      },
      outlineOffset: 2,
      outlineStyle: 'solid',
      outlineWidth: 2,
    },
    ':hover': {
      textDecorationThickness: 2,
    },
  },
  blockquote: {
    borderInlineStartColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: '1.0625em',
    fontStyle: 'italic',
    lineHeight: 1.6,
    marginBlock: '1.6em',
    paddingInlineStart: '1.25em',
  },
  code: {
    backgroundColor: {
      default: theme.bgSubtle,
      [stylex.when.ancestor(DARK)]: '#172028',
    },
    borderColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderRadius: RADIUS.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SANS.mono,
    fontSize: '0.8125em',
    fontWeight: 500,
    paddingBlock: '0.1em',
    paddingInline: '0.35em',
  },
  h1: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: '2em',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    marginBlock: '0 0.6em',
  },
  h2: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: '1.5em',
    fontWeight: 600,
    letterSpacing: '-0.015em',
    lineHeight: 1.25,
    marginBlock: '1.8em 0.65em',
  },
  h3: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: '1.1875em',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    marginBlock: '1.6em 0.6em',
  },
  h4: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SANS.family,
    fontSize: '0.9375em',
    fontWeight: 600,
    lineHeight: 1.4,
    marginBlock: '1.5em 0.5em',
  },
  hr: {
    borderTopColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    marginBlock: '2.5em',
  },
  img: {
    borderRadius: RADIUS.md,
    height: 'auto',
    marginBlock: '1.75em',
    maxWidth: '100%',
  },
  li: {
    marginBlock: '0.5em',
    paddingInlineStart: '0.25em',
  },
  mark: {
    backgroundColor: {
      default: theme.accentSoft,
      [stylex.when.ancestor(DARK)]: '#18233d',
    },
    borderRadius: RADIUS.sm,
    color: 'inherit',
    paddingBlock: '0.1em',
    paddingInline: '0.2em',
  },
  ol: {
    listStyleType: 'decimal',
    marginBlock: '1.25em',
    paddingInlineStart: '1.4em',
  },
  p: {
    marginBlock: '1.1em',
    textWrap: 'pretty',
  },
  strong: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontWeight: 600,
  },
  table: {
    borderCollapse: 'collapse',
    fontSize: '0.9375em',
    lineHeight: 1.55,
    marginBlock: '1.75em',
    width: '100%',
  },
  td: {
    borderBlockEndColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    paddingBlock: '0.6em',
    paddingInlineEnd: '0.75em',
    verticalAlign: 'top',
  },
  th: {
    borderBlockEndColor: {
      default: theme.borderStrong,
      [stylex.when.ancestor(DARK)]: '#34424c',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.small,
    fontWeight: 600,
    paddingBlock: '0.6em',
    paddingInlineEnd: '0.75em',
    textAlign: 'start',
    verticalAlign: 'bottom',
  },
  ul: {
    listStyleType: 'disc',
    marginBlock: '1.25em',
    paddingInlineStart: '1.4em',
  },
})
