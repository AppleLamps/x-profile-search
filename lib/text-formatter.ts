/**
 * Text formatting utilities
 * Removes markdown syntax and formats content for display
 */

interface FormattedText {
  type: 'paragraph' | 'heading' | 'list' | 'listItem' | 'text'
  content: string
  level?: number // For headings (1-6)
}

/**
 * Removes markdown syntax and converts to formatted structure
 */
export function parseMarkdown(text: string): FormattedText[] {
  const lines = text.split('\n')
  const result: FormattedText[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      if (inList) {
        inList = false
      }
      continue
    }

    // Headings (# ## ### etc.)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      if (inList) {
        inList = false
      }
      result.push({
        type: 'heading',
        content: headingMatch[2],
        level: headingMatch[1].length,
      })
      continue
    }

    // Unordered list items (- or *)
    const listMatch = line.match(/^[-*]\s+(.+)$/)
    if (listMatch) {
      if (!inList) {
        inList = true
      }
      result.push({
        type: 'listItem',
        content: listMatch[1],
      })
      continue
    }

    // Ordered list items (1. 2. etc.)
    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/)
    if (orderedListMatch) {
      if (!inList) {
        inList = true
      }
      result.push({
        type: 'listItem',
        content: orderedListMatch[1],
      })
      continue
    }

    // Regular paragraph
    if (inList) {
      inList = false
    }

    result.push({
      type: 'paragraph',
      content: line,
    })
  }

  return result
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Formats a single line of text, removing markdown
 */
export function formatInlineText(text: string): string {
  // First escape HTML to prevent XSS
  const escaped = escapeHtml(text)

  return escaped
    // Bold **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic *text* or _text_
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Links [text](url) - keep text only for now
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-primary-background-secondary px-1 py-0.5 rounded text-small">$1</code>')
}

/**
 * Groups formatted text into sections for better rendering
 */
export function groupIntoSections(formatted: FormattedText[]): {
  type: 'heading' | 'paragraph' | 'list'
  items: FormattedText[]
}[] {
  const sections: { type: 'heading' | 'paragraph' | 'list'; items: FormattedText[] }[] = []
  let currentSection: { type: 'heading' | 'paragraph' | 'list'; items: FormattedText[] } | null = null

  for (const item of formatted) {
    if (item.type === 'heading') {
      // Start new section
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        type: 'heading',
        items: [item],
      }
    } else if (item.type === 'listItem') {
      // Add to list section
      if (!currentSection || currentSection.type !== 'list') {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          type: 'list',
          items: [],
        }
      }
      currentSection.items.push(item)
    } else {
      // Regular paragraph
      if (!currentSection || currentSection.type !== 'paragraph') {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          type: 'paragraph',
          items: [],
        }
      }
      currentSection.items.push(item)
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

