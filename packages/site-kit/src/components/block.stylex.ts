import * as stylex from '@stylexjs/stylex'

import { gray, neutral, primary, SPACE, TEXT } from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'

/**
 * Shared block chrome.
 *
 * Ports the frame every `partials/blox/*.html` opens with
 * (`<section class="relative hbb-section" style="padding: {spacing} 0">`) plus
 * `collection.html`'s centered title block and the attachment link styles from
 * `assets/css/views/attachments.css`.
 */
export const styles = stylex.create({
  attachmentIcon: {
    display: 'inline-block',
    height: '1em',
    marginInlineEnd: SPACE['1'],
  },
  attachmentLink: {
    color: {
      default: primary['600'],
      [stylex.when.ancestor(DARK)]: primary['400'],
    },
    display: 'inline-block',
    fontWeight: 700,
    marginBlockEnd: SPACE['1'],
    marginInlineEnd: SPACE['1'],
    outline: 'none',
    textDecorationLine: 'none',
    textTransform: 'uppercase',
    transitionDuration: '150ms',
    transitionProperty: 'all',
  },
  attachmentRow: {
    columnGap: SPACE['3'],
    display: 'flex',
    flexWrap: 'wrap',
  },
  attachmentSmall: {
    fontSize: TEXT.xs,
    paddingBlock: SPACE['1'],
    paddingInline: SPACE['3'],
  },
  block: {
    position: 'relative',
  },
  bodyText: {
    marginBlock: 0,
  },
  centered: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingInline: SPACE['6'],
  },
  heading: {
    color: {
      default: gray['900'],
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: TEXT['3xl'],
    fontWeight: 700,
    marginBlockEnd: SPACE['6'],
  },
  headingWrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACE['3'],
    justifyContent: 'center',
    marginBlockEnd: SPACE['8'],
    maxWidth: '65ch',
    paddingInline: {
      default: SPACE['6'],
      '@media (min-width: 768px)': 0,
    },
  },
  muted: {
    color: {
      default: gray['500'],
      [stylex.when.ancestor(DARK)]: gray['400'],
    },
  },
  text: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
  },
  textMuted: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: neutral['400'],
    },
  },
})
