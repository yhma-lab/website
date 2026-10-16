import * as stylex from '@stylexjs/stylex'
import { defineConsts, defineVars } from '@stylexjs/stylex'

/**
 * Design tokens.
 *
 * The values are lifted verbatim from the previous Tailwind build
 * (`hugo-public/dist/wc.min.*.css` plus `css/themes/blue.min.css`) so that the
 * ported components reproduce the original rendering rather than an
 * approximation of it.
 */

/**
 * Marks the subtree that renders with dark-mode values.
 *
 * The generated class is applied to the page shell (`themeMarker` in
 * `stylex.props`), and every `DARK` condition below compiles to
 * `:where(.x-default-marker[data-theme="dark"] *)`, which requires an ancestor
 * carrying both the marker class and the `data-theme="dark"` attribute.
 */
export const themeMarker = stylex.defineMarker()

/**
 * Dark-mode condition for any descendant of the marked element.
 *
 * Every condition object that mixes a light and a dark value repeats this shape:
 * `{ default: light, [stylex.when.ancestor('[data-theme="dark"]')]: dark }`.
 * It must be written inline in each styling module, because the compiler only
 * rewrites `stylex.when.*` calls in the module it is processing: a shared
 * constant would resolve to the runtime stub and fail condition validation.
 */

/** The `Inter var` face, declared in `src/styles/global.css`. */
export const FONT_SANS = defineConsts({
  family:
    'Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
})

/*
 * Responsive breakpoints are Tailwind's defaults and match the media queries in
 * the old build: 640px (`sm`), 768px (`md`), 1024px (`lg`), 1280px (`xl`).
 *
 * They are written as string literals inside each `stylex.create` call rather
 * than shared from this module: a shared constant resolves to a plain string at
 * compile time and the compiler then emits it as a custom-property name instead
 * of an at-rule.
 */

/** Tailwind's default `4px` spacing scale. */
export const SPACE = defineConsts({
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
})

/** Tailwind's default font-size scale. */
export const TEXT = defineConsts({
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  base: '1rem',
  lg: '1.125rem',
  sm: '0.875rem',
  xl: '1.25rem',
  xs: '0.75rem',
})

/** Widths used by the page shell and the prose container. */
export const WIDTH = defineConsts({
  '2xl': '42rem',
  '3xl': '48rem',
  container: '80rem',
  prose: '65ch',
})

/** Fixed sizes used by the avatar rendering. */
export const SIZE = defineConsts({
  avatar: '100px',
  avatarLg: '150px',
})

/** `dark:bg-hb-dark`, the body background in dark mode. */
export const HB_DARK = '#17181c'

/**
 * Theme-level variables, referenced by component styles.
 *
 * These are plain `defineVars` rather than `createTheme` output on purpose:
 * dark mode is expressed per-property through `DARK`, which keeps a single
 * class list per element and avoids an extra theme class on the root.
 */
export const theme = defineVars({
  bg: '#ffffff',
  bgMuted: '#fafafa',
  border: '#e5e5e5',
  borderStrong: '#d4d4d4',
  fg: '#171717',
  fgMuted: '#525252',
  fgSubtle: '#737373',
})

/** Tailwind's `neutral` ramp, used directly by the ported component styles. */
export const neutral = defineVars({
  '100': '#f5f5f5',
  '200': '#e5e5e5',
  '300': '#d4d4d4',
  '400': '#a3a3a3',
  '50': '#fafafa',
  '500': '#737373',
  '600': '#525252',
  '700': '#404040',
  '800': '#262626',
  '900': '#171717',
  '950': '#0a0a0a',
})

/** Tailwind's `neutral.DEFAULT`, only used inside the inverted prose palette. */
export const NEUTRAL_DEFAULT = '#737373'

/** Tailwind's `zinc` ramp, used by the dark-mode page chrome. */
export const zinc = defineVars({
  '100': '#f4f4f5',
  '200': '#e4e4e7',
  '300': '#d4d4d8',
  '400': '#a1a1aa',
  '500': '#71717a',
  '600': '#52525b',
  '700': '#3f3f46',
  '800': '#27272a',
  '900': '#18181b',
})

/** Tailwind's `slate` ramp, used by the publication headings. */
export const slate = defineVars({
  '100': '#f1f5f9',
  '900': '#0f172a',
})

/** Tailwind's `gray` ramp, used by the resume blocks. */
export const gray = defineVars({
  '100': '#f3f4f6',
  '200': '#e5e7eb',
  '300': '#d1d5db',
  '400': '#9ca3af',
  '500': '#6b7280',
  '600': '#4b5563',
  '700': '#374151',
  '800': '#1f2937',
  '900': '#111827',
})

/**
 * Tailwind's `blue` ramp from `css/themes/blue.min.css`, backing every
 * `primary-*` utility in the original markup.
 */
export const primary = defineVars({
  '100': '#dbeafe',
  '200': '#bfdbfe',
  '300': '#93c5fd',
  '400': '#60a5fa',
  '50': '#eff6ff',
  '500': '#3b82f6',
  '600': '#2563eb',
  '700': '#1d4ed8',
  '800': '#1e40af',
  '900': '#1e3a8a',
  '950': '#172554',
})

/**
 * Tailwind's `cyan` ramp from `css/themes/blue.min.css`, backing every
 * `secondary-*` utility in the original markup.
 */
export const secondary = defineVars({
  '100': '#cffafe',
  '200': '#a5f3fc',
  '300': '#67e8f9',
  '400': '#22d3ee',
  '50': '#ecfeff',
  '500': '#06b6d4',
  '600': '#0891b2',
  '700': '#0e7490',
  '800': '#155e75',
  '900': '#164e63',
  '950': '#083344',
})
