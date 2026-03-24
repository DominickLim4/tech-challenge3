import { describe, it, expect } from 'vitest'
import { truncateText, truncateWords } from './truncateText'

describe('truncateText', () => {
  it('should return the original text if it is within the limit', () => {
    const text = 'Hello world'
    expect(truncateText(text, 20)).toBe(text)
  })

  it('should truncate text to the specified length and add ellipsis', () => {
    const text = 'This is a long text that should be truncated'
    const result = truncateText(text, 20)
    expect(result.length).toBeLessThanOrEqual(23) // 20 chars + '...'
    expect(result).toMatch(/\.\.\.$/)
  })

  it('should break at word boundary', () => {
    const text = 'Hello beautiful world of testing'
    const result = truncateText(text, 15)
    expect(result).not.toContain('beautiful')
    expect(result).toMatch(/\.\.\.$/)
  })

  it('should use 150 as default max length', () => {
    const text = 'a'.repeat(200)
    const result = truncateText(text)
    expect(result.length).toBeLessThanOrEqual(153)
  })

  it('should return empty string for null', () => {
    expect(truncateText(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(truncateText(undefined)).toBe('')
  })

  it('should return empty string for empty string', () => {
    expect(truncateText('')).toBe('')
  })

  it('should handle text without spaces', () => {
    const text = 'a'.repeat(20)
    const result = truncateText(text, 10)
    expect(result).toMatch(/\.\.\.$/)
  })
})

describe('truncateWords', () => {
  it('should return original text if word count is within limit', () => {
    const text = 'Hello world'
    expect(truncateWords(text, 5)).toBe(text)
  })

  it('should truncate to the specified number of words', () => {
    const text = 'one two three four five six seven'
    const result = truncateWords(text, 4)
    expect(result).toBe('one two three four...')
  })

  it('should return empty string for null', () => {
    expect(truncateWords(null)).toBe('')
  })
})
