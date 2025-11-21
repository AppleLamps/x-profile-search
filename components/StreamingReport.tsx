'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Download, Check, ExternalLink } from 'lucide-react'
import { parseMarkdown, formatInlineText, groupIntoSections } from '@/lib/text-formatter'
import { copyReportToClipboard, downloadReportAsText, getPlainTextReport } from '@/lib/report-utils'
import { ToolCallIndicator } from './ToolCallIndicator'
import { ReportSection } from './ReportSection'
import { StreamChunk, ToolCallData } from '@/types'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface StreamingReportProps {
  streamChunks: StreamChunk[]
  isStreaming: boolean
}

export const StreamingReport: React.FC<StreamingReportProps> = ({
  streamChunks,
  isStreaming,
}) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [toolCalls, setToolCalls] = useState<ToolCallData[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [reasoningTokens, setReasoningTokens] = useState<number | undefined>()
  const [copied, setCopied] = useState(false)
  const [citations, setCitations] = useState<string[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

  // Process chunks and update displayed content (memoized)
  const processedData = useMemo(() => {
    let content = ''
    const calls: ToolCallData[] = []
    let thinking = false
    let tokens: number | undefined
    let extractedCitations: string[] = []

    for (const chunk of streamChunks) {
      if (chunk.type === 'content' && typeof chunk.data === 'string') {
        content += chunk.data
      } else if (chunk.type === 'tool_call') {
        calls.push(chunk.data as ToolCallData)
      } else if (chunk.type === 'thinking') {
        thinking = true
        if (chunk.reasoningTokens) {
          tokens = chunk.reasoningTokens
        }
      } else if (chunk.type === 'done' && chunk.citations) {
        extractedCitations = chunk.citations
      }
    }

    return { content, calls, thinking, tokens, citations: extractedCitations }
  }, [streamChunks])

  useEffect(() => {
    setDisplayedContent(processedData.content)
    setToolCalls(processedData.calls)
    setIsThinking(processedData.thinking && isStreaming)
    setReasoningTokens(processedData.tokens)
    setCitations(processedData.citations)
  }, [processedData, isStreaming])

  // Debounced auto-scroll
  useEffect(() => {
    if (!contentRef.current || !isStreaming) return

    const timeoutId = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [displayedContent, isStreaming])

  // Parse and format content (memoized)
  const { formattedContent, sections } = useMemo(() => {
    const formatted = parseMarkdown(displayedContent)
    const grouped = groupIntoSections(formatted)
    return { formattedContent: formatted, sections: grouped }
  }, [displayedContent])

  // Extract section titles and group content by sections
  const reportSections: Array<{
    title: string
    content: typeof sections
    startIndex: number
  }> = []

  let currentSection: typeof reportSections[0] | null = null

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    if (section.type === 'heading' && section.items.length > 0) {
      // Start new section
      if (currentSection) {
        reportSections.push(currentSection)
      }
      currentSection = {
        title: section.items[0].content,
        content: [],
        startIndex: i,
      }
    } else if (currentSection) {
      // Add to current section
      currentSection.content.push(section)
    } else {
      // Content before first heading - create default section
      if (!currentSection) {
        currentSection = {
          title: 'Report',
          content: [],
          startIndex: i,
        }
      }
      currentSection.content.push(section)
    }
  }

  if (currentSection) {
    reportSections.push(currentSection)
  }

  const handleCopy = useCallback(async () => {
    const plainText = getPlainTextReport(displayedContent)
    const success = await copyReportToClipboard(plainText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [displayedContent])

  const handleDownload = useCallback(() => {
    const plainText = getPlainTextReport(displayedContent)
    const timestamp = new Date().toISOString().split('T')[0]
    downloadReportAsText(plainText, `x-profile-report-${timestamp}.txt`)
  }, [displayedContent])

  if (!displayedContent && !isStreaming && streamChunks.length === 0) {
    return null
  }

  return (
    <Card hover={false} className="shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div>
            <h2 className="text-heading-md font-bold text-primary-text mb-1">Research Report</h2>
            <div className="flex items-center gap-2">
              {isStreaming ? (
                <>
                  <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" />
                  <p className="text-small text-primary-text-secondary">
                    Generating report...
                  </p>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-primary-success" />
                  <p className="text-small text-primary-text-secondary">
                    Report complete
                  </p>
                </>
              )}
            </div>
          </div>

          {!isStreaming && displayedContent && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="h-9 px-3 text-small"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="h-9 px-3 text-small"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tool Call Progress */}
      <ToolCallIndicator
        toolCalls={toolCalls}
        isThinking={isThinking}
        reasoningTokens={reasoningTokens}
      />

      {/* Report Content */}
      <div
        ref={contentRef}
        className="max-w-none text-primary-text max-h-[600px] sm:max-h-[700px] lg:max-h-[900px] overflow-y-auto pr-2 -mr-2"
      >
        {reportSections.length > 0 ? (
          reportSections.map((section, sectionIndex) => (
            <ReportSection
              key={sectionIndex}
              title={section.title}
              collapsible={reportSections.length > 1}
              defaultCollapsed={false}
            >
              <div className="space-y-4">
                {section.content.map((contentSection, contentIndex) => (
                  <div key={contentIndex}>
                    {contentSection.type === 'heading' && contentSection.items.length > 0 && (
                      <div className="mb-3">
                        {contentSection.items.map((item, itemIndex) => {
                          const level = item.level || 1
                          const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements
                          return (
                            <HeadingTag
                              key={itemIndex}
                              className={`font-semibold text-primary-text mb-2 ${level === 1
                                ? 'text-heading-md'
                                : level === 2
                                  ? 'text-heading-sm'
                                  : 'text-body font-medium'
                                }`}
                            >
                              {item.content}
                            </HeadingTag>
                          )
                        })}
                      </div>
                    )}

                    {contentSection.type === 'list' && (
                      <ul className="list-none space-y-2 mb-4">
                        {contentSection.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-body leading-body"
                          >
                            <span className="text-primary-accent mt-1 flex-shrink-0">•</span>
                            <span
                              className="flex-1"
                              dangerouslySetInnerHTML={{
                                __html: formatInlineText(item.content),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}

                    {contentSection.type === 'paragraph' && (
                      <div className="space-y-3 mb-4">
                        {contentSection.items.map((item, itemIndex) => (
                          <p
                            key={itemIndex}
                            className="text-body leading-body text-primary-text"
                            dangerouslySetInnerHTML={{
                              __html: formatInlineText(item.content),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ReportSection>
          ))
        ) : (
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.type === 'heading' && section.items.length > 0 && (
                  <div className="mb-4">
                    {section.items.map((item, itemIndex) => {
                      const level = item.level || 1
                      const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
                      return (
                        <HeadingTag
                          key={itemIndex}
                          className={`font-bold text-primary-text mb-2 ${level === 1
                            ? 'text-heading-lg'
                            : level === 2
                              ? 'text-heading-md'
                              : level === 3
                                ? 'text-heading-sm'
                                : 'text-body'
                            }`}
                        >
                          {item.content}
                        </HeadingTag>
                      )
                    })}
                  </div>
                )}

                {section.type === 'list' && (
                  <ul className="list-none space-y-2 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-body"
                      >
                        <span className="text-primary-accent mt-1">•</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatInlineText(item.content),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {section.type === 'paragraph' && (
                  <div className="space-y-3 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <p
                        key={itemIndex}
                        className="text-body leading-body text-primary-text"
                        dangerouslySetInnerHTML={{
                          __html: formatInlineText(item.content),
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-primary-accent ml-1"
          />
        )}
      </div>

      {/* Citations (subtle) */}
      {citations.length > 0 && !isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-6 border-t border-primary-border"
        >
          <p className="text-xs text-primary-text-secondary mb-2">Sources:</p>
          <div className="flex flex-wrap gap-2">
            {citations.slice(0, 5).map((citation, index) => (
              <a
                key={index}
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-text-secondary hover:text-primary-accent transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{citation}</span>
              </a>
            ))}
            {citations.length > 5 && (
              <span className="text-xs text-primary-text-secondary">
                +{citations.length - 5} more
              </span>
            )}
          </div>
        </motion.div>
      )}

    </Card>
  )
}

