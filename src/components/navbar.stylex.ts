import * as stylex from '@stylexjs/stylex'

import { primary, SPACE, TEXT, zinc } from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'
const LG = '@media (min-width: 1024px)'

/** Ports `assets/css/blox/navbar.css` and `partials/components/headers/navbar.html`. */
export const styles = stylex.create({
  actions: {
    alignItems: 'center',
    display: 'flex',
    marginInlineStart: 'auto',
  },
  brand: {
    color: {
      default: '#000000',
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: TEXT.xl,
    fontWeight: 600,
    textDecorationLine: 'none',
  },
  header: {
    backgroundColor: {
      default: '#ffffff',
      [stylex.when.ancestor(DARK)]: zinc['800'],
    },
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  nav: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBlock: SPACE['3'],
    paddingInline: SPACE['3'],
  },
  navLink: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    display: 'block',
    fontWeight: 600,
    paddingBlock: SPACE['3'],
    paddingInline: SPACE['2'],
    textDecorationLine: 'none',
    transitionProperty: 'color',
    ':hover': {
      color: {
        default: primary['700'],
        [stylex.when.ancestor(DARK)]: primary['300'],
      },
    },
  },
  navLinkActive: {
    fontWeight: 700,
  },
  /**
   * Collapsed on small screens and opened by the `#nav-toggle` checkbox, which
   * is how the previous build implemented its mobile menu without JavaScript.
   */
  navList: {
    alignItems: {
      default: 'stretch',
      [LG]: 'center',
    },
    columnGap: {
      default: null,
      [LG]: SPACE['2'],
    },
    display: {
      default: 'none',
      [LG]: 'flex',
    },
    listStyleType: 'none',
    marginBlock: 0,
    marginInline: 'auto 0',
    paddingBlockEnd: {
      default: SPACE['6'],
      [LG]: 0,
    },
    paddingInline: 0,
  },
  navListOpen: {
    display: 'flex',
  },
  toggle: {
    alignItems: 'center',
    color: {
      default: '#111827',
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    cursor: 'pointer',
    display: {
      default: 'flex',
      [LG]: 'none',
    },
  },
  toggleIcon: {
    blockSize: '1.5rem',
    fill: 'currentColor',
    inlineSize: '1.5rem',
  },
  /** Keeps the checkbox in the DOM so `:checked` can style siblings. */
  toggleInput: {
    blockSize: 0,
    inlineSize: 0,
    opacity: 0,
    position: 'absolute',
  },
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
})
