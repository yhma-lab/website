/**
 * Résumé entry helpers.
 *
 * Two shapes reached this point from Hugo: the flat `area`/`institution` form
 * (`content/authors/yhma`) and the older Wowchemy `course`/`year` form still used
 * by `cpSun`. Both collapse to a title, a subtitle and a year range.
 */

export interface ExperienceEntry {
  area?: string | undefined
  button?: { text: string; url: string } | undefined
  company_logo?: string | undefined
  company_name?: string | undefined
  company_url?: string | undefined
  course?: string | undefined
  date_end?: string | undefined
  date_start?: string | undefined
  description?: string | undefined
  institution?: string | undefined
  position?: string | undefined
  summary?: string | undefined
  title?: string | undefined
  year?: string | undefined
}

export function entryTitle(entry: ExperienceEntry): string {
  return entry.position ?? entry.area ?? entry.title ?? entry.course ?? ''
}

export function entrySubtitle(entry: ExperienceEntry): string {
  return entry.company_name ?? entry.institution ?? ''
}

/** `2015-09-01` + `2020-06-01`, or the legacy free-form `year` field. */
export function entryYears(entry: ExperienceEntry): string[] {
  if (entry.year !== undefined && entry.year.length > 0) return [entry.year]
  return [entry.date_start, entry.date_end].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  )
}
