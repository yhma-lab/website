import { timestamp } from './format.ts'
import { authors, events, fundings, publications } from './source.ts'

import type { AuthorPage, EventPage, FundingPage, PublicationPage } from './source.ts'

/**
 * Ordering rules, matching what the Hugo templates produced.
 *
 * - publications, fundings and events: newest first (`order: desc`).
 * - people: grouped by `user_groups` in the order declared by the section, and
 *   within a group by `Params.last_name` ascending.
 */

const USER_GROUPS = [
  'Principal Investigator',
  'Faculty Members',
  'Postdoctoral Scholars',
  'Graduate Students',
  'Students',
  'Research Assistants',
  'Collaborators',
  'Visiting Scholars',
  'Alumni',
] as const

export type UserGroup = (typeof USER_GROUPS)[number]

/** Every supported `user_groups` value, in display order. */
export function peopleGroups(): string[] {
  return [...USER_GROUPS]
}

function byDateDesc<T extends { data: { date?: string } }>(items: T[]): T[] {
  return items.toSorted((a, b) => timestamp(b.data.date) - timestamp(a.data.date))
}

export function sortedPublications(): PublicationPage[] {
  return byDateDesc(publications.getPages())
}

export function featuredPublications(): PublicationPage[] {
  return sortedPublications().filter((page) => page.data.featured)
}

export function sortedFundings(): FundingPage[] {
  return byDateDesc(fundings.getPages())
}

export function sortedEvents(): EventPage[] {
  return byDateDesc(events.getPages())
}

export function findPublication(slugs: string[]): PublicationPage | undefined {
  return publications.getPages().find((page) => sameSlugs(page.slugs, slugs))
}

export function findFunding(slugs: string[]): FundingPage | undefined {
  return fundings.getPages().find((page) => sameSlugs(page.slugs, slugs))
}

export function findEvent(slugs: string[]): EventPage | undefined {
  return events.getPages().find((page) => sameSlugs(page.slugs, slugs))
}

export function findAuthor(slugs: string[]): AuthorPage | undefined {
  return authors.getPages().find((page) => sameSlugs(page.slugs, slugs))
}

function sameSlugs(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((segment, index) => segment === b[index])
}

/** People grouped for the "Meet the incredible team" block, in declaration order. */
export function peopleByGroup(
  groups: readonly string[] = USER_GROUPS,
): { group: string; people: AuthorPage[] }[] {
  const pages = authors.getPages()
  return groups
    .map((group) => ({
      group,
      people: pages
        .filter((page) => asStringArray(page.data.user_groups).includes(group))
        .toSorted((a, b) => lastName(a).localeCompare(lastName(b))),
    }))
    .filter((entry) => entry.people.length > 0)
}

function lastName(page: AuthorPage): string {
  const value = page.data.last_name
  return typeof value === 'string' && value.length > 0 ? value : page.data.title
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}
