import vm from 'node:vm'

import { describe, expect, it } from 'vitest'

import { navigationBootstrap } from '../shell/bootstrap.ts'

/**
 * The language switch and the active menu entry are both resolved in the browser
 * from `location.pathname`, so they cannot be checked against the built HTML.
 * These cases run the inlined script against a stub DOM instead.
 */

interface FakeElement {
  attributes: Map<string, string>
  getAttribute: (name: string) => string | null
  setAttribute: (name: string, value: string) => void
}

function element(attributes: Record<string, string> = {}): FakeElement {
  const map = new Map(Object.entries(attributes))
  return {
    attributes: map,
    getAttribute: name => map.get(name) ?? null,
    setAttribute: (name, value) => {
      map.set(name, value)
    },
  }
}

function run(pathname: string, search = '', hash = '') {
  const languageSwitch = element({ 'data-alt-site': 'https://magroup.ac.cn' })
  const navLinks = [
    element({ href: '/' }),
    element({ href: '/#news' }),
    element({ href: '/people' }),
    element({ href: '/publications' }),
  ]

  // The script is a plain string of browser code, so it runs in an isolated
  // context with just the globals it reads.
  vm.runInNewContext(navigationBootstrap, {
    document: {
      addEventListener: () => undefined,
      querySelectorAll: (selector: string) =>
        selector.includes('data-alt-site') ? [languageSwitch] : navLinks,
      readyState: 'complete',
    },
    location: { hash, pathname, search },
  })

  return {
    current: navLinks
      .filter(link => link.getAttribute('aria-current') === 'page')
      .map(link => link.getAttribute('href')),
    href: languageSwitch.getAttribute('href'),
  }
}

describe('language switch', () => {
  it('mirrors the home page', () => {
    expect(run('/').href).toBe('https://magroup.ac.cn/')
  })

  it('normalises a path the static export publishes with a trailing slash', () => {
    expect(run('/people/yhma').href).toBe('https://magroup.ac.cn/people/yhma/')
    expect(run('/people/yhma/').href).toBe('https://magroup.ac.cn/people/yhma/')
  })

  it('keeps the query and the anchor', () => {
    expect(run('/people/yhma/', '?q=1', '#bio').href).toBe(
      'https://magroup.ac.cn/people/yhma/?q=1#bio',
    )
  })

  it('leaves a file path alone', () => {
    expect(run('/sitemap.xml').href).toBe('https://magroup.ac.cn/sitemap.xml')
  })
})

describe('active menu entry', () => {
  it('marks the home entry only on the home page', () => {
    expect(run('/').current).toEqual(['/'])
    expect(run('/people/').current).toEqual(['/people'])
  })

  it('marks a section entry for its detail pages', () => {
    expect(run('/people/yhma/').current).toEqual(['/people'])
  })

  it('matches whole path segments only', () => {
    // `/publication/<slug>/` is the publication entry, `/publications/` is the
    // landing page the menu points at; one must not mark the other.
    expect(
      run('/publication/2017-ma-quantum-sensing-rotation/').current,
    ).toEqual([])
    expect(run('/publications/').current).toEqual(['/publications'])
  })

  it('does not mark the anchored News entry', () => {
    expect(run('/').current).not.toContain('/#news')
  })
})
