/**
 * Report utility functions
 * Copy, download, and format report content
 */

/**
 * Copies report content to clipboard
 */
export async function copyReportToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = content
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Downloads report as text file
 */
export function downloadReportAsText(content: string, filename: string = 'report.txt'): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Gets plain text version of report content
 */
export function getPlainTextReport(formattedContent: string): string {
  // Remove markdown-style formatting and HTML
  return formattedContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/\n{3,}/g, '\n\n') // Normalize newlines
    .trim()
}

