'use client'

import type { UiStrings } from '../content/strings.ts'

import * as stylex from '@stylexjs/stylex'
import { useCallback, useSyncExternalStore } from 'react'

import { MOTION, RADIUS, theme } from '../styles/tokens.stylex.ts'
import { Icon } from './icon.tsx'
import { Button } from './ui/button.tsx'

/** The bootstrap chooses the initial theme; this control observes and toggles it. */
type Theme = 'dark' | 'light'

const styles = stylex.create({
  button: {
    borderRadius: RADIUS.md,
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor('[data-theme="dark"]')]: '#a9b4ba',
    },
    minBlockSize: '2.25rem',
    minInlineSize: '2.25rem',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color, background-color',
    transitionTimingFunction: MOTION.easeOut,
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        backgroundColor: {
          default: theme.bgSubtle,
          [stylex.when.ancestor('[data-theme="dark"]')]: '#172028',
        },
        color: {
          default: theme.fg,
          [stylex.when.ancestor('[data-theme="dark"]')]: '#e9eeec',
        },
      },
    },
  },
})

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light'
}

function subscribe(onChange: () => void): () => void {
  if (typeof MutationObserver === 'undefined') return () => undefined
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
    attributes: true,
  })
  return () => {
    observer.disconnect()
  }
}

export interface ThemeToggleProps {
  labels: UiStrings['appearance']
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light')

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset['theme'] = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private mode: the in-memory theme still applies for this session.
    }
  }, [])

  return (
    <Button
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      onPress={toggle}
      render={props => <button {...props} accessKey="t" title={labels.label} />}
      xstyle={styles.button}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </Button>
  )
}
