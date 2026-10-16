/**
 * Path helpers shared by the route table and the site file routes.
 *
 * Waku expands a wildcard route into one static page per param list, and the
 * router has to expand the same way: the catch-all leaves the paths other routes
 * own to those routes, and a file route that repeats one is an error.
 */

/** Whether a route path carries a wildcard or a segment, e.g. `/people/[...slugs]`. */
export function isParameterisedPath(path: string): boolean {
  return /\[.*\]/.test(path)
}

/** Normalise `staticPaths` to lists of segments, Waku's `string[]` shorthand included. */
export function staticPathSegments(
  staticPaths: readonly string[] | readonly (readonly string[])[],
): string[][] {
  return staticPaths.map(item =>
    typeof item === 'string' ? [item] : [...item],
  )
}

/** The concrete route path a param list expands to. */
export function concretePath(segments: readonly string[]): string {
  return `/${segments.join('/')}`
}

/**
 * Every concrete path a route claims.
 *
 * A route without params *is* its concrete path; one with params claims each of
 * its expansions, which is what the catch-all then subtracts from its own.
 */
export function claimedPaths(
  path: string,
  staticPaths?: readonly string[] | readonly (readonly string[])[],
): string[] {
  if (staticPaths === undefined) return [path]
  return staticPathSegments(staticPaths).map(concretePath)
}
