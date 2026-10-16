# Site routes

The routes both sites publish live in `@yhma/site-kit/router` (`sitePages`), one
entry per route and naming the languages it serves. A route that only this site
publishes goes here: one module per route, registered by
`src/waku.server.tsx` for this site's language.

| file                  | route                                           |
| --------------------- | ----------------------------------------------- |
| `join-us.tsx`         | `/join-us`                                      |
| `blog/index.tsx`      | `/blog`                                         |
| `blog/[...slugs].tsx` | `/blog/[...slugs]`, with `staticPaths` exported |

A module default-exports the page component. A wildcard file must also export
`staticPaths` — the concrete params to prerender — because every route in this
repository is `render: 'static'`.

A path segment starting with `_` or `.`, and any file that is not `.ts`/`.tsx`,
is ignored, so co-located modules and this file can sit next to the routes.
`_layout`, `_root` and `_api` are not part of the convention: the document, the
frame and the feed and crawler files are shared by both sites.
