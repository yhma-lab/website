#!/usr/bin/env node
/**
 * Check that the English and Chinese sites publish the same URLs.
 *
 * The language switch mirrors the current path onto the other site, so a route
 * that exists on one site but not the other is a broken link. Two things keep
 * them in step now:
 *
 *  1. `pnpm test` asserts the shared route table (`sitePages` in
 *     `@yhma/site-kit/router`) serves the same paths in both languages — a route
 *     is declared once, so the declaration cannot drift;
 *  2. this script compares what the two builds actually published, which catches
 *     a route that builds on one site and not the other (a translation the
 *     collection never imported, a path a site file claims, ...).
 *
 *   node scripts/check-route-parity.mjs
 *
 * Exits non-zero listing the difference, so a route cannot silently go missing
 * on one site.
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SITES = ['yhma-yyds-group', 'magroup-ac-cn']

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

/** Routes a built site publishes, as `/path/` strings. */
function builtRoutes(site) {
  const dir = path.join(ROOT, 'sites', site, 'dist', 'public')
  if (!existsSync(dir)) return undefined
  return walk(dir)
    .filter(file => path.basename(file) === 'index.html')
    .map(file => path.relative(dir, path.dirname(file)))
    .map(route => (route === '.' ? '/' : `/${route}/`))
    .sort()
}

function different(expected, actual) {
  const expectedSet = new Set(expected)
  const actualSet = new Set(actual)
  return {
    missing: expected.filter(item => !actualSet.has(item)),
    extra: actual.filter(item => !expectedSet.has(item)),
  }
}

function report(label, expected, actual) {
  const { extra, missing } = different(expected, actual)
  if (missing.length === 0 && extra.length === 0) {
    console.log(`${label}: ${String(expected.length)} entries match`)
    return true
  }
  console.error(`${label}: mismatch`)
  for (const item of missing) console.error(`  only in ${SITES[0]}: ${item}`)
  for (const item of extra) console.error(`  only in ${SITES[1]}: ${item}`)
  return false
}

function main() {
  const [first, second] = SITES
  const builtFirst = builtRoutes(first)
  const builtSecond = builtRoutes(second)

  if (builtFirst === undefined || builtSecond === undefined) {
    for (const site of SITES) {
      if (builtRoutes(site) === undefined) {
        console.log(
          `no sites/${site}/dist/public; skipped the built-route check`,
        )
      }
    }
    console.log(
      'run `pnpm build` (or `pnpm build:en`/`pnpm build:cn`) for both sites to compare outputs',
    )
    return
  }

  if (!report('built routes', builtFirst, builtSecond)) process.exit(1)
}

main()
