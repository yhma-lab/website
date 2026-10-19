import * as stylex from '@stylexjs/stylex'

import { MOTION, theme } from '../../styles/tokens.stylex.ts'

// Keep this selector local so StyleX can statically evaluate dark conditions.
const DARK = '[data-theme="dark"]'

/**
 * Shared control primitives.
 *
 * One focus ring and one press response for every control in the system: a 2px
 * cobalt ring offset from the shape, and a 140ms scale-down on pointer-down so
 * the interface acknowledges the press before the action completes. The ring is
 * defined twice: `focusVisible` is applied from React Aria's `isFocusVisible`
 * render state, while `nativeFocusVisible` is a `:focus-visible` rule for plain
 * anchors that never cross the client boundary.
 */
export const controlStyles = stylex.create({
  button: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    justifyContent: 'center',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
    textAlign: 'inherit',
    transitionDuration: MOTION.press,
    transitionProperty: 'transform',
    transitionTimingFunction: MOTION.easeOut,
    ':active': {
      transform: 'scale(0.97)',
    },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  focusVisible: {
    outlineColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    outlineOffset: 3,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  /**
   * Unconditional ring colour with a focus-only outline: the colour is inert
   * while the outline is not rendered, which keeps the pseudo-class condition
   * free of a nested theme pair.
   */
  nativeFocusVisible: {
    outlineColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    outlineOffset: { default: null, ':focus-visible': 3 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineWidth: { default: null, ':focus-visible': 2 },
  },
})
