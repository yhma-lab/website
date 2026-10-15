import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

import { contentRoot } from './content-fixtures.ts'

interface Profile {
  title?: string
  first_name?: string
  last_name?: string
  highlight_name?: boolean
}

function profile(slug: string): Profile {
  const file = path.join(contentRoot, 'authors', slug, 'index.mdx')
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'))
  return (parse(match?.[1] ?? '') ?? {}) as Profile
}

/**
 * Reproduces `resolveAuthors`' naming rule without importing the loader, so the
 * test stays fast and independent of the MDX build.
 *
 * The rule mirrors what Hugo rendered: profile `first_name`/`last_name` when the
 * author has a profile, the title-cased key otherwise.
 */
function displayName(slug: string, loaded: Profile | undefined): string {
  const first = loaded?.first_name ?? ''
  const last = loaded?.last_name ?? ''
  const full = [first, last].filter(Boolean).join(' ')
  if (full.length > 0) return full
  if (loaded) return loaded.title ?? slug
  return slug
    .split('-')
    .map((part) => (part.length <= 2 ? part.toUpperCase() : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`))
    .join(' ')
}

describe('author display names', () => {
  it('uses the profile name parts, not the profile title', () => {
    // `congfu`'s profile title is "Congfu" but the old site rendered "Cong Fu".
    expect(displayName('congfu', profile('congfu'))).toBe('Cong Fu')
    expect(displayName('yhma', profile('yhma'))).toBe('Yuhan Ma')
    expect(displayName('hua', profile('hua'))).toBe('Xiuhua Zhao')
  })

  it('title-cases external collaborators who have no profile', () => {
    expect(displayName('c-l-liu', undefined)).toBe('C L Liu')
    expect(displayName('daniel-maria-busiello', undefined)).toBe('Daniel Maria Busiello')
  })

  it('keeps `highlight_name` as the bold flag', () => {
    expect(profile('yhma').highlight_name).toBe(true)
    expect(profile('congfu').highlight_name).toBeUndefined()
  })
})
