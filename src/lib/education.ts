import type { ExperienceEntry } from '@/components/bio-text.ts'

/**
 * Normalize an author's `education` field.
 *
 * Two shapes exist: the modern flat array (`content/authors/yhma`) and the older
 * Wowchemy `{ courses: [...] }` wrapper still used by `content/authors/cpsun`.
 */
export function normalizeEducation(value: unknown): ExperienceEntry[] {
  if (Array.isArray(value)) return value as ExperienceEntry[]
  if (value !== null && typeof value === 'object' && 'courses' in value) {
    const courses = (value as { courses?: unknown }).courses
    if (Array.isArray(courses)) return courses as ExperienceEntry[]
  }
  return []
}
