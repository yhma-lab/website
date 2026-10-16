import type { AuthorPage } from './source.ts'

import { formatDate } from './format.ts'

export interface ResolvedAuthor {
  /** Slug as written in a publication's `authors:` list. */
  id: string
  /** Human-readable name, matching Hugo's author taxonomy label. */
  name: string
  /** Profile page, when the author has one in `content/authors/`. */
  page: AuthorPage | undefined
  /** Whether this author should be rendered in bold (`highlight_name`). */
  highlight: boolean
  /** Tooltip text from the matching `author_notes` entry, when present. */
  note: string | undefined
}

/**
 * Turn an author key into a display name.
 *
 * The order matches the original rendering. Hugo built the label from the
 * `authors` taxonomy term, whose title is the profile's own `title` when a
 * profile exists and the URL-ised key otherwise. Only the *taxonomy* slug was
 * URL-ised, though, so `congfu` still rendered as "Cong Fu": that comes from the
 * profile's `first_name`/`last_name` pair. Profile title would give "Congfu",
 * which is why the name parts win.
 */
function fallbackName(id: string): string {
  return id
    .split('-')
    .map(part =>
      part.length <= 2
        ? part.toUpperCase()
        : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`,
    )
    .join(' ')
}

/** Index author profiles by their slug, which is how `authors:` entries refer to them. */
export function authorProfiles(
  pages: readonly AuthorPage[],
): Map<string, AuthorPage> {
  const profiles = new Map<string, AuthorPage>()
  for (const page of pages) {
    const slug = page.slugs.at(-1)
    if (slug) profiles.set(slug, page)
  }
  return profiles
}

export function resolveAuthors(
  profiles: ReadonlyMap<string, AuthorPage>,
  ids: readonly string[],
  notes: readonly string[] = [],
): ResolvedAuthor[] {
  return ids.map((id, index) => {
    const page = profiles.get(id)
    const first =
      typeof page?.data.first_name === 'string' ? page.data.first_name : ''
    const last =
      typeof page?.data.last_name === 'string' ? page.data.last_name : ''
    const fullName = [first, last].filter(Boolean).join(' ')

    return {
      highlight: page?.data.highlight_name === true,
      id,
      name:
        fullName.length > 0
          ? fullName
          : page
            ? page.data.title
            : fallbackName(id),
      note: notes[index],
      page,
    }
  })
}

/** `undefined` for authors without a profile page, so callers can render plain text. */
export function authorHref(author: ResolvedAuthor): string | undefined {
  return author.page?.url
}

export { formatDate }
