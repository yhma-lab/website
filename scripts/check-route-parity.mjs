#!/usr/bin/env node
/**
 * Check that the English and Chinese sites stay in step.
 *
 * The language switch mirrors the current path onto the other site, so a route
 * that exists on one site but not the other is a broken link. Two checks:
 *
 *  1. both apps declare the same route files under `sites/*\/src/pages/**`;
 *  2. both builds publish the same URL set, when `dist/public` exists.
 *
 *   node scripts/check-route-parity.mjs
 *
 * Exits non-zero listing the difference, so a route added to one app cannot
 * silently go missing on the other.
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

/** Route files an app declares, relative to its `src/pages/`. */
function routeFiles(site) {
  const dir = path.join(ROOT, 'sites', site, 'src', 'pages')
  if (!existsSync(dir)) return []
  return walk(dir)
    .map(file => path.relative(dir, file))
    .sort()
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
  let ok = true

  const [first, second] = SITES
  ok = report('route files', routeFiles(first), routeFiles(second)) && ok

  for (const site of SITES) {
    if (builtRoutes(site) === undefined) {
      console.log(`no sites/${site}/dist/public; skipped the built-route check`)
    }
  }

  const builtFirst = builtRoutes(first)
  const builtSecond = builtRoutes(second)
  if (builtFirst !== undefined && builtSecond !== undefined) {
    ok = report('built routes', builtFirst, builtSecond) && ok
  } else if (builtFirst === undefined || builtSecond === undefined) {
    console.log(
      'run `pnpm build` (or `pnpm build:en`/`pnpm build:cn`) for both sites to compare outputs',
    )
  }

  if (!ok) process.exit(1)
}

main()
