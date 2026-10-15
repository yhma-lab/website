import * as stylex from '@stylexjs/stylex'

import { SPACE, TEXT, gray, neutral, primary, zinc } from '../styles/tokens.stylex.ts'

/**
 * Ancestor selector for the dark colour scheme.
 *
 * Repeated in each styling module on purpose: `stylex.when.ancestor()` is only
 * rewritten when the compiler can evaluate the argument in the module it is
 * processing, so a shared constant from another file would reach the runtime
 * stub and fail condition validation.
 */
const DARK = '[data-theme="dark"]'


/** Ports `layouts/partials/blox/resume-biography.html` and `-3`. */
export const styles = stylex.create({
  avatar: {
    backgroundColor: {
      default: '#ffffff',
      [stylex.when.ancestor(DARK)]: gray['800'],
    },
    borderRadius: '9999px',
    padding: SPACE['1'],
  },
  avatarWrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBlockStart: SPACE['10'],
  },
  bio: {
    fontSize: {
      '@media (min-width: 1024px)': '1.25rem',
      default: '1rem',
    },
    lineHeight: {
      '@media (min-width: 1024px)': 1.8,
      default: 1.75,
    },
    maxWidth: '65ch',
    paddingBlockStart: SPACE['2'],
  },
  bioColumn: {
    marginBlockStart: {
      default: 0,
      '@media (min-width: 768px)': SPACE['12'],
    },
    maxWidth: '65ch',
  },
  column: {
    flex: '1 1 auto',
  },
  container: {
    columnGap: SPACE['12'],
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 768px)': 'row',
    },
    justifyContent: 'center',
    paddingInline: SPACE['3'],
  },
  gridTwo: {
    columnGap: SPACE['4'],
    display: 'grid',
    gridTemplateColumns: {
      '@media (min-width: 768px)': '1fr 1fr',
      default: '1fr',
    },
    justifyContent: 'space-between',
    marginBlockStart: SPACE['6'],
  },
  iconWrap: {
    flexShrink: 0,
    marginBlockStart: SPACE['1'],
  },
  interestItem: {
    listStyleType: 'disc',
  },
  interests: {
    listStylePosition: 'inside',
    marginBlock: 0,
    paddingInlineStart: SPACE['5'],
  },
  name: {
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: TEXT['3xl'],
    fontWeight: 700,
    marginBlockEnd: SPACE['2'],
    marginBlockStart: SPACE['6'],
  },
  org: {
    marginBlockEnd: SPACE['2'],
  },
  profile: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileList: {
    columnGap: SPACE['2'],
    display: 'flex',
    listStyleType: 'none',
    paddingInline: 0,
  },
  role: {
    fontWeight: 600,
    marginBlockEnd: SPACE['1'],
  },
  sectionHeading: {
    fontSize: TEXT.xl,
    fontWeight: 700,
    marginBlockEnd: SPACE['3'],
  },
  timeline: {
    borderInlineStartColor: {
      default: gray['200'],
      [stylex.when.ancestor(DARK)]: zinc['700'],
    },
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    listStyleType: 'none',
    paddingInlineStart: 0,
    position: 'relative',
  },
  timelineDot: {
    alignItems: 'center',
    backgroundColor: {
      default: primary['100'],
      [stylex.when.ancestor(DARK)]: primary['900'],
    },
    borderRadius: '9999px',
    blockSize: SPACE['6'],
    color: {
      default: primary['800'],
      [stylex.when.ancestor(DARK)]: primary['300'],
    },
    display: 'flex',
    insetInlineStart: '-0.75rem',
    justifyContent: 'center',
    position: 'absolute',
  },
  timelineEntry: {
    marginBlockEnd: SPACE['10'],
    marginInlineStart: SPACE['6'],
  },
  timelineOrg: {
    display: 'block',
    fontSize: TEXT.sm,
    marginBlockEnd: SPACE['2'],
  },
  timelineSummary: {
    marginBlockEnd: SPACE['4'],
  },
  timelineTime: {
    display: 'block',
    fontSize: TEXT.sm,
    marginBlockEnd: SPACE['3'],
  },
  timelineTitle: {
    color: {
      default: gray['900'],
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    fontSize: TEXT.lg,
    fontWeight: 600,
    marginBlockEnd: SPACE['1'],
  },
  muted: {
    color: {
      default: gray['500'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
  },
  /** `resume-experience` stacks the work and education timelines. */
  experienceWrap: {
    flexDirection: 'column',
    rowGap: SPACE['6'],
  },
})

/** Ports `partials/blox/resume-awards.html`. */
export const awardStyles = stylex.create({
  awarder: {
    color: {
      default: neutral['800'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
    fontSize: TEXT.sm,
    fontWeight: 600,
    lineHeight: '1.5rem',
    textAlign: 'center',
  },
  body: {
    flexGrow: 1,
  },
  date: {
    color: {
      default: neutral['700'],
      [stylex.when.ancestor(DARK)]: neutral['300'],
    },
    fontSize: TEXT.sm,
    textAlign: 'center',
  },
  heading: {
    fontSize: TEXT['3xl'],
    fontWeight: 700,
    marginBlockEnd: SPACE['6'],
  },
  iconColumn: {
    flexShrink: 0,
    placeSelf: 'center',
  },
  row: {
    columnGap: SPACE['6'],
    display: 'flex',
    paddingBlock: `${SPACE['12']} ${SPACE['4']}`,
  },
  summary: {
    marginBlockStart: SPACE['1'],
  },
})
