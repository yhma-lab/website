'use client'

import * as stylex from '@stylexjs/stylex'
import { useCallback, useSyncExternalStore } from 'react'

import { SPACE } from '../styles/tokens.stylex.ts'
import { Icon } from './icon.tsx'

/**
 * Theme chooser.
 *
 * The previous build shipped a small script plus a button with the same
 * `accesskey="t"`. The initial `data-theme` value is written by the bootstrap
 * script in `src/pages/_root.tsx` before first paint; this component only reads
 * and toggles it, and subscribes to `data-theme` mutations so its icon stays in
 * sync when the OS preference changes.
 */

type Theme = 'dark' | 'light'

const DARK = '[data-theme="dark"]'

const styles = stylex.create({
  button: {
    alignItems: 'center',
    color: {
      default: null,
      [stylex.when.ancestor(DARK)]: '#ffffff',
    },
    cursor: 'pointer',
    display: 'inline-flex',
    paddingInline: SPACE['3'],
    ':hover': {
      opacity: 0.75,
    },
  },
  icon: {
    blockSize: '1.5rem',
    inlineSize: '1.5rem',
    stroke: 'currentColor',
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

export function ThemeToggle() {
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
    <button
      accessKey="t"
      aria-label={
        theme === 'dark'
          ? 'Switch to light appearance'
          : 'Switch to dark appearance'
      }
      onClick={toggle}
      title="appearance"
      type="button"
      {...stylex.props(styles.button)}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  )
}
