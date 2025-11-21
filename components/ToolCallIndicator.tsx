'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { ToolCallData } from '@/types'

interface ToolCallIndicatorProps {
  toolCalls: ToolCallData[]
  isThinking?: boolean
  reasoningTokens?: number
}

export const ToolCallIndicator: React.FC<ToolCallIndicatorProps> = ({
  toolCalls,
  isThinking = false,
  reasoningTokens,
}) => {
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('search')) {
      return <Search className="w-4 h-4" />
    }
    return <Loader2 className="w-4 h-4 animate-spin" />
  }

  const getToolDisplayName = (toolName: string): string => {
    const nameMap: Record<string, string> = {
      x_keyword_search: 'Searching posts',
      x_user_search: 'Searching users',
      x_semantic_search: 'Semantic search',
      x_thread_fetch: 'Fetching thread',
      web_search: 'Web search',
      browse_page: 'Browsing page',
    }
    return nameMap[toolName] || toolName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <AnimatePresence>
      {(toolCalls.length > 0 || isThinking) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-primary-accent-light/30 border border-primary-accent/20 rounded-card p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary-accent-light p-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-primary-accent" />
            </div>
            <div className="flex-1 min-w-0">
              {isThinking && (
                <div className="text-small font-medium text-primary-text mb-2">
                  {reasoningTokens ? (
                    <>Analyzing... ({reasoningTokens.toLocaleString()} reasoning tokens)</>
                  ) : (
                    <>Analyzing...</>
                  )}
                </div>
              )}

              {toolCalls.length > 0 && (
                <div className="space-y-2">
                  {toolCalls.map((toolCall, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 text-small text-primary-text-secondary"
                    >
                      <span className="text-primary-accent">
                        {getToolIcon(toolCall.name)}
                      </span>
                      <span className="font-medium">{getToolDisplayName(toolCall.name)}</span>
                      {toolCall.arguments && (
                        <span className="text-xs text-primary-text-tertiary truncate">
                          {(() => {
                            try {
                              const args = JSON.parse(toolCall.arguments)
                              if (args.query) {
                                return `"${args.query.substring(0, 30)}${args.query.length > 30 ? '...' : ''}"`
                              }
                            } catch {
                              // Ignore parse errors
                            }
                            return ''
                          })()}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

