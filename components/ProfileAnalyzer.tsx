'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { StreamingReport } from './StreamingReport'
import { ErrorDisplay } from './ui/ErrorDisplay'
import { EmptyState } from './ui/EmptyState'
import { ReportSkeleton } from './ui/Skeleton'
import { validateUsername, sanitizeUsername } from '@/lib/utils'
import { StreamChunk } from '@/types'

export const ProfileAnalyzer: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [streamChunks, setStreamChunks] = useState<StreamChunk[]>([])
  const [hasCompletedReport, setHasCompletedReport] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    // Clear error when user starts typing
    if (error) {
      setError(undefined)
    }
  }, [error])

  const startAnalysis = async (usernameToAnalyze: string) => {
    // Validate username
    const validation = validateUsername(usernameToAnalyze)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // Sanitize username
    const sanitized = sanitizeUsername(usernameToAnalyze)

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setIsAnalyzing(true)
    setError(undefined)
    setStreamChunks([]) // Reset chunks
    setHasCompletedReport(false) // Reset completion flag

    // Create new abort controller
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sanitized }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to start analysis')
      }

      // Handle SSE stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body received')
      }

      let buffer = ''

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

            if (data === '[DONE]' || !data) {
              continue
            }

            try {
              const parsed: StreamChunk = JSON.parse(data)

              // Handle different chunk types
              if (parsed.type === 'error') {
                throw new Error(
                  typeof parsed.data === 'object' && 'message' in parsed.data
                    ? parsed.data.message
                    : 'Analysis error'
                )
              } else if (parsed.type === 'done') {
                // Keep the final 'done' chunk so UI can pick up final metadata
                setStreamChunks((prev) => [...prev, parsed])
                // don't return here — allow loop to finish and handle the stream closure
                // so the component keeps the report visible after streaming ends
                continue
              } else {
                // Accumulate chunks for display
                setStreamChunks((prev) => [...prev, parsed])
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
              console.error('Error parsing chunk:', parseError)
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim()
        if (data && data !== '[DONE]') {
          try {
            const parsed: StreamChunk = JSON.parse(data)
            if (parsed.type === 'done') {
              setStreamChunks((prev) => [...prev, parsed])
            } else if (parsed.type !== 'error') {
              setStreamChunks((prev) => [...prev, parsed])
            }
          } catch (parseError) {
            console.error('Error parsing final chunk:', parseError)
          }
        }
      }

      setIsAnalyzing(false)
      setHasCompletedReport(true) // Mark report as completed
      abortControllerRef.current = null
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was intentionally aborted, don't show error
        setIsAnalyzing(false)
        abortControllerRef.current = null
        return
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to analyze profile. Please try again.'
      )
      setIsAnalyzing(false)
      abortControllerRef.current = null
      console.error('Error analyzing profile:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await startAnalysis(username)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleRetry = () => {
    if (username.trim()) {
      startAnalysis(username)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-heading-md font-bold text-primary-text">Analyze a Profile</h2>
            <p className="text-body text-primary-text-secondary max-w-xl mx-auto">
              Enter an X username to generate comprehensive insights and strategic analysis
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <ErrorDisplay
              error={error}
              onDismiss={() => setError(undefined)}
              onRetry={handleRetry}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                id="username"
                placeholder="Enter username or @username"
                value={username}
                onChange={handleInputChange}
                error={error}
                icon={<Search className="w-5 h-5" />}
                disabled={isAnalyzing}
                aria-label="X username"
                aria-describedby={error ? 'username-error' : undefined}
              />
            </div>
            <div className="sm:w-auto">
              <Button
                type="submit"
                isLoading={isAnalyzing}
                disabled={isAnalyzing || !username.trim()}
                className="w-full sm:w-auto min-w-[140px]"
              >
                Analyze
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Loading Skeleton */}
      {isAnalyzing && streamChunks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card hover={false}>
            <ReportSkeleton />
          </Card>
        </motion.div>
      )}

      {/* Streaming Report */}
      {(streamChunks.length > 0 || isAnalyzing || hasCompletedReport) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StreamingReport streamChunks={streamChunks} isStreaming={isAnalyzing} />
        </motion.div>
      )}
    </div>
  )
}

