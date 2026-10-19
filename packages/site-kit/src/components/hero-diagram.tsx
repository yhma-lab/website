import type { UiStrings } from '../content/strings.ts'

import * as stylex from '@stylexjs/stylex'

import {
  FONT_SANS,
  FONT_SERIF,
  MOTION,
  TEXT,
  theme,
} from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

/**
 * One drawing pass for the finite-time loop. The path normalizes its own length
 * with `pathLength=1`, so a unit dash offset works regardless of the geometry.
 */
const draw = stylex.keyframes({
  from: { strokeDashoffset: 1 },
  to: { strokeDashoffset: 0 },
})

const styles = stylex.create({
  arrow: {
    fill: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
  },
  axis: {
    fill: 'none',
    stroke: {
      default: theme.fgSubtle,
      [stylex.when.ancestor(DARK)]: '#7f8b92',
    },
    strokeWidth: 1.25,
  },
  axisText: {
    fill: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: 14,
    fontStyle: 'italic',
  },
  finite: {
    animationDelay: '220ms',
    animationDuration: '1100ms',
    animationFillMode: 'both',
    animationName: {
      default: draw,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: MOTION.easeOut,
    fill: 'none',
    stroke: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    strokeDasharray: 1,
    strokeDashoffset: {
      default: 1,
      '@media (prefers-reduced-motion: reduce)': 0,
    },
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
  },
  figure: {
    margin: 0,
  },
  finiteArea: {
    fill: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    fillOpacity: {
      default: 0.055,
      [stylex.when.ancestor(DARK)]: 0.12,
    },
    stroke: 'none',
  },
  grid: {
    stroke: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    strokeDasharray: '2 7',
    strokeWidth: 1,
  },
  ideal: {
    fill: 'none',
    stroke: {
      default: theme.fgSubtle,
      [stylex.when.ancestor(DARK)]: '#7f8b92',
    },
    strokeDasharray: '5 6',
    strokeWidth: 1.25,
  },
  label: {
    fill: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: 12,
    fontStyle: 'italic',
  },
  legend: {
    alignItems: 'center',
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    columnGap: '1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.micro,
    marginBlockStart: '1rem',
    rowGap: '0.5rem',
  },
  legendItem: {
    alignItems: 'center',
    columnGap: '0.5rem',
    display: 'inline-flex',
  },
  legendSampleFinite: {
    blockSize: 0,
    borderBlockStartColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 2,
    inlineSize: '1.375rem',
  },
  legendSampleIdeal: {
    blockSize: 0,
    borderBlockStartColor: {
      default: theme.fgSubtle,
      [stylex.when.ancestor(DARK)]: '#7f8b92',
    },
    borderBlockStartStyle: 'dashed',
    borderBlockStartWidth: 1.25,
    inlineSize: '1.375rem',
  },
  sub: {
    fontSize: 8,
  },
  svg: {
    display: 'block',
    inlineSize: '100%',
    overflow: 'visible',
  },
  work: {
    fill: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: 15,
    fontStyle: 'italic',
    opacity: 0.85,
  },
})

export interface HeroDiagramProps {
  labels: UiStrings['heroDiagram']
}

/**
 * The lab's subject, drawn once.
 *
 * A temperature–entropy plane: the dashed rectangle is the ideal Carnot cycle
 * (two isotherms and two adiabats), and the solid loop inside it is the
 * finite-time cycle the group actually studies — the finite-rate heat exchange
 * pulls the working medium away from the reservoir temperatures, so the ideal
 * rectangle becomes an enclosed loop of smaller area. The enclosed area is the
 * work per cycle, marked `W`.
 *
 * Presentational SVG: the accessible name comes from the localized label, and
 * the legend spells out both line styles in text rather than colour alone.
 */
export function HeroDiagram({ labels }: HeroDiagramProps) {
  return (
    <figure {...stylex.props(styles.figure)}>
      <svg
        aria-label={labels.label}
        role="img"
        viewBox="0 0 560 430"
        {...stylex.props(styles.svg)}
      >
        <g {...stylex.props(styles.grid)}>
          {[160, 228, 296, 364, 432].map(x => (
            <line key={x} x1={x} x2={x} y1={44} y2={356} />
          ))}
          {[120, 174, 228, 282].map(y => (
            <line key={y} x1={80} x2={500} y1={y} y2={y} />
          ))}
        </g>

        <g {...stylex.props(styles.axis)}>
          <path d="M80 356V44M76 52 80 44l4 8" />
          <path d="M80 356H500M492 352l8 4-8 4" />
          <path d="M75 120h5M75 296h5" />
        </g>

        <path d="M150 120H450V296H150Z" {...stylex.props(styles.ideal)} />

        <path
          d="M150 132C250 150 350 150 450 132C442 190 442 230 450 284C350 266 250 266 150 284C158 230 158 190 150 132Z"
          {...stylex.props(styles.finiteArea)}
        />
        <path
          d="M150 132C250 150 350 150 450 132C442 190 442 230 450 284C350 266 250 266 150 284C158 230 158 190 150 132Z"
          pathLength={1}
          {...stylex.props(styles.finite)}
        />

        <g {...stylex.props(styles.arrow)}>
          <path d="M300 139l11 6-11 6z" />
          <path d="M300 261l-11 6 11 6z" />
          <path d="M440 203l6 11 6-11z" />
        </g>

        <text textAnchor="end" x="130" y="124" {...stylex.props(styles.label)}>
          T
          <tspan {...stylex.props(styles.sub)} dy="3">
            H
          </tspan>
        </text>
        <text textAnchor="end" x="130" y="300" {...stylex.props(styles.label)}>
          T
          <tspan {...stylex.props(styles.sub)} dy="3">
            C
          </tspan>
        </text>
        <text x="62" y="52" {...stylex.props(styles.axisText)}>
          T
        </text>
        <text x="510" y="376" {...stylex.props(styles.axisText)}>
          S
        </text>
        <text
          textAnchor="middle"
          x="300"
          y="214"
          {...stylex.props(styles.work)}
        >
          W
        </text>
      </svg>

      <figcaption {...stylex.props(styles.legend)}>
        <span {...stylex.props(styles.legendItem)}>
          <span
            aria-hidden="true"
            {...stylex.props(styles.legendSampleIdeal)}
          />
          {labels.ideal}
        </span>
        <span {...stylex.props(styles.legendItem)}>
          <span
            aria-hidden="true"
            {...stylex.props(styles.legendSampleFinite)}
          />
          {labels.finiteTime}
        </span>
      </figcaption>
    </figure>
  )
}
