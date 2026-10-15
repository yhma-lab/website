import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'yaml'

/** Walk up from this file until the repository root (marked by `pnpm-workspace.yaml`). */
function findRoot(start: string): string {
  let dir = start
  for (;;) {
    if (existsSync(path.join(dir, 'content.generated'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) throw new Error(`no repository root above ${start}`)
    dir = parent
  }
}

const ROOT = findRoot(path.dirname(fileURLToPath(import.meta.url)))

export const contentRoot = path.join(ROOT, 'content.generated')

export interface FrontMatterFile {
  /** `content.generated/<family>/<slug>/index.mdx` relative to the repo root. */
  file: string
  family: string
  /** Directory name, which is the route slug. */
  slug: string
  locale: 'cn' | 'en'
  data: Record<string, unknown>
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function readFrontMatter(file: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'))
  const block = match?.[1]
  if (block === undefined) throw new Error(`${file}: missing front matter`)
  return (parse(block) ?? {}) as Record<string, unknown>
}

/**
 * Every collection entry (`index.mdx` / `index.cn.mdx`), which is the set of
 * files that must satisfy a collection schema.
 */
export function collectionEntries(family?: string): FrontMatterFile[] {
  const families = family
    ? [family]
    : readdirSync(contentRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)

  const out: FrontMatterFile[] = []
  for (const name of families) {
    const base = path.join(contentRoot, name)
    if (!existsSync(base)) continue
    for (const file of walk(base)) {
      const basename = path.basename(file)
      if (basename !== 'index.mdx' && basename !== 'index.cn.mdx') continue
      out.push({
        data: readFrontMatter(file),
        family: name,
        file: path.relative(ROOT, file),
        locale: basename === 'index.cn.mdx' ? 'cn' : 'en',
        slug: path.basename(path.dirname(file)),
      })
    }
  }
  return out
}

/** Author slugs that have a profile directory. */
export function authorSlugs(): string[] {
  return readdirSync(path.join(contentRoot, 'authors'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}
