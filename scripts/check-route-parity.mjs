#!/usr/bin/env node
/**
 * Compare the generated site against the routes the Hugo build published.
 *
 * The baseline is `hugo-public/sitemap.xml`, which exists only until the Hugo
 * inputs are removed in the final migration phase. Run this before then:
 *
 *   node scripts/check-route-parity.mjs
 *
 * Exits non-zero when a baseline route has no counterpart, so a ported page
 * cannot silently go missing.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const BASELINE_SITEMAP = path.join(ROOT, 'hugo-public/sitemap.xml')
const OUTPUT = path.join(ROOT, 'dist/public')

/**
 * Routes the migration intentionally does not reproduce.
 *
 * - `/home` was a duplicate of `/` produced by Hugo's `content/home/` section.
 * - `/projects` and `/projects/example` are the theme's starter content, which
 *   was never linked from the menu.
 */
const INTENTIONAL_GAPS = new Set(['/home', '/projects', '/projects/example'])

function baselineRoutes() {
  const xml = readFileSync(BASELINE_SITEMAP, 'utf8')
  const base = /<loc>(https?:\/\/[^/]+)\//.exec(xml)?.[1]
  if (base === undefined) throw new Error('no <loc> in sitemap.xml')

  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].replace(base, ''))
    .map((route) => (route.endsWith('/') ? route.slice(0, -1) : route))
    .map((route) => (route === '' ? '/' : route))
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (entry === 'index.html') out.push(full)
  }
  return out
}

function generatedRoutes() {
  return walk(OUTPUT)
    .map((file) => path.relative(OUTPUT, path.dirname(file)))
    .map((route) => `/${route}`)
    .map((route) => (route === '/.' ? '/' : route))
    .sort()
}

function main() {
  if (!existsSync(BASELINE_SITEMAP)) {
    console.log('No hugo-public/sitemap.xml; the baseline was already removed, nothing to compare.')
    return
  }
  if (!existsSync(OUTPUT)) {
    console.error('No dist/public. Run `pnpm build` first.')
    process.exit(1)
  }

  const expected = baselineRoutes()
  const actual = new Set(generatedRoutes())
  const missing = expected.filter((route) => !actual.has(route) && !INTENTIONAL_GAPS.has(route))

  console.log(`baseline routes: ${expected.length}`)
  console.log(`generated routes: ${actual.size}`)

  if (missing.length > 0) {
    console.error(`\nmissing ${missing.length} route(s) that Hugo published:`)
    for (const route of missing) console.error(`  ${route}`)
    process.exit(1)
  }
  console.log('every baseline route is present')
}

main()
