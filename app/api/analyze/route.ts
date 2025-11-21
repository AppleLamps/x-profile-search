import { NextRequest } from 'next/server'
import { analyzeProfile } from '@/lib/xai-client'
import { validateUsername, sanitizeUsername } from '@/lib/utils'

/**
 * POST /api/analyze
 * Analyzes an X profile using xAI's agentic tool calling API
 * Returns Server-Sent Events (SSE) stream
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request size
    const bodySize = JSON.stringify(body).length
    if (bodySize > 10000) {
      return new Response(
        JSON.stringify({ error: 'Request body too large' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { username } = body

    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate username
    const validation = validateUsername(username)
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        const sendChunk = (data: object) => {
          const chunk = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(chunk))
        }

        const sendError = (error: Error) => {
          sendChunk({
            type: 'error',
            data: {
              message: error.message,
            },
          })
          controller.close()
        }

        try {
          let finalCitations: string[] = []

          await analyzeProfile({
            username: sanitizeUsername(username),
            onChunk: (chunk) => {
              // Validate chunk structure
              if (!chunk || typeof chunk !== 'object') {
                console.warn('Invalid chunk received:', chunk)
                return
              }

              // Extract citations if present (usually in final chunk)
              if (chunk.citations && Array.isArray(chunk.citations)) {
                finalCitations = chunk.citations
              }

              // Transform xAI chunk to our format
              const choices = chunk.choices || []
              const outputs = chunk.output || []

              // Extract content delta from choices (Standard API)
              for (const choice of choices) {
                if (choice.delta?.content) {
                  sendChunk({
                    type: 'content',
                    data: choice.delta.content,
                    reasoningTokens: chunk.usage?.reasoning_tokens,
                  })
                }
              }

              // Extract content from output (Responses API)
              for (const output of outputs) {
                const content = output.delta?.content || output.text
                if (content) {
                  sendChunk({
                    type: 'content',
                    data: content,
                    reasoningTokens: chunk.usage?.reasoning_tokens,
                  })
                }
              }

              // Extract tool calls directly from chunk (not from choices)
              if (chunk.tool_calls && Array.isArray(chunk.tool_calls) && chunk.tool_calls.length > 0) {
                for (const toolCall of chunk.tool_calls) {
                  if (toolCall.function) {
                    sendChunk({
                      type: 'tool_call',
                      data: {
                        name: toolCall.function.name,
                        arguments: toolCall.function.arguments,
                      },
                      reasoningTokens: chunk.usage?.reasoning_tokens,
                    })
                  }
                }
              }

              // Send thinking state if reasoning tokens are present
              if (chunk.usage?.reasoning_tokens && !choices.some(c => c.delta?.content)) {
                sendChunk({
                  type: 'thinking',
                  data: `Thinking... (${chunk.usage.reasoning_tokens} tokens)`,
                  reasoningTokens: chunk.usage.reasoning_tokens,
                })
              }
            },
            onError: (error) => {
              sendError(error)
            },
            onComplete: () => {
              sendChunk({
                type: 'done',
                data: 'Analysis complete',
                citations: finalCitations,
              })
              controller.close()
            },
          })
        } catch (error) {
          sendError(
            error instanceof Error
              ? error
              : new Error('Unknown error occurred')
          )
        }
      },
    })

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    })
  } catch (error) {
    console.error('Error in analyze route:', error)
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

