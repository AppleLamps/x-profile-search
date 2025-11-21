/**
 * xAI API Client
 * Handles communication with xAI API for profile analysis
 */

const XAI_API_BASE_URL = process.env.XAI_API_BASE_URL || 'https://api.x.ai/v1'
const XAI_API_TIMEOUT = 3600000 // 3600 seconds = 1 hour for reasoning models

export interface XAIToolCall {
  function: {
    name: string
    arguments: string
  }
}

export interface XAIStreamChunk {
  id?: string
  object?: string
  created?: number
  model?: string
  choices?: Array<{
    index?: number
    delta?: {
      content?: string
      role?: string
    }
  }>
  // Support for Responses API output format
  output?: Array<{
    index?: number
    delta?: {
      content?: string
      role?: string
    }
    text?: string // Some APIs use text instead of delta.content
  }>
  tool_calls?: Array<{
    function: {
      name: string
      arguments: string
    }
  }>
  usage?: {
    reasoning_tokens?: number
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  system_fingerprint?: string
  citations?: string[]
}

export interface AnalyzeProfileOptions {
  username: string
  onChunk: (chunk: XAIStreamChunk) => void
  onError: (error: Error) => void
  onComplete: () => void
}

/**
 * Analyzes an X profile using xAI's agentic tool calling API
 */
export async function analyzeProfile({
  username,
  onChunk,
  onError,
  onComplete,
}: AnalyzeProfileOptions): Promise<void> {
  const apiKey = process.env.XAI_API_KEY

  if (!apiKey) {
    throw new Error('XAI_API_KEY environment variable is not set')
  }

  // Sanitize username (remove @ if present)
  const cleanUsername = username.trim().replace(/^@/, '')

  const systemPrompt = `You are an expert social media analyst specializing in comprehensive profile research. Your task is to conduct thorough research on X (Twitter) profiles and generate detailed, professional research reports.

When analyzing a profile, you should:
1. Search across different time periods to understand posting patterns and evolution
2. Identify key themes, topics, and interests
3. Analyze engagement patterns and audience interaction
4. Highlight notable posts, threads, or content
5. Provide insights into the account's communication style and content strategy
6. Note any significant changes or trends over time

Structure your report with:
- Executive Summary
- Time Period Analysis (recent, mid-term, long-term)
- Key Themes & Topics
- Engagement Patterns
- Notable Posts/Threads
- Overall Assessment

Be thorough, objective, and professional in your analysis.`

  const userPrompt = `Conduct comprehensive research on the X profile @${cleanUsername}. Analyze their posts across different time periods, identify key themes and topics, examine engagement patterns, and highlight notable content. Provide a detailed research report with insights into their posting behavior, content strategy, and overall profile characteristics.`

  const requestBody = {
    model: process.env.XAI_MODEL || 'grok-4-1-fast-reasoning-latest',
    input: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    tools: [
      {
        type: 'x_search',
        allowed_x_handles: [cleanUsername],
        enable_image_understanding: true,
        enable_video_understanding: true,
      },
    ],
    stream: true,
  }

  const controller = new AbortController()
  let timeoutId: NodeJS.Timeout | null = null

  try {
    timeoutId = setTimeout(() => controller.abort(), XAI_API_TIMEOUT)

    const response = await fetch(`${XAI_API_BASE_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message ||
        `xAI API error: ${response.status} ${response.statusText}`
      )
    }

    if (!response.body) {
      throw new Error('No response body received from xAI API')
    }

    // Parse SSE stream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let parseErrorCount = 0
    const MAX_PARSE_ERRORS = 10

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()

          if (data === '[DONE]') {
            onComplete()
            return
          }

          try {
            const chunk: XAIStreamChunk = JSON.parse(data)
            parseErrorCount = 0 // Reset on success
            onChunk(chunk)
          } catch (parseError) {
            parseErrorCount++
            console.error('Error parsing SSE chunk:', parseError)
            if (parseErrorCount >= MAX_PARSE_ERRORS) {
              onError(new Error('Too many parsing errors, stream may be corrupted'))
              return
            }
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.startsWith('data: ')) {
      const data = buffer.slice(6).trim()
      if (data && data !== '[DONE]') {
        try {
          const chunk: XAIStreamChunk = JSON.parse(data)
          onChunk(chunk)
        } catch (parseError) {
          console.error('Error parsing final SSE chunk:', parseError)
        }
      }
    }

    onComplete()
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        onError(new Error('Request timeout: Analysis took too long'))
      } else {
        onError(error)
      }
    } else {
      onError(new Error('Unknown error occurred'))
    }
  }
}

