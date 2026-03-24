/**
 * Formats a date string or Date object to Brazilian Portuguese format.
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ''

  const defaultOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }

  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * Formats a date to a short Brazilian format (dd/mm/yyyy).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
  return formatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Returns a relative time string in Portuguese (e.g., "há 2 dias").
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeDate(date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ''

  const now = new Date()
  const diffMs = now - dateObj
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return 'agora mesmo'
  if (diffMinutes < 60) return `há ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 30) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
  if (diffMonths < 12) return `há ${diffMonths} ${diffMonths > 1 ? 'meses' : 'mês'}`
  return `há ${diffYears} ano${diffYears > 1 ? 's' : ''}`
}
