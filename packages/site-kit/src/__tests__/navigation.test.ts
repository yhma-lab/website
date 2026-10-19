import vm from 'node:vm'

import { describe, expect, it } from 'vitest'

import { navigationBootstrap, themeBootstrap } from '../shell/bootstrap.ts'

interface FakeElement {
  attributes: Map<string, string>
  children: FakeElement[]
  parent: FakeElement | null
  nodeType: number
  writes: number
  closest: (selector: string) => FakeElement | null
  getAttribute: (name: string) => string | null
  hasAttribute: (name: string) => boolean
  matches: (selector: string) => boolean
  querySelector: (selector: string) => FakeElement | null
  removeAttribute: (name: string) => void
  setAttribute: (name: string, value: string) => void
}

function element(
  attributes: Record<string, string> = {},
  children: FakeElement[] = [],
): FakeElement {
  const map = new Map(Object.entries(attributes))
  const node: FakeElement = {
    attributes: map,
    children,
    parent: null,
    nodeType: 1,
    writes: 0,
    closest: selector =>
      node.matches(selector) ? node : (node.parent?.closest(selector) ?? null),
    getAttribute: name => map.get(name) ?? null,
    hasAttribute: name => map.has(name),
    matches: selector =>
      selector.split(',').some(part => {
        if (part === '#nav-menu') return map.get('id') === 'nav-menu'
        if (part === 'a[data-alt-site]') return map.has('data-alt-site')
        if (part === '#nav-menu a')
          return map.has('href') && Boolean(node.parent?.closest('#nav-menu'))
        return false
      }),
    querySelector: selector =>
      descendants(node).find(child => child.matches(selector)) ?? null,
    removeAttribute: name => {
      node.writes++
      map.delete(name)
    },
    setAttribute: (name, value) => {
      node.writes++
      map.set(name, value)
    },
  }
  for (const child of children) child.parent = node
  return node
}

function descendants(node: FakeElement): FakeElement[] {
  return node.children.flatMap(child => [child, ...descendants(child)])
}

interface Mutation {
  addedNodes: FakeElement[]
  target: FakeElement
}

function run(
  pathname: string,
  search = '',
  hash = '',
  options: { mounted?: boolean; loading?: boolean } = {},
) {
  const root = element()
  const location = { hash, pathname, search }
  const callbacks: ((records: Mutation[]) => void)[] = []
  const observed: { target: FakeElement; options: MutationObserverInit }[] = []
  const listeners = new Map<string, (() => void)[]>()
  let queries = 0
  let languageSwitch: FakeElement
  let navLinks: FakeElement[]
  let menu: FakeElement
  const addEventListener = (type: string, listener: () => void) => {
    listeners.set(type, [...(listeners.get(type) ?? []), listener])
  }
  const mount = () => {
    languageSwitch = element({
      'data-alt-site': 'https://magroup.ac.cn',
      href: 'https://magroup.ac.cn/',
    })
    navLinks = [
      element({ href: '/' }),
      element({ href: '#news' }),
      element({ href: '/people' }),
      element({ href: '/publications' }),
    ]
    menu = element({ id: 'nav-menu' }, navLinks)
    const wrapper = element({}, [menu, languageSwitch])
    root.children = [wrapper]
    for (const callback of callbacks)
      callback([{ target: root, addedNodes: [wrapper] }])
  }
  if (options.mounted !== false) mount()

  vm.runInNewContext(navigationBootstrap, {
    document: {
      addEventListener,
      documentElement: root,
      querySelectorAll: (selector: string) => {
        queries++
        return descendants(root).filter(node => node.matches(selector))
      },
      readyState: options.loading ? 'loading' : 'complete',
    },
    location,
    MutationObserver: class {
      constructor(callback: (records: Mutation[]) => void) {
        callbacks.push(callback)
      }
      observe(target: FakeElement, options: MutationObserverInit) {
        observed.push({ target, options })
      }
    },
    window: { addEventListener },
  })

  return {
    current: () =>
      navLinks
        .filter(link => link.getAttribute('aria-current') === 'page')
        .map(link => link.getAttribute('href')),
    emit: (type: string) =>
      listeners.get(type)?.forEach(listener => {
        listener()
      }),
    href: () => languageSwitch.getAttribute('href'),
    links: () => navLinks,
    location,
    menu: () => menu,
    mount,
    mutate: (records: Mutation[]) => {
      callbacks.forEach(callback => {
        callback(records)
      })
    },
    observed,
    queries: () => queries,
    root,
    writes: () =>
      languageSwitch.writes +
      navLinks.reduce((total, link) => total + link.writes, 0),
  }
}

describe('language switch', () => {
  it('mirrors the home page', () => {
    expect(run('/').href()).toBe('https://magroup.ac.cn/')
  })

  it('normalises static-export paths with a trailing slash', () => {
    expect(run('/people/yhma').href()).toBe(
      'https://magroup.ac.cn/people/yhma/',
    )
    expect(run('/people/yhma/').href()).toBe(
      'https://magroup.ac.cn/people/yhma/',
    )
  })

  it('keeps the query and the anchor', () => {
    expect(run('/people/yhma/', '?q=1', '#bio').href()).toBe(
      'https://magroup.ac.cn/people/yhma/?q=1#bio',
    )
  })

  it('leaves a file path alone', () => {
    expect(run('/sitemap.xml').href()).toBe('https://magroup.ac.cn/sitemap.xml')
  })
})

describe('active menu entry', () => {
  it('marks home only on home and section entries on their detail pages', () => {
    expect(run('/').current()).toEqual(['/'])
    expect(run('/people/').current()).toEqual(['/people'])
    expect(run('/people/yhma/').current()).toEqual(['/people'])
  })

  it('matches whole path segments only', () => {
    expect(
      run('/publication/2017-ma-quantum-sensing-rotation/').current(),
    ).toEqual([])
    expect(run('/publications/').current()).toEqual(['/publications'])
  })

  it('never marks a hash link, and clears stale active states after navigation', () => {
    const nav = run('/')
    nav.links()[1]?.setAttribute('aria-current', 'page')
    nav.location.pathname = '/people/yhma/'
    nav.emit('popstate')
    expect(nav.current()).toEqual(['/people'])
    expect(nav.links()[0]?.getAttribute('aria-current')).toBeNull()
    expect(nav.links()[1]?.getAttribute('aria-current')).toBeNull()
    nav.location.pathname = '/missing/'
    nav.emit('popstate')
    expect(nav.current()).toEqual([])
  })
})

describe('navigation bootstrap lifecycle', () => {
  it('waits for document parsing and also handles a later RSC mount', () => {
    const loading = run('/people/', '', '', { loading: true })
    expect(loading.current()).toEqual([])
    loading.emit('DOMContentLoaded')
    expect(loading.current()).toEqual(['/people'])

    const delayed = run('/people/', '?page=2', '#bio', { mounted: false })
    delayed.mount()
    expect(delayed.current()).toEqual(['/people'])
    expect(delayed.href()).toBe('https://magroup.ac.cn/people/?page=2#bio')
  })

  it('enhances replacements and new links inside an existing menu', () => {
    const nav = run('/people/')
    nav.location.pathname = '/publications/'
    nav.mount()
    expect(nav.current()).toEqual(['/publications'])
    expect(nav.href()).toBe('https://magroup.ac.cn/publications/')

    const item = element({ href: '/fundings' })
    item.parent = nav.menu()
    nav.menu().children.push(item)
    nav.location.pathname = '/fundings/'
    nav.mutate([{ target: nav.menu(), addedNodes: [item] }])
    expect(item.getAttribute('aria-current')).toBe('page')
    expect(nav.current()).toEqual(['/fundings'])
  })

  it('uses one filtered child-list observer and ignores unrelated updates', () => {
    const nav = run('/')
    expect(nav.observed).toHaveLength(1)
    expect(nav.observed[0]?.target).toBe(nav.root)
    expect(nav.observed[0]?.options).toEqual({ childList: true, subtree: true })
    const queries = nav.queries()
    nav.mutate([{ target: nav.root, addedNodes: [element({ id: 'content' })] }])
    expect(nav.queries()).toBe(queries)
    nav.mutate([
      { target: nav.menu(), addedNodes: [] },
      { target: nav.menu(), addedNodes: [] },
    ])
    expect(nav.queries()).toBe(queries + 2)
  })

  it('updates location changes without redundant attribute writes', () => {
    const nav = run('/people/')
    const writes = nav.writes()
    nav.emit('popstate')
    nav.emit('hashchange')
    expect(nav.writes()).toBe(writes)
    nav.location.hash = '#profile'
    nav.location.search = '?view=full'
    nav.emit('hashchange')
    expect(nav.href()).toBe('https://magroup.ac.cn/people/?view=full#profile')
    expect(nav.writes()).toBe(writes + 1)
    nav.emit('hashchange')
    expect(nav.writes()).toBe(writes + 1)
  })
})

describe('theme bootstrap', () => {
  function theme(
    stored: string | null,
    dark: boolean,
    failStorage = false,
    failMedia = false,
  ) {
    interface ThemeMutation {
      oldValue: string | null
    }
    const callbacks: ((records: ThemeMutation[]) => void)[] = []
    const observed: { target: object; options: MutationObserverInit }[] = []
    const pending: ThemeMutation[] = []
    let value: string | undefined
    let writes = 0
    let storageReads = 0
    let mediaReads = 0
    const dataset = {
      get theme() {
        return value
      },
      set theme(next: string | undefined) {
        const oldValue = value ?? null
        value = next
        writes++
        if (observed.length > 0) pending.push({ oldValue })
      },
    }
    const root = { dataset }
    const localStorage = {
      getItem: () => {
        storageReads++
        if (failStorage) throw new Error('storage blocked')
        return stored
      },
      setItem: (_key: string, next: string) => {
        if (failStorage) throw new Error('storage blocked')
        stored = next
      },
    }
    vm.runInNewContext(themeBootstrap, {
      document: { documentElement: root },
      localStorage,
      MutationObserver: class {
        constructor(callback: (records: ThemeMutation[]) => void) {
          callbacks.push(callback)
        }
        observe(target: object, options: MutationObserverInit) {
          observed.push({ target, options })
        }
      },
      window: {
        matchMedia: () => {
          mediaReads++
          if (failMedia) throw new Error('media unavailable')
          return { matches: dark }
        },
      },
    })
    return {
      current: () => dataset.theme,
      flush: () => {
        // Include observer-authored writes to catch accidental feedback loops.
        for (let turn = 0; pending.length > 0; turn++) {
          if (turn > 10) throw new Error('theme observer loop')
          const records = pending.splice(0)
          for (const callback of callbacks) callback(records)
        }
      },
      mediaReads: () => mediaReads,
      mutate: (next: string | undefined) => {
        dataset.theme = next
      },
      observed,
      root,
      storageReads: () => storageReads,
      toggle: (next: 'dark' | 'light') => {
        dataset.theme = next
        try {
          localStorage.setItem('theme', next)
        } catch {
          // Match ThemeToggle: retain the DOM preference when persistence fails.
        }
      },
      writes: () => writes,
    }
  }

  it('honors explicit preferences and otherwise follows the system', () => {
    expect(theme('light', true).current()).toBe('light')
    expect(theme('dark', false).current()).toBe('dark')
    expect(theme(null, true).current()).toBe('dark')
    expect(theme('invalid', false).current()).toBe('light')
  })

  it('still resolves the system appearance when storage reads throw', () => {
    expect(theme(null, true, true).current()).toBe('dark')
    expect(theme(null, false, true).current()).toBe('light')
  })

  it('keeps an explicit preference or safe light fallback if media queries fail', () => {
    expect(theme('dark', false, false, true).current()).toBe('dark')
    expect(theme(null, false, true, true).current()).toBe('light')
  })

  it('restores a singleton attribute wipe with a filtered observer and no loop', () => {
    const appearance = theme('dark', false)
    expect(appearance.observed).toEqual([
      {
        target: appearance.root,
        options: {
          attributes: true,
          attributeFilter: ['data-theme'],
          attributeOldValue: true,
        },
      },
    ])
    appearance.mutate(undefined)
    appearance.flush()
    expect(appearance.current()).toBe('dark')
    expect(appearance.writes()).toBe(3)
    appearance.flush()
    expect(appearance.writes()).toBe(3)
    expect(appearance.storageReads()).toBe(1)
    expect(appearance.mediaReads()).toBe(1)
  })

  it('accepts valid user toggles and repairs invalid values without rereading preferences', () => {
    const appearance = theme('light', false)
    appearance.toggle('dark')
    appearance.flush()
    expect(appearance.current()).toBe('dark')
    expect(appearance.writes()).toBe(2)
    appearance.mutate('system')
    appearance.flush()
    expect(appearance.current()).toBe('dark')
    expect(appearance.writes()).toBe(4)
    expect(appearance.storageReads()).toBe(1)
    expect(appearance.mediaReads()).toBe(1)
  })

  it('retains a storage-failed toggle even when the singleton wipe occurs in the same mutation batch', () => {
    const appearance = theme(null, false, true)
    appearance.toggle('dark')
    appearance.mutate(undefined)
    appearance.flush()
    expect(appearance.current()).toBe('dark')
    expect(appearance.writes()).toBe(4)
    expect(appearance.storageReads()).toBe(1)
    expect(appearance.mediaReads()).toBe(1)
  })
})
