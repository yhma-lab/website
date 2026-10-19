'use client'

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import type { UiStrings } from '../content/strings.ts'

import * as stylex from '@stylexjs/stylex'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Disclosure, DisclosurePanel } from 'react-aria-components/Disclosure'

import { styles } from './navigation-disclosure.stylex.ts'
import { Button } from './ui/button.tsx'

const DESKTOP = '(min-width: 1024px)'
const desktopSnapshot = () => window.matchMedia(DESKTOP).matches
const serverSnapshot = () => false

export interface NavigationDisclosureProps {
  children: ReactNode
  labels: UiStrings['navigation']
}

export function NavigationDisclosure({
  children,
  labels,
}: NavigationDisclosureProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const focusAfterResizeRef = useRef<'link' | 'trigger' | null>(null)

  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(DESKTOP)
    const update = () => {
      const active = document.activeElement
      if (media.matches && active === triggerRef.current) {
        focusAfterResizeRef.current = 'link'
      } else if (
        !media.matches &&
        active &&
        panelRef.current?.contains(active)
      ) {
        focusAfterResizeRef.current = 'trigger'
      }
      if (media.matches) setMobileOpen(false)
      onChange()
    }
    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
    }
  }, [])
  const isDesktop = useSyncExternalStore(
    subscribe,
    desktopSnapshot,
    serverSnapshot,
  )
  const isExpanded = isDesktop || mobileOpen

  useLayoutEffect(() => {
    if (focusAfterResizeRef.current === 'link') {
      panelRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
    } else if (focusAfterResizeRef.current === 'trigger') {
      triggerRef.current?.focus()
    }
    focusAfterResizeRef.current = null
  }, [isDesktop])

  const close = () => {
    setMobileOpen(false)
    triggerRef.current?.focus()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !isDesktop && mobileOpen) {
      event.preventDefault()
      event.stopPropagation()
      close()
    }
  }
  const handleLink = (event: MouseEvent<HTMLDivElement>) => {
    if (isDesktop || (event.type === 'auxclick' && event.button !== 1)) return
    const link =
      event.target instanceof Element ? event.target.closest('a[href]') : null
    if (link && panelRef.current?.contains(link)) {
      // Do not intercept the native navigation, including modified/new-tab clicks.
      close()
    }
  }

  return (
    <Disclosure
      {...stylex.props(styles.disclosure)}
      isExpanded={isExpanded}
      onExpandedChange={setMobileOpen}
      render={props => (
        <div
          {...props}
          onAuxClick={handleLink}
          onClick={handleLink}
          onKeyDownCapture={handleKeyDown}
        />
      )}
    >
      <Button
        aria-label={isExpanded ? labels.close : labels.open}
        hidden={isDesktop}
        ref={triggerRef}
        slot="trigger"
        xstyle={[styles.toggle, isDesktop && styles.hidden]}
      >
        <svg
          aria-hidden="true"
          {...stylex.props(styles.icon)}
          viewBox="0 0 24 24"
        >
          <path
            d={isExpanded ? 'm6 6 12 12M6 18 18 6' : 'M3 6h18M3 12h18M3 18h18'}
          />
        </svg>
      </Button>
      <DisclosurePanel
        aria-label={labels.label}
        ref={panelRef}
        {...stylex.props(styles.panel)}
      >
        {children}
      </DisclosurePanel>
    </Disclosure>
  )
}
