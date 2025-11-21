/**
 * Performance utilities
 * Debouncing, throttling, and optimization helpers
 */

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Check if code is running in browser
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (!isBrowser) return false
  return window.innerWidth < 640
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (!isBrowser) return false
  return window.innerWidth >= 640 && window.innerWidth < 1024
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (!isBrowser) return false
  return window.innerWidth >= 1024
}

