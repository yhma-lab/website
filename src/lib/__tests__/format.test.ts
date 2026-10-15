import { describe, expect, it } from 'vitest'

import {
  formatDate,
  formatLongDate,
  formatMonthYear,
  formatYear,
  isFuture,
  shareHref,
  shareTitle,
  timestamp,
} from '../format.ts'

/**
 * The formats reproduce `config/_default/params.yaml`
 * (`locale.date_format: 'Jan 2, 2006'`), the resume blocks' `January 2006`, and
 * the share templates from the former `data/page_sharer.yaml`.
 */
describe('date formatting', () => {
  it('formats the site-wide `Jan 2, 2006` shape', () => {
    expect(formatDate('2026-03-19')).toBe('Mar 19, 2026')
    expect(formatDate('2017-01-01')).toBe('Jan 1, 2017')
  })

  it('formats the resume `January 2006` shape', () => {
    expect(formatMonthYear('2025-07-01')).toBe('July 2025')
  })

  it('formats the long event shape', () => {
    expect(formatLongDate('2021-10-01T13:00:00Z')).toBe('October 1, 2021')
  })

  it('extracts the citation year', () => {
    expect(formatYear('2026-03-19')).toBe('2026')
  })

  it('returns an empty string rather than "Invalid Date"', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('not-a-date')).toBe('')
    expect(formatYear('')).toBe('')
  })
})

describe('sorting', () => {
  it('orders by date and treats missing dates as oldest', () => {
    const items = ['2024-01-01', '2026-03-19', '', '2017-01-01'].map((date) => ({ date }))
    const sorted = items.toSorted((a, b) => timestamp(b.date) - timestamp(a.date))
    expect(sorted.map((item) => item.date)).toEqual(['2026-03-19', '2024-01-01', '2017-01-01', ''])
  })

  it('detects future dates', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    expect(isFuture('2027-01-01', now)).toBe(true)
    expect(isFuture('2025-01-01', now)).toBe(false)
  })
})

describe('share links', () => {
  it('substitutes the encoded title and url', () => {
    expect(shareHref('x', 'https://example.org/a b', 'A & B')).toBe(
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.org%2Fa%20b&text=A%20%26%20B',
    )
    expect(shareHref('email', 'https://example.org/', 'Title')).toBe(
      'mailto:?subject=Title&body=https%3A%2F%2Fexample.org%2F',
    )
  })

  it('names the enabled targets from the former page_sharer config', () => {
    expect(shareTitle('email')).toBe('Email')
    expect(shareTitle('x')).toBe('X')
    expect(shareTitle('linkedin')).toBe('LinkedIn')
  })
})
