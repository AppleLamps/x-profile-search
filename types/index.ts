export interface StreamChunk {
  type: 'thinking' | 'tool_call' | 'content' | 'done' | 'error'
  data: string | ToolCallData | ErrorData
  reasoningTokens?: number
  citations?: string[]
}

export interface ToolCallData {
  name: string // e.g., "x_keyword_search", "x_user_search", "x_semantic_search"
  arguments: string // JSON string of parameters
}

export interface ErrorData {
  message: string
  code?: string
}

export interface AnalyzeRequest {
  username: string
}

export interface AnalyzeResponse {
  success: boolean
  error?: string
}

