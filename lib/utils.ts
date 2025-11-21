/**
 * Validates an X (Twitter) username
 * @param username - The username to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateUsername(username: string): {
  isValid: boolean
  error?: string
} {
  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      error: 'Username is required',
    }
  }

  // Remove @ if present
  const cleanUsername = username.trim().replace(/^@/, '')

  // X username rules: 1-15 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{1,15}$/

  if (!usernameRegex.test(cleanUsername)) {
    return {
      isValid: false,
      error: 'Username must be 1-15 characters and contain only letters, numbers, and underscores',
    }
  }

  return {
    isValid: true,
  }
}

/**
 * Sanitizes a username by removing @ and trimming
 */
export function sanitizeUsername(username: string): string {
  return username.trim().replace(/^@/, '')
}

/**
 * Formats a username for display
 */
export function formatUsername(username: string): string {
  const sanitized = sanitizeUsername(username)
  return `@${sanitized}`
}

