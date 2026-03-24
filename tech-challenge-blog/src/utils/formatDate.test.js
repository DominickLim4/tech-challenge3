import { describe, it, expect } from 'vitest'
import { formatDate, formatDateShort, formatRelativeDate } from './formatDate'

describe('formatDate', () => {
  it('should format a valid ISO date string to Brazilian Portuguese', () => {
    // Use noon UTC to avoid timezone boundary issues
    const result = formatDate('2024-06-15T12:00:00.000Z')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })

  it('should include the month name in Portuguese', () => {
    const result = formatDate('2024-06-15T12:00:00.000Z')
    expect(result).toMatch(/junho/i)
  })

  it('should return empty string for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('should return empty string for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('should accept a Date object', () => {
    const date = new Date(2024, 5, 15) // June 15 2024 local time
    const result = formatDate(date)
    expect(result).toMatch(/2024/)
  })
})

describe('formatDateShort', () => {
  it('should format date as dd/mm/yyyy', () => {
    const result = formatDateShort('2024-03-25T12:00:00.000Z')
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('should return empty string for null', () => {
    expect(formatDateShort(null)).toBe('')
  })
})

describe('formatRelativeDate', () => {
  it('should return "agora mesmo" for very recent dates', () => {
    const recent = new Date(Date.now() - 30 * 1000) // 30 seconds ago
    expect(formatRelativeDate(recent)).toBe('agora mesmo')
  })

  it('should return minutes ago for dates within an hour', () => {
    const minutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeDate(minutesAgo)).toBe('há 5 minutos')
  })

  it('should return singular minute for 1 minute ago', () => {
    const oneMinuteAgo = new Date(Date.now() - 90 * 1000)
    expect(formatRelativeDate(oneMinuteAgo)).toBe('há 1 minuto')
  })

  it('should return hours ago for dates within a day', () => {
    const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeDate(hoursAgo)).toBe('há 3 horas')
  })

  it('should return days ago for dates within a month', () => {
    const daysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(daysAgo)).toBe('há 7 dias')
  })

  it('should return empty string for null', () => {
    expect(formatRelativeDate(null)).toBe('')
  })
})
