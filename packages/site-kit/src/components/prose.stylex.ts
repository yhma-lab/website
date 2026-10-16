import * as stylex from '@stylexjs/stylex'

import { neutral, primary, secondary } from '../styles/tokens.stylex.ts'

/**
 * Long-form typography.
 *
 * The previous build relied on `@tailwindcss/typography`, whose `.prose` rules
 * are descendant selectors (`'.prose p'`). StyleX only accepts pseudo-class
 * conditions, so that single-rooted approach is not expressible here. Instead
 * the same values are attached to each element, and `getMdxComponents()` in
 * `src/lib/mdx.tsx` maps MDX output onto these components.
 *
 * Values are copied from the compiled Tailwind output, including the responsive
 * `prose` -> `lg:prose-xl` jump (1rem/1.75 to 1.25rem/1.8).
 */

const DARK = '[data-theme="dark"]'

export const prose = stylex.create({
  a: {
    color: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: primary['400'],
    },
    fontWeight: 500,
    textDecorationColor: {
      default: primary['300'],
      [stylex.when.ancestor(DARK)]: neutral['500'],
    },
    textDecorationLine: 'underline',
    ':hover': {
      borderRadius: '0.09rem',
      color: {
        default: primary['600'],
        [stylex.when.ancestor(DARK)]: primary['300'],
      },
      textDecorationLine: 'none',
    },
  },
  blockquote: {
    borderInlineStartColor: {
      default: primary['200'],
      [stylex.when.ancestor(DARK)]: primary['900'],
    },
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: '0.25rem',
    color: {
      default: neutral['700'],
      [stylex.when.ancestor(DARK)]: neutral['200'],
    },
    fontStyle: 'italic',
    fontWeight: 500,
    marginBlock: '1.6em',
    paddingInlineStart: '1em',
  },
  code: {
    color: {
      default: secondary['700'],
      [stylex.when.ancestor(DARK)]: secondary['400'],
    },
    fontSize: '0.875em',
    fontWeight: 600,
  },
  h1: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['50'],
    },
    fontSize: '2.25em',
    fontWeight: 800,
    lineHeight: 1.1111111,
    marginBlockEnd: '0.8888889em',
    marginBlockStart: 0,
  },
  h2: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['50'],
    },
    fontSize: '1.5em',
    fontWeight: 700,
    lineHeight: 1.3333333,
    marginBlockEnd: '1em',
    marginBlockStart: '2em',
  },
  h3: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['50'],
    },
    fontSize: '1.25em',
    fontWeight: 600,
    lineHeight: 1.6,
    marginBlockEnd: '0.6em',
    marginBlockStart: '1.6em',
  },
  h4: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['50'],
    },
    fontWeight: 600,
    marginBlockEnd: '0.5em',
    marginBlockStart: '1.5em',
  },
  hr: {
    borderTopColor: {
      default: neutral['200'],
      [stylex.when.ancestor(DARK)]: neutral['500'],
    },
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    marginBlock: '3em',
  },
  img: {
    marginBlock: '2em',
    maxWidth: '100%',
  },
  li: {
    marginBlock: '0.5em',
    paddingInlineStart: '0.375em',
  },
  mark: {
    backgroundColor: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: primary['400'],
    },
    borderRadius: '0.25rem',
    color: {
      default: neutral['100'],
      [stylex.when.ancestor(DARK)]: '#000000',
    },
    paddingBlock: '0.1rem',
    paddingInline: '0.2rem',
  },
  ol: {
    listStyleType: 'decimal',
    marginBlock: '1.25em',
    paddingInlineStart: '1.625em',
  },
  p: {
    marginBlock: '1.25em',
  },
  strong: {
    color: {
      default: neutral['900'],
      [stylex.when.ancestor(DARK)]: neutral['200'],
    },
    fontWeight: 600,
  },
  table: {
    fontSize: '0.875em',
    lineHeight: 1.7142857,
    marginBlock: '2em',
    width: '100%',
  },
  td: {
    borderBottomColor: {
      default: neutral['300'],
      [stylex.when.ancestor(DARK)]: neutral['700'],
    },
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    paddingBlock: '0.75em',
    paddingInlineEnd: '0.75em',
    verticalAlign: 'top',
  },
  th: {
    borderBottomColor: {
      default: neutral['500'],
      [stylex.when.ancestor(DARK)]: neutral['500'],
    },
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    fontWeight: 600,
    paddingBlock: '0.5714286em',
    paddingInlineEnd: '0.5714286em',
    textAlign: 'start',
    verticalAlign: 'bottom',
  },
  ul: {
    listStyleType: 'disc',
    marginBlock: '1.25em',
    paddingInlineStart: '1.625em',
  },
  /** The reading container; mirrors `.prose prose-slate lg:prose-xl`. */
  root: {
    color: {
      default: neutral['700'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
    fontSize: {
      '@media (min-width: 1024px)': '1.25rem',
      default: '1rem',
    },
    lineHeight: {
      '@media (min-width: 1024px)': 1.8,
      default: 1.75,
    },
    maxWidth: '65ch',
  },
})
