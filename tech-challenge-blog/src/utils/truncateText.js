/**
 * Truncates a text string to the specified maximum length.
 * Appends ellipsis if truncation occurs and breaks at word boundary.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum number of characters (default 150)
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 150) {
  if (!text) return ''
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Truncates text to a specific number of words.
 * @param {string} text
 * @param {number} maxWords - Maximum words (default 30)
 * @returns {string}
 */
export function truncateWords(text, maxWords = 30) {
  if (!text) return ''

  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text

  return words.slice(0, maxWords).join(' ') + '...'
}
